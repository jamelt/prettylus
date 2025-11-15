import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import type { FormattingOptions as StylusFormattingOptions } from 'stylus-supremacy'
import { logger } from './logger'

export function findStylusConfig(
  document: vscode.TextDocument,
  rootPath?: string,
  configFileName?: string,
): StylusFormattingOptions {
  logger.log('Finding Stylus config...', { rootPath, configFileName })
  let configFilePath: string | null = null

  if (rootPath === undefined || configFileName === undefined) {
    logger.log('No rootPath or configFileName provided, using default config')
    return {}
  }

  if (document.isUntitled === false && document.fileName.startsWith(rootPath)) {
    const pathList = document.fileName
      .substring(rootPath.length)
      .split(/(\\|\/)/)
      .filter((pathSegment: string) => pathSegment.length > 0)
    pathList.pop()

    while (pathList.length >= 0) {
      const workPath = path.join(rootPath, ...pathList, configFileName)
      if (fs.existsSync(workPath)) {
        configFilePath = workPath
        logger.log('Found Stylus config at:', configFilePath)
        break
      } else if (pathList.length === 0) {
        break
      }
      pathList.pop()
    }
  } else {
    const workPath = path.join(rootPath, configFileName)
    if (fs.existsSync(workPath)) {
      configFilePath = workPath
      logger.log('Found Stylus config at root:', configFilePath)
    }
  }

  if (configFilePath) {
    try {
      const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
      logger.log('Loaded Stylus config:', config)
      return config
    } catch (ex: any) {
      logger.error('Failed to parse Stylus config:', {
        configFilePath,
        error: ex?.message,
      })
      vscode.window.showWarningMessage('Malformed JSON in config file: ' + configFilePath)
    }
  } else {
    logger.log('No Stylus config file found, using default config')
  }

  return {}
}

export function createStylusOptions(
  config: StylusFormattingOptions,
  document: vscode.TextDocument,
  documentOptions: vscode.FormattingOptions,
): StylusFormattingOptions {
  const options = {
    tabStopChar: documentOptions.insertSpaces ? ' '.repeat(documentOptions.tabSize) : '\t',
    newLineChar: document.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n',
    ...config,
  }
  logger.debug('Created Stylus formatting options:', options)
  return options
}
