import request from '@/utils/request'


export function getRole() {
  return request({
    url: '/role',
    method: 'get',
  })
}

export function creatRole(param) {
  return request({
    url: '/role',
    method: 'post',
    params:param
  })
}

export function updateRole(param) {
  return request({
    url: '/role/'+param.id,
    method: 'patch',
    data:{
      username:param.username,
      role:param.role,
      note:param.note,
    }
  })
}

export function deleteRole(param) {
  return request({
    url: '/role/'+param.id,
    method: 'delete',
  })
}
