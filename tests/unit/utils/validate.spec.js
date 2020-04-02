import { validEmail, isExternal } from '@/utils/validate.js'

describe('Utils:validate', () => {
  it('validEmail', () => {
    expect(validEmail('admin')).toBe(true)
    expect(validEmail('editor')).toBe(true)
    expect(validEmail('xxxx')).toBe(false)
  })
  it('isExternal', () => {
    expect(isExternal('https://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    expect(isExternal('http://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    expect(isExternal('github.com/PanJiaChen/vue-element-admin')).toBe(false)
    expect(isExternal('/dashboard')).toBe(false)
    expect(isExternal('./dashboard')).toBe(false)
    expect(isExternal('dashboard')).toBe(false)
  })
})
