import { isObject, isArray, isIntegerKey, hasOwn, isSymbol } from '@vue/shared'
import { reactive, readonly } from './index'
import { track, trigger } from './effect'

function createGetter(isReadonly = false, shallow = false): Function {
  return function get(target: Object, key: any, receiver: any) {
    const res = Reflect.get(target, key, receiver)
    // 非只读的数据（reactive 和 shallowReactive） 收集依赖
    if (!isReadonly) {
      // 数组收集依赖的时候，key 除了会出现"length","toString","join"等情况，还会出现类型是 Symbol 的情况
      // 这里为了方便处理，直接过滤了这种情况
      if (!isSymbol(key)) {
        track(target, 'get', key)
      }
    }
    // shallow 的数据（shallowReactive 和 shallowReadonly） 走到这里直接 return 就行了，因为 Proxy api 默认是浅作用
    if (shallow) {
      return res
    }
    // 非 shallow 的数据（reactive 和 readonly） 走这里，懒代理
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    return res
  }
}
function createSetter(shallow = false) {
  return function set(target: any, key: string, value: any) {
    const oldValue = target[key]
    // 对于数组，比如 state.list[100]="xxx"，key 是字符串"100"， 若 100 小于 list 的长度，则是修改，否则是新增
    // 对于对象，如果原型对象上存在 key 属性，则是修改，否则是新增
    const hasKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key)
    // 注意这里 Reflect.set 放置位置，Reflect.set后，target值立即发生变化
    const result = Reflect.set(target, key, value)
    if (!hasKey) {
      // 新增
      trigger(target, 'add', key, value)
    } else {
      // 修改
      if (oldValue !== value) {
        trigger(target, 'set', key, value, oldValue)
      }
    }
    return result
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
