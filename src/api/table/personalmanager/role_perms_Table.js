import request from '@/utils/request'


export function getPerm() {
  return request({
    url: '/api/perm',
    method: 'get',
  })
}

export function creatPerm(param) {
  return request({
    url: '/api/perm',
    method: 'post',
    params:param
  })
}

export function updatePerm(param) {
  return request({
    url: '/api/perm/'+param.id,
    method: 'patch',
    data:{
      role:param.role,
      perm:param.perm,
      note:param.note,
    }
  })
}

export function deletePerm(param) {
  return request({
    url: '/api/perm/'+param.id,
    method: 'delete',
  })
}

export function getchannel() {
  return request({
    url: '/api/getchannel',
    method: 'get',
  })
}
