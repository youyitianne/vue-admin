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
      introduce:param.introduce,
    }
  })
}

export function deleteApp(param) {
  return request({
    url: '/app/'+param.id,
    method: 'delete',
  })
}


