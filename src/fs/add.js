import { writeFile } from 'node:fs/promises'
import path from 'node:path'

export const createFile = async(fileName, filePath) => {
	// console.log(fileName)
	try {
		const newFile = await writeFile(path.join(filePath, fileName), '', {flag: 'wx'})
	} catch (err) {
		console.error(err.message)
		if(err.code === 'EEXIST'){
			process.stdout.write (`operation failed ${err.message}\n`)}
		else {
			return err
		}
	}
}

// await createFile('test_file.txt', '/home/esprit/nodejslerning/rsschool/task2_file_manager/tmp')