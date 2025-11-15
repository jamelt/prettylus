import * as fs from 'fs'
import * as path from 'path'
import { createRequire } from 'module'
import type * as prettier from 'prettier'
import { logger } from './logger'

export type PrettierModule = typeof prettier

export interface PrettierModuleWithContext {
  module: PrettierModule
  resolveFrom: string
  requireFromBase: NodeJS.Require
}

export function loadPrettierModule(
  prettierBasePath?: string,
  rootPath?: string,
): PrettierModuleWithContext {
  const searchDirs: string[] = []

  if (prettierBasePath) {
    searchDirs.push(prettierBasePath)
    logger.log('Added prettierBasePath to search:', prettierBasePath)
  }

  if (rootPath && !searchDirs.includes(rootPath)) {
    searchDirs.push(rootPath)
    logger.log('Added rootPath to search:', rootPath)
  }

  if (searchDirs.length === 0) {
    throw new Error(
      'Prettylus: Could not determine a base directory for Prettier. ' +
        'Configure "prettylus.prettierBaseDirectory" or install Prettier in your workspace.',
    )
  }

  const errors: string[] = []

  for (const dir of searchDirs) {
    try {
      const possiblePackageJsonPath = path.join(dir, 'package.json')
      const requireBasePath = fs.existsSync(possiblePackageJsonPath) ? possiblePackageJsonPath : dir
      logger.log(`Trying to load Prettier from: ${dir}`, {
        packageJsonExists: fs.existsSync(possiblePackageJsonPath),
        requireBasePath,
      })

      const requireFromBase = createRequire(requireBasePath)
      const prettierModule = requireFromBase('prettier') as PrettierModule

      logger.log(`Successfully loaded Prettier from: ${dir}`)
      return {
        module: prettierModule,
        resolveFrom: dir,
        requireFromBase,
      }
    } catch (error: any) {
      const errorMsg = `${dir}: ${error?.message ?? String(error)}`
      errors.push(errorMsg)
      logger.warn(`Failed to load Prettier from ${dir}:`, error?.message)
    }
  }

  throw new Error(
    'Prettylus: Could not load Prettier from the configured environment. ' +
      'Make sure Prettier is installed in the directory specified by "prettylus.prettierBaseDirectory" ' +
      'or in your workspace (e.g. "npm install --save-dev prettier"). ' +
      `Tried directories: ${searchDirs.join(', ')}. ` +
      `Errors: ${errors.join(' | ')}`,
  )
}
