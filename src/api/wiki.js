import request from '@/utils/request'

// 获取分类列表接口
export function getCategorys() {
    return request({
      url: '/categorys',
      method: 'get'
    })
  }

// 创建分类接口
export function createCategory(data) {
  return request({
    url: '/categorys',
    method: 'post',
    data
  })
}  

// 删除分类接口
export function deleteCategory(id) {
  return request({
    url: '/category/' + id,
    method: 'delete'
  })
}

// 编辑分类接口
export function editCategory(id, data) {
  return request({
    url: '/category/' + id,
    method: 'put',
    data
  })
}

// 新建文章接口
export function createPost(data) {
  return request({
    url: 'posts',
    method: 'post',
    data
  })
}

// 获取文章数据接口
export function getPosts(params) {
  return request({
    url: '/posts',
    method: 'get',
    params
  })
}

// 获取文章详细接口
export function getPostDetail(id) {
  return request({
    url: `/post/${id}`,
    method: 'get'
  })
}


// 编辑文章接口
export function editPost(id, data) {
  return request({
    url: `/post/${id}`,
    method: 'put',
    data
  })
}

// 删除文章接口
export function deletePost(id) {
  return request({
    url: `/post/${id}`,
    method: 'delete'
  })
}

// 获取草稿接口
export function getDrafts() {
  return request({
    url: "/drafts",
    method: 'get'
  })
}

// 删除单一草稿接口
export function deleteDraft(id) {
  return request({
    url: `/draft/${id}`,
    method: 'delete'
  })
}

// 保存草稿接口
export function saveDraft(params, data) {
  return request({
    url: '/drafts',
    method: 'post',
    params,
    data
  })
}

// 批量删除草稿接口
export function batchDeleteDraft(data) {
  return request({
    url: '/delete-drafts',
    method: 'post',
    data
  })
}