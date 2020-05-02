import request from '@/utils/request'

export function checkFolder(data) {
    return request({
        url: '/file/check_folder',
        method: 'post',
        data
    })
}

export function getFileList(params) {
    return request({
        url: '/files',
        method: 'get',
        params
    })
}

// 创建文件夹
export function addFolder(data) {
    return request({
        url: '/files',
        method: 'post',
        data
    })
}