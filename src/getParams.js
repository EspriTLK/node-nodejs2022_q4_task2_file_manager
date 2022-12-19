import path from 'node:path'
export const getParams = (params) => {
	const result = {}
	
	const [command, ...rest] = Array.from(params.split(' '))
	
	if (rest.length === 0){
		result[command] = true
	}
	result[command] = []
	rest.forEach((value, index, array) => {
		if (rest.length === 1){
			result[command] = value
		} else {
			result[command].push(value)

		}
	})
// 	result[command] = rest
	// console.log(rest.length)
	return result
}

// getParams("cd home esprit")