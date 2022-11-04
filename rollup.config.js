import fs from 'fs'
// import path from 'path'
// import typescript from 'rollup-plugin-typescript2' // 用于解析ts
const target = process.env.TARGET // reactivity
const fullTarget = `./packages/${target}` // ./packages/reactivity
const jsonData = require(`./packages/${target}/package.json`) // 读取 ./packages/reactivity/package.json文件内容
const buildOptions = jsonData.buildOptions // 拿到 buildOptions 参数

const outputOptions = {
  'esm-bundler': {
    file: `${fullTarget}/dist/${buildOptions.name}.esm-bundler.js`,
    format: 'es',
  },
  cjs: {
    file: `${fullTarget}/dist/${buildOptions.name}.cjs.js`,
    format: 'cjs',
  },
  global: {
    file: `${fullTarget}/dist/${buildOptions.name}.global.js`,
    format: 'iife',
  },
}
function createConfig(output) {
  output.sourcemap = true
  return {
    input: `${fullTarget}/index.ts`,
    output,
    plugins: [
      // typescript({
      //   tsConfig: path.resolve(__dirname, 'tsconfig.json'),
      // }),
    ],
  }
}
export default buildOptions.format.map(format => createConfig(outputOptions[format]))
