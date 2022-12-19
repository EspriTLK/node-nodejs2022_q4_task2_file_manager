export const sayHi = (name) => {
	let upperName = ''
	if(name[0] !== name[0].toUpperCase()) {
			upperName = name[0].toUpperCase() + name.slice(1)
		} else {
			upperName = name
		}
	
	return(`Welcome to the File Manager, ${upperName}!`)
}