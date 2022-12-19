import { createReadStream, createWriteStream } from 'node:fs'
import zlib from 'node:zlib'
import { checkPath } from '../libs/fs/pathChecker.js'
import path from 'node:path'

export const compress = async (origPath, compressPath, currentPath) => {
	const READ_FILE_PATH = await checkPath(origPath, currentPath)
	const READ_FILE_NAME = path.basename(READ_FILE_PATH)
	const WRITE_FILE_PATH = await checkPath(compressPath, currentPath)
	const WRITE_FILE_NAME = path.join(WRITE_FILE_PATH, READ_FILE_NAME + '.br')
	
	if(READ_FILE_PATH === 'ENOENT'){
		throw new Error(`${origPath} does not exist`)
	}
	if(WRITE_FILE_PATH === 'ENOENT'){
		throw new Error(`${compressPath} does not exist`)
	}

	const readStream = createReadStream(READ_FILE_PATH)
	const writeStream = createWriteStream(WRITE_FILE_NAME)
	
	const brotli = zlib.createBrotliCompress()

	const stream = readStream.pipe(brotli).pipe(writeStream)

	stream.on('finish',() => {
		console.log('done')
	})
}

export const decompress = async (compressPath, deCompressedPath, currentPath) => {
	const READ_FILE_PATH = await checkPath(compressPath, currentPath)
	const READ_FILE_NAME = path.basename(READ_FILE_PATH)
	const WRITE_FILE_PATH = await checkPath(deCompressedPath, currentPath,)
	const WRITE_FILE_NAME = path.join(WRITE_FILE_PATH, READ_FILE_NAME.slice(0, READ_FILE_NAME.lastIndexOf('.')))
	
	if(READ_FILE_PATH === 'ENOENT'){
		throw new Error(`${compressPath} does not exist`)
	}
	if(WRITE_FILE_PATH === 'ENOENT'){
		throw new Error(`${deCompressedPath} does not exist`)
	}


	const readStream = createReadStream(READ_FILE_PATH)
	const writeStream = createWriteStream(WRITE_FILE_NAME)
	
	const brotli = zlib.createBrotliDecompress()

	const stream = readStream.pipe(brotli).pipe(writeStream)

	stream.on('finish',() => {
		console.log('done decompressing')
	})
}
