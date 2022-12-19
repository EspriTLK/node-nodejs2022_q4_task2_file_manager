import { homedir } from 'node:os';
import path from 'node:path';
import { realpath, readdir, stat } from 'node:fs/promises'
// import {readdir } from 'node:fs/promises'
// let curDir = homedir()
// const SEP = path.sep
// console.log(path.parse(curDir))
export const up = (curPath) => {
	const checkDir = path.parse(curPath)
	let newPath = checkDir['dir']
	
	return newPath
	
}

export const cd = async (dstPath='', curPath='') => {
	
	let resultPath = undefined;
	const checkDir = path.parse(dstPath)
	if(checkDir.root === ''){
		resultPath = path.join(curPath, dstPath)
	} else  {
		resultPath = dstPath
	}

	try {
		const returnPath = await realpath(resultPath)

		return await returnPath
	} catch (error){
		return false
	}
}

export const ls = async(curPath) => {
	let list = []
	try {
		const listFiles = await readdir(curPath, { withFileTypes: true})
		// console.log(listFiles[0].isFile())
		// listFiles.map(file => (if (await stat(path.join(curPath, file.name))).isDirectory()){file.type = "directory"}list.push({name: file.name}))
		listFiles.forEach(async(file)  => {
			// console.log(file.isSymbolicLink())
			if(file.isDirectory()) {
				file.type = "directory"
			} else if( file.isFile()) {
				file.type = "file"
			} else if(file.isSymbolicLink()) {
				file.type = "simlink"
			} else {
				file.type = 'unknowType'
			}
			list.push({name: file.name,
						type: file.type
			
		})
		// console.log(file)
		// console.log(list)
	})
		// console.tale(list)
		return {status: true, message: list}
	} catch (err) {
		// console.error(`operation failed ${err.message}`)
		return {status: false, message: err.message}
	}
	// console.table(list.slice().sort((x, y) => x.type.localeCompare(y.type)))
}

ls('/home')