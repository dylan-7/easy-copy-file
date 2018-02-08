const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
let src,
    dist
let from = process.argv.findIndex(v => v === '--from') + 1,
    to = process.argv.findIndex(v => v === '--to') + 1

if (from && to) {
  src = path.resolve(process.argv[from])
  dist = process.argv[to]
} else {
  console.log(chalk.red('请检查参数：--from [dir] --to [dir]'))
  return
}

const copy = function(src, dst) {

  if (!fs.existsSync(dst)) {
    fs.mkdirSync(dst, 0o77, err => {
      if (err) throw err
    })
  }
  
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
