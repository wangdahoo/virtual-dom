import _ from './shared/utils'

export default (() => {
  const _type = Symbol('type')
  const _payload = Symbol('payload')

  class Patch {
    constructor (type, payload = {}) {
      if (!_.verifyPatchType(type)) throw new TypeError('参数错误: illegal type value.')

      this[_type] = type
      this[_payload] = payload
    }

    get type () {
      return this[_type]
    }

    get payload () {
      return this[_payload]
    }
  }

  return Patch
})()
