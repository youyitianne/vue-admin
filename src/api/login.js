import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/login/login',
    method: 'post',
    data: {
      username,
      password,
      return_url:'/'
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { Bearer:token }
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}
