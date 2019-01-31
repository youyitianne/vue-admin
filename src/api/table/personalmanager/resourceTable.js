import request from '@/utils/request'


export function getRole() {
  return request({
    url: '/api/role',
    method: 'get',
  })
}


export function getapplist() {
  return request({
    url: '/getapplist',
    method: 'get',
  })
}

export function getResource(param) {
  return request({
    url: '/api/resource/'+param.username_mark,
    method: 'get',
  })
}


export function createResource(param) {
  return request({
    url: '/api/resource',
    method: 'post',
    params:param
  })
}

export function getProject() {
  return request({
    url: '/project',
    method: 'get',
  })
}

