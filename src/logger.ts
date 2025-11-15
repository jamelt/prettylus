import * as vscode from 'vscode'

class Logger {
  private outputChannel: vscode.OutputChannel
  private enabled: boolean = true

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel('Prettylus')
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString()
    let formattedMessage = `[${timestamp}] [${level}] ${message}`

    if (data !== undefined) {
      if (typeof data === 'object') {
        try {
          formattedMessage += '\n' + JSON.stringify(data, null, 2)
        } catch (err) {
          formattedMessage += '\n' + String(data)
        }
      } else {
        formattedMessage += ' ' + String(data)
      }
    }

    return formattedMessage
  }

  log(message: string, data?: any): void {
    if (!this.enabled) return
    const formatted = this.formatMessage('INFO', message, data)
    this.outputChannel.appendLine(formatted)
    console.log(formatted)
  }

  error(message: string, error?: any): void {
    if (!this.enabled) return
    const formatted = this.formatMessage('ERROR', message, error)
    this.outputChannel.appendLine(formatted)
    console.error(formatted)
  }

  warn(message: string, data?: any): void {
    if (!this.enabled) return
    const formatted = this.formatMessage('WARN', message, data)
    this.outputChannel.appendLine(formatted)
    console.warn(formatted)
  }

  debug(message: string, data?: any): void {
    if (!this.enabled) return
    const formatted = this.formatMessage('DEBUG', message, data)
    this.outputChannel.appendLine(formatted)
    console.log(formatted)
  }

  show(): void {
    this.outputChannel.show()
  }

  clear(): void {
    this.outputChannel.clear()
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }
}

export const logger = new Logger()
