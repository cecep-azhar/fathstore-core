const fs = require('fs')
const path = require('path')

const dirsToRemove = ['.next', '.turbo', 'dist', 'build']

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`Removing ${dirPath}...`)
    fs.rmSync(dirPath, { recursive: true, force: true })
  }
}

function scanAndClean(dir) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      if (dirsToRemove.includes(file)) {
        removeDir(fullPath)
      } else if (file !== 'node_modules' && file !== '.git') {
        scanAndClean(fullPath)
      }
    }
  })
}

console.log('Cleaning up project artifacts...')
scanAndClean(process.cwd())
console.log('Cleanup complete!')
