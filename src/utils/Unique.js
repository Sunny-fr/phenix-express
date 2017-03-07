/* eslint-disable */
module.exports = class Unique {
  constructor () {
    this.pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    return this.gen()
  }

  toString () {
    return this.gen()
  }

  gen () {
    return this.pattern.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
}
