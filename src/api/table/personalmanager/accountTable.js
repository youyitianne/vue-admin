import request from '@/utils/request'


export function getAccount() {
  return request({
    url: '/api/account',
    method: 'get',
  })
}

export function creatAccount(param) {
  return request({
    url: '/api/account',
    method: 'post',
    params:param
  })
}

export function updateAccount(param) {
  return request({
    url: '/api/account/'+param.id,
    method: 'patch',
    data:{
      username:param.username,
      password:param.psd,
      department:param.department,
      position:param.position,
      note:param.note,
    }
  })
}

export function deleteAccount(param) {
  return request({
    url: '/api/account/'+param.id,
    method: 'delete',
  })
}
