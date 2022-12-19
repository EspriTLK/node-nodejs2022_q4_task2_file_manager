import { getArgs } from './getArgs.js'
import { sayBy } from './sayBy.js'

const args = process.argv.slice(2);
const userName = getArgs(args).username
// console.log(`Total number of arguments is ${args.length}`);
// console.log(`Arguments: ${JSON.stringify(args)}`);

const echoInput = (chunk) => {
    const chunkStringified = chunk.toString();
    if (chunkStringified.includes('.exit')) {
        console.log(sayBy(userName));
        process.exit(0)
    };
    process.stdout.write(`Received from master process: ${chunk.toString()}\n`)
};

process.stdin.on('data', echoInput);
