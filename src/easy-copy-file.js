const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const packageJson = path.resolve('package.json')
let src,
    dist
const inst = JSON.parse(fs.readFileSync(packageJson), 'utf-8').scripts.build,
      arr = inst.split(' '),
      fromIndex = arr.some(v => v === '--from') ? arr.findIndex(v => v === '--from') : false,
      toIndex = arr.some(v => v === '--to') ? arr.findIndex(v => v === '--to') : false


if (arr && fromIndex && toIndex) {
  src = path.resolve(String(arr[fromIndex + 1]))
  dist = String(arr[toIndex + 1])
} else {
  console.log(chalk.red('请检查参数：--from [dir] --to [dir]'))
  return
}

const copy = function(src, dst) {
  
  //判断文件需要时间，必须同步
  if(fs.existsSync(src)) {
    fs.readdir(src, (err, files) => {
      if(err) {
        console.log(err)
        return
      }
      
      files.forEach(filename => {
        // 路径不能直接拼接，Unix”/“，Windows”\“
        let url = path.join(src,filename),
            dest = path.join(dst,filename)
        
        console.log(chalk.green(`${url}\n${dest} \n`))
        
        fs.stat(path.join(src, filename), (err, stats) => {
          if (err) throw err
          if(stats.isFile()) {
            let writable = fs.createWriteStream(dest, {encoding: "utf-8"})
            fs.createReadStream(url).pipe(writable)
          }else if(stats.isDirectory()) {
            exists(url, dest, copy)
          }
        })

      })
    })
  }
}

function exists(src, dst, cb) {
  fs.exists(dst, err => {
    if (err) {
      cb && cb(src, dst)
    } else {
      // 目录读写权限，默认0777
      fs.mkdir(dst, 0o777, err => {
        if (err) throw err
        cb && cb(src, dst)
      })
    }
  })
}

module.exports = copy

copy(src, dist)
