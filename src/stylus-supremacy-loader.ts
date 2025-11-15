import * as fs from 'fs'
import * as path from 'path'
import { createRequire } from 'module'
import type * as stylusSupremacy from 'stylus-supremacy'
import { logger } from './logger'

export type StylusSupremacyModule = typeof stylusSupremacy

export function loadStylusSupremacyModule(rootPath?: string): StylusSupremacyModule {
  logger.log('Loading stylus-supremacy module...', { rootPath })
  const searchDirs: string[] = []

  if (rootPath) {
    searchDirs.push(rootPath)
    logger.log('Added rootPath to search:', rootPath)
  }

  if (searchDirs.length === 0) {
    const error =
      'Prettylus: Could not determine a base directory for Stylus Supremacy. ' +
      'Make sure Stylus Supremacy is installed in your workspace.'
    logger.error(error)
    throw new Error(error)
  }

  const errors: string[] = []
  logger.log('Searching for stylus-supremacy in:', searchDirs)

  for (const dir of searchDirs) {
    try {
      const possiblePackageJsonPath = path.join(dir, 'package.json')
      const requireBasePath = fs.existsSync(possiblePackageJsonPath) ? possiblePackageJsonPath : dir
      logger.log(`Trying to load stylus-supremacy from: ${dir}`, {
        packageJsonExists: fs.existsSync(possiblePackageJsonPath),
        requireBasePath,
      })

      const requireFromBase = createRequire(requireBasePath)
      const stylusModule = requireFromBase('stylus-supremacy') as StylusSupremacyModule

      logger.log(`Successfully loaded stylus-supremacy from: ${dir}`)
      return stylusModule
    } catch (error: any) {
      const errorMsg = `${dir}: ${error?.message ?? String(error)}`
      errors.push(errorMsg)
      logger.warn(`Failed to load stylus-supremacy from ${dir}:`, error?.message)
    }
  }

  const finalError =
    'Prettylus: Could not load Stylus Supremacy from the workspace environment. ' +
    'Make sure Stylus Supremacy is installed in your workspace (e.g. "npm install --save-dev stylus-supremacy"). ' +
    `Tried directories: ${searchDirs.join(', ')}. ` +
    `Errors: ${errors.join(' | ')}`

  logger.error(finalError, { searchDirs, errors })
  throw new Error(finalError)
}
