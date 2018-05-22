const packager = require('electron-packager')

options = {
  dir: './build',
  asar: true,
  name: "SISM Admin",
  out: "./electron-app",
  overwrite: true,
  platform: "win32"
}

packager(options).then((paths) => {
  console.log("App built", paths);
})