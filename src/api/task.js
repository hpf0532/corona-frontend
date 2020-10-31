import request from '@/utils/request'
// 任务接口
export function getTasks(params) {
  return request({
    url: '/tasks',
    method: 'get',
    params
  })
}

export function getTaskDetail(id) {
  return request({
    url: '/tasks/' + id,
    method: 'get'
  })
}

export function flushTask(id) {
  return request({
    url: '/flush_task/' + id,
    method: 'get'
  })
}

export function submitTask(data, params) {
  return request({
    url: '/tasks',
    method: 'post',
    data,
    params
  })
}

// PlayBook参数配置接口
export function createOptions(data) {
  return request({
    url: '/options',
    method: 'post',
    data
  })
}

export function deleteOptions(id) {
  return request({
    url: '/options/' + id,
    method: 'delete'
  })
}

export function updateOptions(id, data) {
  return request({
    url: '/options/' + id,
    method: 'put',
    data
  })
}

export function getOptions(params) {
  return request({
    url: '/options',
    method: 'get',
    params
  })
}

// 环境信息接口
export function getEnvs() {
  return request({
    url: '/envs',
    method: 'get'
  })
}

// task options接口
export function getTaskOptions(params) {
  return request({
    url: '/task_options',
    method: 'get',
    params
  })
}

export function distUpload(param, params) {
  return request({
    method: 'post',
    url: '/upload_dist',
    headers: { 'Content-Type': 'multipart/form-data' },
    // onUploadProgress: Event => {
    //   console.log(Event)
    // },
    data: param,
    params: params
  })
}

// 取消任务接口
export function taskCancel(data) {
  return request({
    method: 'post',
    url: '/stop_task',
    data: data
  })
}

// 测试ssh连接接口
export function testSSHConn() {
  return request({
    method: 'get',
    url: '/test_ssh'
  })
}
