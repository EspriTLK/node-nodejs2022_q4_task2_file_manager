import path from 'node:path';
import { realpath, readdir, stat } from 'node:fs/promises'

export const checkPath = async (dstPath='', curPath) => {
	
	// console.log(path.parse(dstPath))
	let returnPath = ''
	let realPath = ''
	if(path.parse(dstPath)['root'] === '') {
		realPath = path.join(curPath, dstPath)
	} else {
		realPath = dstPath
	}
	// console.log(realPath)
		try {
			returnPath = await realpath(realPath)
			// console.log(returnPath)
			return returnPath
		} catch (err) {
			// console.log(err)
			return err.code
		}
}

// checkPath('esprit', '/home')