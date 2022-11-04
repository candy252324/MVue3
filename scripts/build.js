const fs = require('fs')
const path = require('path')
const execa = require('execa')

const dirs = [] // [ 'reactivity', 'shared' ]
// 遍历 packages 目录，找出里面的一级文件夹
const packages = fs.readdirSync('./packages').forEach(file => {
  if (fs.statSync(`./packages/${file}`).isDirectory()) {
    dirs.push(file)
  }
})

async function build(dir) {
  // 相当于帮我们运行了 rollup -c --environment TARGET:reactivity
  await execa('rollup', ['-c', '--environment', `TARGET:${dir}`])
}

function runParaller(dirs, buildFn) {
  let fns = []
  dirs.forEach(dir => {
    fns.push(buildFn(dir))
  })
  return Promise.all(fns)
}

runParaller(dirs, build).then(() => {
  console.log('全部打包成功')
})
