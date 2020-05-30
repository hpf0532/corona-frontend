import request from '@/utils/request'

// 主机组接口
export function createGroup(data) {
  return request({
    url: '/groups',
    method: 'post',
    data
  })
}

export function deleteGroup(id) {
  return request({
    url: '/groups/' + id,
    method: 'delete'
  })
}

export function editGroup(id, data) {
  return request({
    url: '/groups/' + id,
    method: 'put',
    data
  })
}

export function getGroup() {
  return request({
    url: '/groups',
    method: 'get'
  })
}

// playbook 接口
export function createPlayBook(data) {
  return request({
    url: '/playbooks',
    method: 'post',
    data
  })
}

export function deletePlayBook(id) {
  return request({
    url: '/playbooks/' + id,
    method: 'delete'
  })
}

export function editPlayBook(id, data) {
  return request({
    url: '/playbooks/' + id,
    method: 'put',
    data
  })
}

export function getPlayBooks() {
  return request({
    url: '/playbooks',
    method: 'get'
  })
}

export function getPlayBookDetail(id) {
  return request({
    url: '/playbooks/' + id,
    method: 'get'
  })
}

// 主机接口
export function createHost(data) {
  return request({
    url: '/hosts',
    method: 'post',
    data
  })
}

export function getHost(params) {
  return request({
    url: '/hosts',
    method: 'get',
    params
  })
}

export function updateHost(id, data) {
  return request({
    url: '/hosts/' + id,
    method: 'put',
    data
  })
}

export function deleteHost(id) {
  return request({
    url: '/hosts/' + id,
    method: 'delete'
  })
}

// 主机分组菜单
export function hostGroupSelect() {
  return request({
    url: '/group_hosts',
    method: 'get'
  })
}
