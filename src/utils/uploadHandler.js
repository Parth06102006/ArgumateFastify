import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'

const pump = promisify(pipeline)
const __dirname = path.resolve()
const uploadsDir = path.join(__dirname, 'my-uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

export async function saveMultipartFile(file) {
  const filename = Date.now() + '-' + file.filename
  const filePath = path.join(uploadsDir, filename)
  await pump(file.file, fs.createWriteStream(filePath))
  return { filename, path: filePath }
}
