import { isArray, isIntegerKey } from '@vue/shared'

let activeEffect: Function
let effectStack: Function[] = []
function effect(fn: Function, options: any = {}) {
  if (!effectStack.includes(fn)) {
    try {
      effectStack.push(fn)
      activeEffect = fn
      if (!options.lazy) {
        fn()
      }
    } finally {
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1]
    }
  }
}

// {target:{key:[effect,effect]}}
let targetMap = new WeakMap()
function track(target: any, type: string, key: string) {
  if (!activeEffect) {
    return
  }
  // {key:[effect,effect]}
  let depMap = targetMap.get(target)
  if (!depMap) {
    targetMap.set(target, (depMap = new Map()))
  }
  // [effect,effect]
  let dep = depMap.get(key)
  if (!dep) {
    depMap.set(key, (dep = new Set()))
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
  }
  console.log(targetMap)
}

function trigger(target: any, type: 'add' | 'set', key: string, newValue: any, oldValue?: any) {
  const depMap = targetMap.get(target)
  if (!depMap) return
  const effectSet = new Set()
  const add = (effectAdd: Function[]) => {
    if (effectAdd) {
      effectAdd.forEach((effect: Function) => effectSet.add(effect))
    }
  }
  // 修改数组length，比如state.list.length = 2 ( newValue 为 2)
  // 那么需要把所有 length 的依赖和  index 大于或等于 2 的 依赖都重新执行一遍
  // 需要重新执行的依赖有 effect(()=>{ state.list.length})，effect(()=>{ state.list[2]})，effect(()=>{ state.list[3]})，等等
  if (key === 'length' && isArray(target)) {
    depMap.forEach((dep: Function[], key: any) => {
      console.log(depMap, key)
      if (key === 'length' || key > newValue) {
        add(dep)
      }
    })
  } else {
    // 对象
    if (key != undefined) {
      add(depMap.get(key))
    }
    // 数组修改索引
    switch (type) {
      case 'add':
        if (isArray(target) && isIntegerKey(key)) {
          add(depMap.get('length'))
        }
    }
  }
  effectSet.forEach((effect: any) => effect())
}
export { effect, track, trigger }
