import { rename } from 'fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'
// import { checkPath } from '../libs/fs/pathChecker.js'

// let currenDir = homedir()

export const fileRename = async (oldPath, newPath, currenDir) => {
	// console.log(path.parse(oldPath))
	// console.log(await checkPath(oldPath, currenDir))
	if(path.isAbsolute(oldPath)) {
		oldPath = oldPath
		
	} else {
		oldPath = path.join(currenDir, oldPath)
		
	}
	if(path.isAbsolute(newPath)) {
		newPath = newPath
	} else {
		newPath = path.join(currenDir, newPath)
	}
	try {
		rename(oldPath, newPath)
		console.log(`success`)
	} catch (err) {
		return err.message
	}
}

// await fileRename('somefile1.txt', 'somefile3.txt', currenDir)

