const process = require('process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin, stdout } = process;
const rl = readline.createInterface({ input: stdin, output: stdout });
let writeableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Please enter your data:\n');

rl.on('line', (line) => {
  if (line === 'exit') {
    console.log('The data was successfully written to the file. Cheers!');
    process.exit(0);
  }
  writeableStream.write(`${line}\n`);
});

rl.on('pause', (error) => {
  if (error) throw error;
  console.log('The data was successfully written to the file. Cheers!');
});