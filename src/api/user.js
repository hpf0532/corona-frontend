import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/user/reg',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}

export function checkUser(data) {
  return request({
    url: '/user/check_user',
    method: 'post',
    data
  })
}

export function checkEmail(data) {
  return request({
    url: '/user/check_email',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function confirmEmail(params) {
  return request({
    url: '/confirm/' + params,
    method: 'get'
  })
}
