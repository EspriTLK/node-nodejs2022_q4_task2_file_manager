import { homedir } from 'node:os';
import { createReadStream } from 'node:fs';
import { sayHi, sayBy } from './src/greets.js'
import { getArgs } from './src/getArgs.js'
import { getParams } from './src/getParams.js'
import { fileURLToPath, pathToFileURL } from 'node:url';
import readline from 'node:readline';
import { up, cd, ls } from './src/nwd/navigation.js';
// import { fileToRead as cat } from './src/fs/cat.js'
import { availableCommands as ac } from './src/libs/comands/checker.js'
import { checkPath } from './src/libs/fs/pathChecker.js'
import path from 'node:path'
import { writeFile } from 'node:fs/promises';
// import { Worker } from 'node:worker_threads'

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

	// const comChPr = fork(file, argv, {silent: true})
	// process.stdin.pipe(comChPr.stdin)
	// comChPr.stdout.pipe(process.stdout)
	
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
									// console.log(status, message)
									if(status !== false){
										console.table(message.slice().sort((x, y) => x.type.localeCompare(y.type)))
									} else {
										throw new Error(message)
									}
								} catch (err){

									process.stdout.write(`Operation failed ${err.message.slice(err.message.indexOf(':')+1)}\n`)
								}
								// const { status, err } = await ls(dstPath)
								// }
								// 
								await process.stdout.write(`You are currently in ${currenDir}\n${userName} input your command: `)
								// 	rl.prompt()
							}
							
							listDir(currenDir)
							// rl.prompt()
						break
							// default:
							// // 	process.stdout.write(`Invalid input\n`);
						case 'cat':
							const readedFile = getParams(line)['cat']
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
							process.stdout.write(`\nYou are currently in ${currenDir}\n${userName} input your command: `)
							break


						case 'add': 
							const addedFileName = getParams(line)['add']

							const createFile = async(fileName, filePath) => {
								// console.log(fileName)
								try {
									const newFile = await writeFile(path.join(filePath, fileName), '', {flag: 'wx'})
									process.stdout.write (`${fileName} create successfully\n`)
								} catch (err) {
									// console.error(err.message)
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
							}
		}
		})

		rl.on('SIGINT', () => {
			process.stdout.write(`\n${sayBy(userName)}`);
			rl.close()

		})
	}


await runApp()
