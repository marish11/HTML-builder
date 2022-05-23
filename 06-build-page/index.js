const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const projectDir = path.join(__dirname, 'project-dist');
const assetsDir = path.join(__dirname, 'assets');
const newAssetsDir = path.join(projectDir, 'assets');
const components = path.join(__dirname, 'components');
const styles = path.join(projectDir, 'style.css');
const index = path.join(projectDir, 'index.html');
const template = path.join(__dirname, 'template.html');

function createDir(folder) {
  const dir = path.normalize(folder);
  return new Promise((resolve, reject) => {
    fs.stat(dir, (error) => {
      if (error) {
        if (error.code === 'ENOENT') {
          fs.mkdir(dir, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve(dir);
            }
          });
        } else {
          reject(error);
        }
      } else {
        resolve(dir);
      }
    });
  });
}

function appendToFile() {
  fs.readdir(stylesDir, (err, files) => {
    if (err) {
      throw err;
    } else {
      files.forEach(file => {
        const baseFile = path.join(stylesDir, file);
        fs.stat(baseFile, (err, stats) => {
          if (err) {
            throw err;
          } else {
            if (stats.isFile()) {
              const ext = path.extname(baseFile);
              if (ext === '.css') {
                fs.readFile(baseFile, 'utf8', (err, data) => {
                  if (err) throw err;
                  fs.appendFile(styles, `${data}\n`, (err) => {
                    if (err) throw err;
                  });
                });
              }
            }
          }
        });
      });
    }
  });
}

function copyFiles(source, target) {
  fs.readdir(source, (err, files) => {
    if (err) {
      throw err;
    } else {
      files.forEach(file => {
        const baseFile = path.join(source, file);
        const newFile = path.join(target, file);
        fs.stat(baseFile, (err, stats) => {
          if (err) {
            throw err;
          } else {
            if (stats.isFile()) {
              fs.createReadStream(baseFile).pipe(fs.createWriteStream(newFile));
            } else {
              createDir(newFile).then(() => {
                copyFiles(baseFile, newFile);
              }).catch((error) => {
                console.log(error);
              });
            }
          }
        });
      });
    }
  });
}

createDir(projectDir)
  .then(() => {
    fs.open(styles, 'w', (err) => {
      if (err) throw err;
    });
  })
  .then(
    appendToFile()
  )
  .then(
    createDir(newAssetsDir)
  )
  .then(
    copyFiles(assetsDir, newAssetsDir)
  )
  .catch((err) => {
    console.log(err);
  });

let arr = [];
fs.copyFile(template, index, (err) => {
  if (err) {
    throw err;
  } else {
    fs.readdir(components, (err, files) => {
      if (err) {
        throw err;
      } else {
        files.forEach(file => {
          const baseFile = path.join(components, file);
          fs.stat(baseFile, (err, stats) => {
            if (err) throw err;
            if (stats.isFile()) {
              const ext = path.extname(baseFile);
              const name = path.basename(baseFile, ext);
              if (ext === '.html') {
                fs.readFile(baseFile, 'utf8', (err, data) => {
                  if (err) throw err;
                  arr.push({
                    name: name,
                    data: data
                  });
                  fs.readFile(index, 'utf8', (err, content) => {
                    if (err) throw err;
                    if (arr.length) {
                      for (let i = 0; i < arr.length; i++) {
                        content = content.replace(`{{${arr[i].name}}}`, arr[i].data);
                      }
                      arr = [];
                      fs.writeFile(index, content, 'utf8', (err) => {
                        if (err) throw err;
                      });
                    }
                  });
                });
              }
            }
          });
        });
      }
    });
  }
});