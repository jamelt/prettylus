const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'))
const version = packageJson.version
const vsixFile = `prettylus-${version}.vsix`
const vsixPath = path.join(__dirname, '..', 'build', vsixFile)

if (!fs.existsSync(vsixPath)) {
  console.error(`Error: VSIX file not found: ${vsixPath}`)
  console.error('Please run "npm run package" first.')
  process.exit(1)
}

function findVSCodeCommand() {
  if (process.platform === 'darwin') {
    const macPaths = [
      '/opt/homebrew/bin/code',
      '/usr/local/bin/code',
      '/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code',
      '/Applications/Visual Studio Code.app/Contents/MacOS/Electron',
    ]

    for (const codePath of macPaths) {
      if (fs.existsSync(codePath)) {
        return codePath
      }
    }
  }

  const possiblePaths = [
    process.platform === 'win32'
      ? process.env.LOCALAPPDATA + '\\Programs\\Microsoft VS Code\\bin\\code.cmd'
      : null,
    process.platform === 'linux' ? '/usr/bin/code' : null,
  ].filter(Boolean)

  for (const codePath of possiblePaths) {
    if (fs.existsSync(codePath)) {
      return codePath
    }
  }

  try {
    const whichCode = execSync('which code', { encoding: 'utf-8', stdio: 'pipe' }).trim()
    if (whichCode) {
      try {
        const resolvedPath = fs.realpathSync(whichCode)
        if (resolvedPath.includes('Visual Studio Code') && !resolvedPath.includes('Cursor')) {
          return whichCode
        }
        return whichCode
      } catch (e) {
        return whichCode
      }
    }
  } catch (e) {
    // which command failed, fall through
  }

  if (process.platform === 'darwin') {
    return '/opt/homebrew/bin/code'
  }

  return 'code'
}

try {
  const codeCommand = findVSCodeCommand()
  console.log(`Found VS Code command: ${codeCommand}`)

  const quotedVsixPath = vsixPath.includes(' ') ? `"${vsixPath}"` : vsixPath
  console.log(`Installing ${vsixFile} into Visual Studio Code...`)
  console.log(`VSIX path: ${vsixPath}`)

  const installCommand = `${codeCommand} --install-extension ${quotedVsixPath}`
  console.log(`Running: ${installCommand}`)

  execSync(installCommand, { stdio: 'inherit' })
  console.log('Extension installed successfully in Visual Studio Code!')
} catch (error) {
  console.error('Failed to install extension:', error.message)
  if (error.stderr) {
    console.error('Error details:', error.stderr.toString())
  }
  process.exit(1)
}
