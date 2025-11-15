import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import type { FormattingOptions as StylusFormattingOptions } from 'stylus-supremacy'
import type * as prettier from 'prettier'
import { loadPrettierModule } from './prettier-loader'
import { loadStylusSupremacyModule, type StylusSupremacyModule } from './stylus-supremacy-loader'
import { type ExtensionOptions, loadConfiguration } from './config'
import { findStylusConfig, createStylusOptions } from './stylus-config'
import { logger } from './logger'

type PrettierOptions = prettier.Options

export class Formatter
  implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider
{
  private extensionOptions: ExtensionOptions

  constructor() {
    this.extensionOptions = loadConfiguration()
    logger.log('Formatter initialized with options:', this.extensionOptions)
  }

  configure(): void {
    this.extensionOptions = loadConfiguration()
    logger.log('Formatter reconfigured with options:', this.extensionOptions)
  }

  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    return this.format(document, options, token)
  }

  provideDocumentRangeFormattingEdits(
    document: vscode.TextDocument,
    range: vscode.Range,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    return this.format(document, options, token, range)
  }

  private async format(
    document: vscode.TextDocument,
    documentOptions: vscode.FormattingOptions,
    cancellationToken?: vscode.CancellationToken,
    _range?: vscode.Range,
  ): Promise<vscode.TextEdit[] | null> {
    const rootDir = vscode.workspace.getWorkspaceFolder(document.uri)
    const rootPath = rootDir ? rootDir.uri.fsPath : undefined
    const documentPath = document.uri.fsPath

    logger.log('Formatting document:', {
      documentPath,
      rootPath,
      language: document.languageId,
    })

    try {
      const fullRange = new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE)
      const text = document.getText(fullRange)

      const prettierBasePath = this.resolvePrettierBasePath(rootPath)
      const prettierConfigPath = this.resolvePrettierConfigPath(
        prettierBasePath,
        rootPath,
        documentPath,
      )
      // Always use the actual document path for proper plugin resolution
      const prettierFormatFilePath = documentPath

      logger.log('Prettier paths resolved:', {
        prettierBasePath,
        prettierConfigPath,
        prettierFormatFilePath,
      })

      logger.log('Loading Prettier module...')
      const prettierContext = loadPrettierModule(prettierBasePath, rootPath)
      const prettierModule = prettierContext.module
      logger.log('Prettier loaded from:', prettierContext.resolveFrom)

      // Resolve config and load plugins
      logger.log('Resolving Prettier config from:', prettierConfigPath)
      const resolvedPrettierConfig = await prettierModule.resolveConfig(prettierConfigPath, {
        useCache: false,
      })
      logger.log('Resolved Prettier config:', resolvedPrettierConfig)

      // Process plugins if specified in config
      let processedPlugins: any[] = []
      if (resolvedPrettierConfig?.plugins) {
        logger.log('Plugins specified in config:', resolvedPrettierConfig.plugins)
        const pluginList = Array.isArray(resolvedPrettierConfig.plugins)
          ? resolvedPrettierConfig.plugins
          : [resolvedPrettierConfig.plugins]

        for (const plugin of pluginList) {
          if (typeof plugin === 'string') {
            logger.log(`Attempting to load plugin: ${plugin}`)
            try {
              // Try to require the plugin using the context's require
              const loadedPlugin = prettierContext.requireFromBase(plugin)
              // Ensure the loaded plugin has the expected structure
              if (
                loadedPlugin &&
                (loadedPlugin.parsers || loadedPlugin.printers || loadedPlugin.languages)
              ) {
                processedPlugins.push(loadedPlugin)
                logger.log(`Successfully loaded plugin: ${plugin}`, {
                  hasParser: !!loadedPlugin.parsers,
                  hasPrinters: !!loadedPlugin.printers,
                  hasLanguages: !!loadedPlugin.languages,
                })
              } else {
                logger.warn(`Loaded plugin ${plugin} but it doesn't have expected structure`)
                // Try using the default export if available
                if (loadedPlugin.default) {
                  processedPlugins.push(loadedPlugin.default)
                  logger.log(`Using default export for plugin: ${plugin}`)
                } else {
                  logger.error(`Plugin ${plugin} doesn't have the expected structure`)
                }
              }
            } catch (err: any) {
              logger.error(`Failed to load plugin ${plugin}:`, {
                message: err?.message,
                stack: err?.stack,
              })
              // Don't add the string plugin name, as it will cause resolution errors
            }
          } else if (plugin && typeof plugin === 'object') {
            // Plugin is already an object, use it directly
            logger.log('Plugin already loaded as object')
            processedPlugins.push(plugin)
          }
        }
        logger.log(`Total plugins processed: ${processedPlugins.length}`)
      } else {
        logger.log('No plugins specified in Prettier config')
      }

      // Build Prettier options with processed plugins
      // Remove plugins from resolved config to avoid string resolution issues
      const { plugins: _originalPlugins, ...configWithoutPlugins } = resolvedPrettierConfig || {}

      const prettierOptions: PrettierOptions = {
        ...configWithoutPlugins,
        parser: 'vue',
        // Only include plugins if we successfully processed them
        ...(processedPlugins.length > 0 && { plugins: processedPlugins }),
      }

      logger.log('Final Prettier options:', {
        parser: prettierOptions.parser,
        pluginCount: prettierOptions.plugins ? prettierOptions.plugins.length : 0,
        hasPlugins: !!prettierOptions.plugins,
        filepath: prettierFormatFilePath,
      })

      // Log detailed plugin info for debugging
      if (prettierOptions.plugins) {
        logger.log(
          'Plugin details:',
          prettierOptions.plugins.map((p: any, i: number) => ({
            index: i,
            type: typeof p,
            isString: typeof p === 'string',
            hasProperties: typeof p === 'object' ? Object.keys(p).slice(0, 5) : undefined,
          })),
        )
      }

      logger.log('Formatting with Prettier...')
      let outputContent: string

      // Use a dummy filepath to prevent Prettier from re-reading config with plugin strings
      // Keep only the extension for parser detection
      const fileExtension = path.extname(prettierFormatFilePath)
      const dummyFilepath = `/tmp/dummy${fileExtension}`

      try {
        outputContent = await prettierModule.format(text, {
          ...prettierOptions,
          filepath: dummyFilepath,
        })
        logger.log('Prettier formatting complete')
      } catch (formatError: any) {
        // If formatting fails, try without plugins
        logger.error('Prettier formatting failed with plugins:', {
          message: formatError?.message,
          stack: formatError?.stack,
        })

        // Check if error is related to plugin loading
        if (
          formatError?.message?.includes('Cannot find package') &&
          formatError?.message?.includes('/noop.js')
        ) {
          logger.log('Retrying without plugins due to plugin resolution error...')
          const optionsWithoutPlugins = {
            ...configWithoutPlugins,
            parser: 'vue',
          }
          outputContent = await prettierModule.format(text, {
            ...optionsWithoutPlugins,
            filepath: dummyFilepath,
          })
          logger.log('Prettier formatting complete (without plugins)')

          // Show a warning to the user about plugin issues
          vscode.window.showWarningMessage(
            'Prettylus: Formatted without plugins due to resolution issues. ' +
              'Check that plugins are installed in the same directory as Prettier.',
          )
        } else {
          throw formatError
        }
      }

      const stylusSupremacyModule = loadStylusSupremacyModule(rootPath)
      const stylusConfig = findStylusConfig(
        document,
        rootPath,
        this.extensionOptions.stylusSupremacyConfigFileName,
      )
      const stylusOptions = createStylusOptions(stylusConfig, document, documentOptions)

      outputContent = this.formatStylusBlocks(
        text,
        outputContent,
        document,
        stylusOptions,
        stylusSupremacyModule,
      )

      if (cancellationToken?.isCancellationRequested || outputContent.length === 0) {
        return null
      }

      logger.log('Formatting completed successfully')
      return [vscode.TextEdit.replace(fullRange, outputContent)]
    } catch (ex: any) {
      logger.error('Formatting failed:', {
        message: ex?.message,
        stack: ex?.stack,
        code: ex?.code,
      })
      vscode.window.showWarningMessage(ex.message)
      return null
    }
  }

  private resolvePrettierBasePath(rootPath?: string): string | undefined {
    if (!this.extensionOptions.prettierBaseDirectory || !rootPath) {
      return undefined
    }

    const basePath = path.isAbsolute(this.extensionOptions.prettierBaseDirectory)
      ? this.extensionOptions.prettierBaseDirectory
      : path.join(rootPath, this.extensionOptions.prettierBaseDirectory)

    return fs.existsSync(basePath) ? basePath : undefined
  }

  private resolvePrettierConfigPath(
    prettierBasePath: string | undefined,
    rootPath: string | undefined,
    documentPath: string,
  ): string {
    if (this.extensionOptions.prettierConfigFile) {
      return path.isAbsolute(this.extensionOptions.prettierConfigFile)
        ? this.extensionOptions.prettierConfigFile
        : rootPath
          ? path.join(rootPath, this.extensionOptions.prettierConfigFile)
          : this.extensionOptions.prettierConfigFile
    }

    if (prettierBasePath) {
      return path.join(prettierBasePath, 'dummy.vue')
    }

    return documentPath
  }

  private formatStylusBlocks(
    originalText: string,
    prettierOutput: string,
    document: vscode.TextDocument,
    stylusOptions: StylusFormattingOptions,
    stylusSupremacyModule: StylusSupremacyModule,
  ): string {
    const styleMatches = [...originalText.matchAll(/<style[^>]*\s+lang="stylus"[^>]*>/g)]
    let output = prettierOutput

    for (const styleMatch of styleMatches) {
      const startStyleTag = styleMatch[0]
      const startStyleIndex = styleMatch.index

      if (!startStyleTag || startStyleIndex === undefined) {
        continue
      }

      const relativeEndIndex = originalText.slice(startStyleIndex).indexOf('</style>')
      if (relativeEndIndex === -1) {
        continue
      }
      const endStyleIndex = relativeEndIndex + startStyleIndex

      const rangeStyle = new vscode.Range(
        document.positionAt(startStyleIndex + startStyleTag.length),
        document.positionAt(endStyleIndex),
      )
      const style = document.getText(rangeStyle)
      const formattedStyle = stylusSupremacyModule.format(style, stylusOptions)
      output = output.replace(style, formattedStyle)
    }

    return output
  }
}
