function isObject(target: any) {
  return typeof target === 'object' && target !== null
}
function isArray(target: any) {
  return Array.isArray(target)
}
function isIntegerKey(key: any) {
  return typeof key === 'string' && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key
}

function hasOwn(target: any, key: string) {
  console.log(Object.prototype.hasOwnProperty.call(target, key), target, key)
  return Object.prototype.hasOwnProperty.call(target, key)
}
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export { isObject, isArray, isIntegerKey, hasOwn }
