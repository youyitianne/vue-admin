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
    params:param
  })
}

export function updateApp(param) {
  return request({
    url: '/app/'+param.id,
    method: 'patch',
    data:{
      name:param.name,
      system:param.system,
      icon:param.icon,
      project:param.project,
    }
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


