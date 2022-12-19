import { readFile } from 'node:fs/promises'
import { checkPath } from '../libs/fs/pathChecker.js'

export const calculateHash = async (pathToFile, currentDir) => {
	const fileToHash = await checkPath(pathToFile, currentDir)

	const { createHash } = await import('node:crypto')
	const hash = createHash('sha256')

	const input = await readFile(fileToHash)

	hash.update(input)
	console.log(hash.digest('hex'))
}