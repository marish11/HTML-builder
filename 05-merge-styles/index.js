const fs = require('fs');
const path = require('path');
let data = '';

fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
  if (err) {
    throw err;
  } else {
    files.forEach(file => {
      let ext = path.extname(file.name);
      let readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
      let writeableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');
      if (file.isFile() && ext === '.css') {
        readableStream.on('data', chunk => data += `${chunk}\n`);
        readableStream.on('end', () => writeableStream.write(`${data}\n`));
      }
    });
  }
});