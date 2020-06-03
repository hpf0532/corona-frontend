import Vue from 'vue'
import { getCategorys, createCategory, editCategory, getPosts } from '@/api/wiki'

const state = {
    categoryList: [],
    postList: {},
    total: 0,
    query: {
        page: 1,
        limit: 20
    }
}

const mutations = {
    SET_CATEGORYS: (state, categoryList) => {
        state.categoryList = categoryList
    },
    CREATE_CATEGORY: (state, item) => {
        state.categoryList.push(item)
    },
    EDIT_CATEGORY: (state, payload) => {
        state.categoryList.splice(payload.index, 1, payload.data)
    },
    SET_EDIT: (state, index) => {
        state.categoryList[index].edit = true
    },
    SET_POSTS: (state, postList) => {
        state.postList = postList
        state.total = postList.count
    },
    SET_QUERY: (state, query) => {
        state.query = query 
    }
}

const actions = {
    // fetch post list
    getPosts({ commit }, params) {
        return new Promise((resolve, reject) => {
            getPosts(params).then(response => {
                commit('SET_POSTS', response)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // fetch category list
    getCategorys({ commit }) {
    return new Promise((resolve, reject) => {
        getCategorys().then(response => {
            const data = response
            commit('SET_CATEGORYS', data.items)
            resolve()
        }).catch(error => {
            reject(error)
        })
    })
  },
  addCategory({ commit }, data) {
      return new Promise((resolve, reject) => {
        createCategory(data).then(response => {
            const data = response
            commit('CREATE_CATEGORY', data)
            resolve()
        }).catch(error => {
            reject(error)
        })
      })
  },
  changeCategory({ commit }, params) {
      console.log(params)
      return new Promise((resolve, reject) => {
          editCategory(params.id, { "name":params.name }).then(response => {
              const data = response
              console.log(data)
              commit('EDIT_CATEGORY', {index: params.index, "data":data})
              resolve()
          }).catch(error => {
              reject(error)
          })
      })
  }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }