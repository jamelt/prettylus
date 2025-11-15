import * as vscode from 'vscode'

export interface ExtensionOptions {
  stylusSupremacyConfigFileName?: string
  prettierBaseDirectory?: string
  prettierConfigFile?: string
}

const defaultOptions: ExtensionOptions = {
  stylusSupremacyConfigFileName: '.stylusrc',
  prettierBaseDirectory: undefined,
  prettierConfigFile: undefined,
}

export function loadConfiguration(): ExtensionOptions {
  const config = vscode.workspace.getConfiguration('prettylus')
  const options: ExtensionOptions = { ...defaultOptions }

  for (const key in defaultOptions) {
    const configKey = key as keyof ExtensionOptions
    if (config.has(configKey)) {
      options[configKey] = config.get(configKey)
    }
  }

  return options
}

