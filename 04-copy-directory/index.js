const fs = require('fs');
const path = require('path');

function copyDir() {
  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
    if (err) throw err;
  });
  fs.readdir(path.join(__dirname, 'files-copy'), { withFileTypes: true }, (err, files) => {
    if (err) {
      throw err;
    } else {
      files.forEach(file => {
        if (file.isFile()) {
          fs.unlink(path.join(__dirname, 'files-copy', file.name), (err) => {
            if (err) throw err;
          });
        }
      });
    }
  });
  fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true }, (err, files) => {
    if (err) {
      throw err;
    } else {
      files.forEach(file => {
        if (file.isFile()) {
          fs.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name), (err) => {
            if (err) throw err;
          });
        }
      });
    }
  });
}

copyDir();