import { rename } from 'fs/promises'

export const fileRename = async (oldPath, newPath) => {
	try {
		rename(oldPath, newPath)
	} catch (err) {
		return err.message
	}
}

