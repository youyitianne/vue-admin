import { login, logout, getInfo} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import axios from 'axios'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
      commit('SET_TOKEN', role)
      setToken(role)
      getUserInfo(role).then(response => {
        const data = response.data
        commit('SET_ROLES', data.roles)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        commit('SET_INTRODUCTION', data.introduction)
        console.log('----------')
        dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单.
        console.log('----------')
        resolve()
      })
    })
  },
    // 登录
    Login({ commit }, userInfo) {
      //const username = userInfo.username.trim()
      console.log('创建权限对象start+++++++++')
      return new Promise((resolve, reject) => {
        console.log('创建权限对象end 发送登录请求+++++++++')
        axios({
          headers: {'Content-Type': 'application/json;charset=UTF-8'},
          method: 'post',
          url: 'http://192.168.1.144:8084/login/login',
          data: {
            "username":userInfo.username,
          "password":userInfo.password
          }
        }).then(response=>{
          if(response.data.code===50020){
            reject('登录失败')
          }
          console.log('登录请求返回 +++++++++')
          const data = response.data.data
          setToken(data.token)
          console.log('添加本地token start+++++++++')
          commit('SET_TOKEN', data.token)
          console.log('token',data.token)
          console.log('添加本地token end+++++++++')
          resolve()
        }).catch(error=>{
          console.error(error)
          reject(error)
        });
        // login(username, userInfo.password).then(response => {
        //   console.log('登录请求返回 +++++++++')
        //   const data = response.data
        //   setToken(data.token)
        //   console.log('添加本地token start+++++++++')
        //   commit('SET_TOKEN', data.token)
        //   console.log('添加本地token end+++++++++')
        //   resolve()
        // }).catch(error => {
        //   console.error(error)
        //   reject(error)
        // })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
            //console.log(111)
          }
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            //console.log(113)
            commit('SET_ROLES', data.roles)
          } else {
            reject('权限不能为空!')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
         // console.log(114)
          resolve(response)
        }).catch(error => {
         // console.log(112)
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }

}

export default user
