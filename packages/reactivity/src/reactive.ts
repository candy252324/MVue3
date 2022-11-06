import { isObject } from '@vue/shared'

import { reactiveHandlers, shallowReactiveHandlers, readonlyHandler, shallowReadonlyHandlers } from './baseHandlers'

const readonlyMap = new WeakMap() // 存储已经代理过的只读对象
const reactiveMap = new WeakMap() // 存储已经代理过的响应式对象

function createReactiveObject(target: any, isReadonly = false, baseHandler: Object) {
  if (!isObject(target)) return target
  const proxyMap = isReadonly ? readonlyMap : reactiveMap
  const proxyExist = proxyMap.get(target)
  // 防止数据被重复代理
  if (proxyExist) return proxyExist
  const proxy = new Proxy(target, baseHandler)
  proxyMap.set(target, proxy)
  return proxy
}
// 最终是返回了一个 proxy 实例
function reactive(target: any) {
  return createReactiveObject(target, false, reactiveHandlers)
}
function shallowReactive(target: any) {
  return createReactiveObject(target, false, shallowReactiveHandlers)
}
function readonly(target: any) {
  return createReactiveObject(target, true, readonlyHandler)
}
function shallowReadonly(target: any) {
  return createReactiveObject(target, true, shallowReadonlyHandlers)
}
export { reactive, shallowReactive, readonly, shallowReadonly }
