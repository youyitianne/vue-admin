import request from '@/utils/request'


export function getApp() {
  return request({
    url: '/app',
    method: 'get',
  })
}

export function createApp(param) {
  return request({
    url: '/app',
    method: 'post',
    data:param
  })
}

export function updateApp(param) {
  return request({
    url: '/app/'+param.id,
    method: 'patch',
    data:param
  })
}

export function deleteApp(param) {
  return request({
    url: '/app/'+param.id,
    method: 'delete',
  })
}

export function getProject() {
  return request({
    url: '/project',
    method: 'get',
  })
}

export function getProjectLimitMeth(param) {
  return request({
    url: '/app/limit',
    method: 'get',
    params:param,
  })
}


