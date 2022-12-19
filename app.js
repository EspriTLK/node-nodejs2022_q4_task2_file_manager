import { homedir, EOL, cpus, arch, userInfo } from 'node:os';
import { createReadStream, createWriteStream } from 'node:fs';
import { sayHi, sayBy } from './src/greets.js'
import { getArgs } from './src/getArgs.js'
import { getParams } from './src/getParams.js'
import { fileURLToPath, pathToFileURL } from 'node:url';
import readline from 'node:readline';
import { up, cd, ls } from './src/nwd/navigation.js';
import { fileRename } from './src/fs/rn.js'
import { fileCopy } from './src/fs/cp.js'
import { availableCommands as ac } from './src/libs/comands/checker.js'
import { checkPath } from './src/libs/fs/pathChecker.js'
import { calculateHash } from './src/hash/calcHash.js'
import path from 'node:path'
import { writeFile, rm } from 'node:fs/promises';
import { compress, decompress } from './src/zip/zip.js'; 

const _path = new URL('src', import.meta.url)
const file = fileURLToPath(`${_path}${path.sep}commands.js`)
let currenDir = homedir()
let userName = undefined
if(getArgs(process.argv).username) {
	userName = getArgs(process.argv).username
} else {
	userName = 'anonym'
}
const runApp = async () => {
	// const userName = getArgs(process.argv).username

	console.log(sayHi(userName))
	// console.log(`You are currently in ${currenDir}`)
	// console.log(`${userName} input command: `)

	
		let rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
			// prompt: `You are currently in ${currenDir}\n${userName} input your command: `
		});
		// rl.prompt()
			process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
		rl.on('line', line => {
			if (line.toLowerCase() === '.exit') {
				rl.close();
				console.log(sayBy(userName))
			// } else if (line.toLowerCase() === 'up') {
			// 	currenDir = up(currenDir)
			// 	process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
		} else {
			if (!(Object.keys(getParams(line)) in ac)) {
				// 		// throw new Error('FS operation failed')
					process.stdout.write(`\nInvalid input\n`);
					process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
					// rl.prompt()
				} 
				
				switch(Object.keys(getParams(line)).join()) {
					case 'up':
						currenDir = up(currenDir);
						process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `);
						// rl.prompt()
						break
						case 'cd':
							const dstPath = getParams(line)['cd']
							let changedDir = async (dstPath) => {
								if (await cd(dstPath, currenDir) === false){
									process.stdout.write(`\nInvalid input\n`);
									currenDir = currenDir
									// process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `);
								} else {
									currenDir = await cd(dstPath, currenDir)
									// process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `);
							}
							process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `);
							// rl.prompt()
						}
						changedDir(dstPath)
						
						break
						case 'ls':
							process.stdout.write(`\n`)
							const listDir = async (dstPath) => {
								try {
									const { status, message } = await ls(dstPath)
									if(status !== false){
										console.table(message.slice().sort((x, y) => x.type.localeCompare(y.type)))
									} else {
										throw new Error(message)
									}
								} catch (err){

									process.stdout.write(`Operation failed ${err.message.slice(err.message.indexOf(':')+1)}\n`)
								}
								
								await process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
								// 	rl.prompt()
							}
							
							listDir(currenDir)
							// rl.prompt()
						break
						
						case 'cat':
							const readedFile = getParams(line)['cat']
							if(typeof readedFile === 'string'){
							const fileToRead = async(filePath, curPath) => {
								const fullFilePath = await checkPath(filePath, curPath)
								const readStream = createReadStream(fullFilePath)
								let data = ''
								readStream.on('data', chunk => {
									data += chunk.toString()
								})
								
								readStream.on('error', (error) => {
									if (error.code === 'EISDIR'){
										console.log(`operation failed ${filePath} is folder, not file`)
										return (`${filePath} is folder, not file`)
									} else if (error.code === 'ENOENT') {
										console.log(`operation failed ${filePath} doesn't exist`)
										return (`operation failed ${filePath} doesn't exist`)
									} else if (error.code === 'EACCES') {
										return(`operation failed permision denied to ${filePath}`)
									} else {
										return(`operation failed ${filePath} return ${error.code} with ${error.message}`)
									}
								})
								readStream.on('end', () => {
									console.log(data)
									return data
								})
								// await process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
								// rl.prompt()
							}
							fileToRead(readedFile, currenDir)
							} else {
								console.log(`invalid input`)
							}
							process.stdout.write(`\nYou are currently in ${currenDir}\n${userName} input your command: `)
							break


						case 'add': 
							const addedFileName = getParams(line)['add']

							const createFile = async(fileName, filePath) => {
								try {
									const newFile = await writeFile(path.join(filePath, fileName), '', {flag: 'wx'})
									process.stdout.write (`${fileName} create successfully\n`)
								} catch (err) {
									if(err.code === 'EEXIST'){
										process.stdout.write (`operation failed${err.message.slice(err.message.indexOf(':')+1)}\n`)}
									else {
										process.stdout.write (`operation failed ${err.code}: ${err.message}\n`)}
									}
									await process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `);
								}
								createFile(addedFileName, currenDir)
								// rl.prompt()
								break
							case 'rn':
								const paths = getParams(line)['rn']
								if (!(paths instanceof Array) || paths.length === 0) {
									console.log (`invalid input`)
								}
								const [ originalPath, newPath ] = paths
								const renameFunction = async () => {
									try {
										await fileRename(originalPath, newPath, currenDir)
									} catch (err) {
										console.log (err.message)
									}
								}
								renameFunction()
								process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
								break
							case 'cp':
								{if (!(getParams(line)['cp'] instanceof Array) || getParams(line)['cp'].length === 0) {
									console.log (`invalid input`)
								} 
								let [srcPaths, newFilePath ] = getParams(line)['cp']
								console.log()
								const cp = async () => {

									try {
										await fileCopy(srcPaths, newFilePath, currenDir)
									} catch (err){
										console.log (`operation failed: ${err.message}`)
									}
									await process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
								}

									cp()
								break}
							case 'mv':
								if (!(getParams(line)['mv'] instanceof Array) || getParams(line)['mv'].length === 0) {
									console.log (`invalid input`)
								}
								let [srcPath, fileNewPath ] = getParams(line)['mv']
								console.log()
								const mv = async () => {

									try {
										await fileCopy(srcPath, fileNewPath, currenDir)
										const remFile = await checkPath(srcPath, currenDir)
										await rm(remFile)
									} catch (err){
										console.log (`operation failed: ${err.message}`)
									}
									await process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
								}

									mv()
								break
							case 'rm': 
								const removeFilePath = getParams(line)['rm']
								const removeFile = async () => {
									const fileToRemove = await checkPath(removeFilePath, currenDir)
									try {
										await rm(fileToRemove)
										console.log(`file ${path.basename(fileToRemove)} removed successful`)
									} catch (err) {
										console.log (`operation failed: ${err.message}`)
									}
									await process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
								}
								removeFile()
								break
							case 'os':
								{
									const params = getParams(line)['os']
									if(!(params.startsWith('--'))){
										console.log(`Invalid Input`)
									} 
									if(params === '--EOL') {
										console.log(`EOL: ${JSON.stringify(EOL)}`)
									} else if(params === '--cpus') {
										let hostCpus = {}
										cpus().forEach( (item, index) => {
										hostCpus[index] = {model: item.model, 'clock rate': (item.speed/1024).toFixed(1) + ' GHz'}
										})

										console.log(`Total cores of CPUs is: ${cpus().length}`)
										console.table(hostCpus)
									} else if(params === '--username') {
										console.log(userInfo().username)
									} else if(params === '--architecture') {
										console.log(arch())
									} else if(params === '--homedir') {
										console.log(homedir())
									}
									process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
								}
							case 'hash': {
								const params = getParams(line)['hash']
								if(typeof(params) !== 'string') {
									console.log(`Invalid input`)
								}
								const calcHash = async () => {
									try {
										await calculateHash(params, currenDir)
									} catch (err) {
										console.log(`operation failed: ${err.message}`)
									}
									await process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
								}
								calcHash()
								break
							}
							case 'compress': {
								const paths = getParams(line)['compress']
								if (!(paths instanceof Array) || paths.length === 0) {
									console.log (`invalid input`)
								} 
								
								const [ originalPath, newPath ] = paths

								const fileCompress = async () => {
									try {
										await compress(originalPath, newPath, currenDir)
									} catch (err) {
										console.log(`operation failed: ${err.message}`)
									}
									await process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
								}
								fileCompress()
								break
							}
							case 'decompress': {
								const paths = getParams(line)['decompress']
								if (!(paths instanceof Array) || paths.length === 0) {
									console.log (`invalid input`)
								} 
								
								const [ originalPath, newPath ] = paths

								const fileDecompress = async () => {
									try {
										await decompress(originalPath, newPath, currenDir)
									} catch (err) {
										console.log(`operation failed: ${err.message}`)
									}
									await process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
								}
								fileDecompress()
								break
							}
							}
		}
		})

		rl.on('SIGINT', () => {
			process.stdout.write(`\n${sayBy(userName)}`);
			rl.close()

		})
	}


await runApp()
