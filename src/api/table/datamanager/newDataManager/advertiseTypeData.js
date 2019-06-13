import request from '@/utils/request'

export function addAdtypeHandler(param) {
  return request({
    url: '/dataStatisics/addAdtype',
    method: 'post',
    data:param,
  })
}


export function getAdtypeHandler(param) {
  return request({
    url: '/dataStatisics/getAdtype',
    method: 'get',
    params:param
  })
}

export function delAdtypeHandler(param) {
  return request({
    url: '/dataStatisics/delAdtype',
    method: 'delete',
    params:param
  })
}


export function editAdtypeHandler(param) {
  return request({
    url: '/dataStatisics/editAdtype',
    method: 'patch',
    data:param,
  })
}
