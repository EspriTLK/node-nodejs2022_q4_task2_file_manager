import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { pipeline } from 'node:stream/promises'
import path from 'node:path';
import { checkPath } from '../libs/fs/pathChecker.js';
import { parentPort, workerData } from 'node:worker_threads'

const fileToRead = async(filePath, curPath) => {
	const fullFilePath = await checkPath(filePath, curPath)
	console.log(fullFilePath)
	const readStream = createReadStream(fullFilePath)
	// const checkPath = path.parse(filePath)
	// console.log(readStream.flags)
	// await pipeline(readStream, process.stdout)
	let data = ''
	readStream.on('data', chunk => {
		// return process.stdout.write(chunk)
		data += chunk.toString()
	})
	// readStream.on('readable', () => {
	// 	let chunk = readStream.read()
	// 	// console.log(chunk)
	// 	if(chunk !== null) {
	// 		data += chunk
	// 	}
	// })
	
	readStream.on('error', (error) => {
		if (error.code === 'EISDIR'){
			// console.log(`${filePath} is folder, not file`)
			return (`${filePath} is folder, not file`)
		} else if (error.code === 'ENOENT') {
			// console.log(`${filePath} doesn't exist`)
			return (`${filePath} doesn't exist`)
		} else if (error.code === 'EACCES') {
			return(`permision denied to ${filePath}`)
		} else {
			// console.error(error.code)
			return(`${filePath} return ${error.code} with ${error.message}`)
		}
	})
	readStream.on('end', () => {
		console.log(data)
		return data
	})

	const sendResult = () => {
		parentPort.postMessage(fileToRead(workerData))
	}
	// try {
		// 	// return await readStream.pipe(process.stdout)
		// }
		// // console.log(checkPath)
		// catch (err) {
			// 	if(err.code === 'ENOENT'){
				// 		console.error('file does not exist')
				// 	} else if (err.code === 'EACCES'){
					// 		console.error('permision denied')
					// 	} else if (err.code === 'EISDIR'){
						// 		console.error("it's folder, not file")
						// 	} else {
							// 		console.error(err.code)
							// 	}
							// }
							
						}
sendResult()
// await fileToRead('cook.txt', '/home/esprit')