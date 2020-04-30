import request from '@/utils/request'

export function checkFolder(data) {
    return request({
      url: '/user/check_folder',
      method: 'post',
      data
    })
  }