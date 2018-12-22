import request from '@/utils/request'


export function getRole() {
  return request({
    url: '/api/role',
    method: 'get',
  })
}

export function creatRole(param,username_mark) {
  return request({
    url: '/api/role',
    method: 'post',
    data:{
      username:param.username,
      username_mark:username_mark,
      role:param.role,
      note:param.note,
      role_name:param.role_name,
      role_describe:param.role_describe,
    }
  })
}

export function updateRole(param) {
  return request({
    url: '/api/role/'+param.id,
    method: 'patch',
    data:{
      role:param.role,
      note:param.note,
      role_name:param.role_name,
      role_describe:param.role_describe,
    }
  })
}

export function deleteRole(param) {
  return request({
    url: '/api/role/'+param.id,
    method: 'delete',
  })
}

export function getPerms(param) {
  return request({
    url: '/api/perms/'+param.username_mark,
    method: 'get',
  })
}


export function createPerms(param) {
  return request({
    url: '/api/perms',
    method: 'post',
    params:param
  })
}
