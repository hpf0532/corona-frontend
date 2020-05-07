import request from '@/utils/request'

export function checkFolder(data) {
    return request({
        url: '/filerepo/check_folder',
        method: 'post',
        data
    })
}

export function getFileList(params) {
    return request({
        url: '/filerepo/filelist',
        method: 'get',
        params
    })
}

// 创建文件夹
export function addFolder(data) {
    return request({
        url: '/filerepo/folder',
        method: 'post',
        data
    })
}

// 编辑文件夹
export function editFolder(id, data) {
    return request({
      url: '/filerepo/folder/' + id,
      method: 'put',
      data
    })
}

export function deleteFile(id) {
    return request({
      url: '/filerepo/folder/' + id,
      method: 'delete'
    })
  }


// 获取sts token
export function getSTSToken(data) {
    return request({
       url: '/filerepo/sts_token',
       method: 'post',
       data
    })
}