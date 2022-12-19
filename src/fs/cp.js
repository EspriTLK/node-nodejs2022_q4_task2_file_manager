import { createReadStream, createWriteStream } from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream'

export const fileCopy = async (oldPath, newPath, currenDir) => {
	if (path.isAbsolute(oldPath)) {
		oldPath = oldPath
	} else {
		oldPath = path.join(currenDir, oldPath)
	}

	if (path.isAbsolute(newPath)) {
		newPath = newPath
	} else {
		newPath = path.join(currenDir, newPath)
	}


		const srcFile = createReadStream(oldPath)
		// srcFile.on('error', (err) => {
		// 	throw new Error(err)
		// })
		const fileName = path.basename(oldPath)
		const dstFile = createWriteStream(path.join(newPath, fileName), {flags: 'wx'})
		await pipeline(
			srcFile,
			dstFile,
			(err) => {
				if (err) {
					console.log (`operation failed: ${err.message}`)
				}
			}
		)
		// srcFile.pipe(dstFile)

}


// try {
// 	const fileToCopy = createReadStream(srcPaths)
// 	const fileName = path.basename(srcPaths)
// 	const dstFile = createWriteStream(path.join(newFilePath, fileName))
// 	fileToCopy.pipe(dstFile)
// } catch (err) {
// 	console.log (`operation failed: ${err.message}`)
// }

// fileCopy('/home/esprit/test2', '/home/esprit/test_nas')