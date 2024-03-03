import { fileTypeFromBuffer } from 'file-type'
import fs from 'node:fs'
import { writeFile } from 'fs/promises'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.resolve(dirname(fileURLToPath(import.meta.url)))

/**
 * @param {string} fileString
 */
async function getFileDataAsUri(fileString) {
  const filepath = path.resolve(__dirname, fileString)
  const fileBuffer = fs.readFileSync(filepath)

  const fileDataURI = fileBuffer.toString('base64')
  const result = await fileTypeFromBuffer(fileBuffer)
  if (!result) {
    throw new Error('Unknown file type')
  }
  const mime = result.mime

  return `data:${mime};base64,${fileDataURI}`
}

const files = ['assets/cursor.png', 'assets/cursor-click.png']

export const prepare = async () => {
  const uris = await Promise.all(files.map(async (file) => [file, await getFileDataAsUri(file)]))
  const jsonPath = path.resolve(__dirname, 'assets/uris.json')
  await writeFile(jsonPath, JSON.stringify(Object.fromEntries(uris), null, 2))
}

prepare()
