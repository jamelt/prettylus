import * as vscode from 'vscode'
import { Formatter } from './formatter'
import { logger } from './logger'

const formatter = new Formatter()

export function activate(context: vscode.ExtensionContext): void {
  logger.log('Prettylus extension activating...')
  logger.show() // Show output panel for debugging

  formatter.configure()

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(() => {
      logger.log('Configuration changed, reconfiguring formatter')
      formatter.configure()
    })
  )

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider('vue', formatter)
  )

  context.subscriptions.push(
    vscode.languages.registerDocumentRangeFormattingEditProvider('vue', formatter)
  )

  logger.log('Prettylus extension activated successfully')
}

export function deactivate(): void {
  logger.log('Prettylus extension deactivating')
}
