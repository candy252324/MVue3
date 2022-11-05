import { isObject } from '@vue/shared'
import { reactive, readonly } from './index'
function createGetter(isReadonly = false, shallow = false): Function {
  return function get(target: Object, key: any, receiver: any) {
    const res = Reflect.get(target, key, receiver)
    if (!isReadonly) {
      // 收集依赖
    }
    if (shallow) {
      return res
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    return res
  }
}
function createSetter(shallow = false) {
  return function set(target: Object, key: any, value: any) {
    return Reflect.set(target, key, value)
  }
}
export const reactiveHandlers = {
  get: createGetter(),
  set: createSetter(),
}

export const shallowReactiveHandlers = {
  get: createGetter(false, true),
  set: createSetter(true),
}

export const readonlyHandler = {
  get: createGetter(true, false),
  set: () => {
    console.log('只读对象，不能设置')
  },
}

export const shallowReadonlyHandlers = {
  get: createGetter(true, true),
  set: () => {
    console.log('只读对象，不能设置')
  },
}
