const packager = require('electron-packager')

options = {
  dir: './build',
  asar: true,
  name: "SIMS Admin",
  out: "./electron-app",
  overwrite: true
}

packager(options).then((paths) => {
  console.log("App built", paths);
})