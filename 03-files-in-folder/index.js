const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach(file => {
      if (file.isFile()) {
        fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
          if (err) {
            console.log(err);
          } else {
            let ext = path.extname(file.name);
            let basename = path.basename(file.name, ext);
            console.log((`${basename} - ${ext.slice(1)} - ${stats.size} B`));
          }
        });
      }
    });
  }
});