const fs = require('fs');
const path = require('path');
const textPath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(textPath, 'utf-8');
let data = '';

readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => console.log(data));
readableStream.on('error', error => console.log('Error', error.message));