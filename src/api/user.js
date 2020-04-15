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

export function getUsers() {
  return request({
    url: '/users',
    method: 'get'
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}

export function getTimeLine() {
  return request({
    url: '/user/timeline',
    method: 'get',
  })
}

export function getEmailState() {
  return request({
    url: '/user/state',
    method: 'get'
  })
}

export function getCapcha() {
  return request({
    url: '/capcha',
    method: 'get'
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

export function forgetPassword(data) {
  return request({
    url: '/forget-password',
    method: 'post',
    data
  })
}

export function resendConfirmEmail() {
  return request({
    url: '/resend-confirm-email',
    method: 'get',
  })
}


export function resetPassword(token, data) {
  return request({
    url: '/reset-password/' + token,
    method: 'post',
    data
  })
}