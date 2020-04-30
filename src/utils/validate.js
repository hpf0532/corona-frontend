/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
import { checkEmail, checkUser } from '@/api/user'
import { checkFolder } from '@/api/file'

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUserExist(user) {
  const data = { 'username': user }
  return new Promise((resolve, reject) => {
    checkUser(data).then(response => {
      const { status } = response
      resolve(status)
    }).catch(error => {
      reject(error)
    })
  })
}

export function validFolderExist(folder) {
  const data = { 'folder_name': folder }
  return new Promise((resolve, reject) => {
    checkFolder(data).then(response => {
      const { status } = response
      resolve(status)
    }).catch(error => {
      reject(error)
    })
  })
}

export function validEmailExist(email) {
  const data = { 'email': email }
  return new Promise((resolve, reject) => {
    checkEmail(data).then(response => {
      const { status } = response
      resolve(status)
    }).catch(error => {
      reject(error)
    })
  })
}

export function validEmail(str) {
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  // 校验邮箱格式
  const mailRe = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
  return mailRe.test(str)
}

export function validIP(ip) {
  // 校验ip格式
  var ipRe = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return ipRe.test(ip)
}
