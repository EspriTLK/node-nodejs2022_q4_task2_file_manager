export const getArgs = (args) => {
	const result = {}
	const [exec, file, ...rest] = args
	rest.forEach((value, index, array) => {
		if (value.startsWith('--')) {
			result[value.substring(2).slice(0, value.indexOf('=') - 2)] = value.slice(value.indexOf('=') + 1)
		}
	})

	return result
}