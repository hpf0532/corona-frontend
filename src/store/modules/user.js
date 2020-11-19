import { register, login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    uid: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  }
}

const actions = {
  // user register
  register({ commit }, userInfo) {
    const { username, email, password, capcha, capcha_id } = userInfo
    return new Promise((resolve, reject) => {
      register({
        email: email.trim(),
        username: username.trim(),
        password: password,
        capcha_id: capcha_id,
        capcha: capcha
      }).then(response => {
        const data = response
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password, capcha, capcha_id } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, capcha: capcha, capcha_id: capcha_id }).then(response => {
        const data = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const data = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar, id } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_UID', id)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

