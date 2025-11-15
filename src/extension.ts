// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import * as prettier from 'prettier'
import * as stylusSupremacy from 'stylus-supremacy'
import type { FormattingOptions as StylusFormattingOptions } from 'stylus-supremacy'

interface ExtensionOptions {
  stylusSupremacyConfigFileName?: string
  prettierBaseDirectory?: string
}

const extensionOptions: ExtensionOptions = {
  stylusSupremacyConfigFileName: '.stylusrc',
  prettierBaseDirectory: undefined,
}

class Formatter implements vscode.DocumentFormattingEditProvider {
  private extensionOptions: ExtensionOptions

  constructor() {
    this.extensionOptions = extensionOptions
  }

  configure() {
    // Nothing to configure yet
    const config = vscode.workspace.getConfiguration('prettylus')
    for (let name in extensionOptions) {
      if (config.has(name)) {
        this.extensionOptions[name as keyof ExtensionOptions] = config.get(name)
      }
    }
  }

  private findConfigFileOptions(
    document: vscode.TextDocument,
    rootPath?: string,
    configFileName?: string
  ): object {
    let configFilePath = null

    // Skip if there is no working directories (anonymous window) or no config file name
    if (rootPath !== undefined && configFileName !== undefined) {
      if (document.isUntitled === false && document.fileName.startsWith(rootPath)) {
        // Find config file starting from the current active document up to the working directory
        const pathList = document.fileName
          .substring(rootPath.length)
          .split(/(\\|\/)/)
          .filter((pathSegment: string) => pathSegment.length > 0)
        pathList.pop() // Remove the file name
        while (pathList.length >= 0) {
          const workPath = path.join(rootPath, ...pathList, configFileName)
          if (fs.existsSync(workPath)) {
            configFilePath = workPath
            break
          } else if (pathList.length === 0) {
            break
          }
          pathList.pop()
        }
      } else {
        // Find config file in the working directory
        const workPath = path.join(rootPath, configFileName)
        if (fs.existsSync(workPath) === false) {
          configFilePath = workPath
        }
      }
    }
    // Read config file and convert it to an options object
    if (configFilePath) {
      try {
        return JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
      } catch (ex) {
        vscode.window.showWarningMessage('Malformed JSON in config file: ' + configFilePath)
        console.error(ex)
      }
    }
    return {}
  }

  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    return this.format(document, options, token)
  }

  private format(
    document: vscode.TextDocument,
    documentOptions: vscode.FormattingOptions,
    cancellationToken?: vscode.CancellationToken
  ): vscode.TextEdit[] | null {
    const rootDirx = vscode.workspace.getWorkspaceFolder(document.uri)
    const rootPath = rootDirx ? rootDirx.uri.fsPath : undefined
    const documentPath = document.uri.fsPath

    try {
      const range = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE)

      // Determine prettier base directory for config resolution
      // If configured, use a file path in that directory to resolve config and plugins
      let prettierConfigPath = documentPath
      if (this.extensionOptions.prettierBaseDirectory && rootPath) {
        const configuredBasePath = path.isAbsolute(this.extensionOptions.prettierBaseDirectory)
          ? this.extensionOptions.prettierBaseDirectory
          : path.join(rootPath, this.extensionOptions.prettierBaseDirectory)
        if (fs.existsSync(configuredBasePath)) {
          // Use a dummy file path in the base directory for config resolution
          // This ensures prettier finds config files and node_modules from the base directory
          prettierConfigPath = path.join(configuredBasePath, 'dummy.vue')
        }
      }

      // Get prettier config using builtin prettier resolver
      // prettier.resolveConfig.sync expects a file path, not a directory
      // It will search upward from this path to find .prettierrc, package.json, etc.
      const resolvedPrettierConfig = prettier.resolveConfig.sync(prettierConfigPath, {
        useCache: false,
      })

      const prettierOptions: prettier.Options = {
        ...resolvedPrettierConfig,
        parser: 'vue',
      }

      // Apply prettier to the full text (it will handle pug template and script)
      // Pass file path to prettier.format so it can resolve plugins and configs properly
      const text = document.getText(range)
      let outputContent = prettier.format(text, {
        ...prettierOptions,
        filepath: documentPath,
      })

      // Get stylusrc options and create full formatting options object
      const resolvedStylusConfig = this.findConfigFileOptions(
        document,
        rootPath,
        extensionOptions.stylusSupremacyConfigFileName
      ) as StylusFormattingOptions

      const stylusSupremacyOptions: StylusFormattingOptions = {
        tabStopChar: documentOptions.insertSpaces ? ' '.repeat(documentOptions.tabSize) : '\t',
        newLineChar: document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n',
        ...resolvedStylusConfig,
      }

      // Select text that is contained between <style lang="stylus"> and </style>, all potential occurrences
      const styleMatches = [...text.matchAll(/<style[^>]*\s+lang="stylus"[^>]*>/g)]
      for (let styleMatch of styleMatches) {
        const startStyleTag = styleMatch?.[0]
        const startStyleIndex = styleMatch?.index
        if (startStyleTag && startStyleIndex) {
          const endStyleIndex = text.slice(startStyleIndex).indexOf('</style>') + startStyleIndex
          const rangeStyle = new vscode.Range(
            document.positionAt(startStyleIndex + startStyleTag.length),
            document.positionAt(endStyleIndex)
          )
          const style = document.getText(rangeStyle)
          const formattedStyle = stylusSupremacy.format(style, stylusSupremacyOptions)
          outputContent = outputContent.replace(style, formattedStyle)
        }
      }

      if (
        (cancellationToken && cancellationToken.isCancellationRequested === true) ||
        outputContent.length === 0
      ) {
        return null
      } else {
        return [vscode.TextEdit.replace(range, outputContent)]
      }
    } catch (ex: any) {
      vscode.window.showWarningMessage(ex.message)
      console.error(ex)
      return null
    }
  }
}

const formatter = new Formatter()

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Initialize settings
  formatter.configure()

  // Update settings
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(() => {
      formatter.configure()
    })
  )

  // Subscribe "format document" event
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider('vue', formatter)
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
