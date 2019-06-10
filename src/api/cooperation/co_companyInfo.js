import request from '@/utils/request'

export function listCompanyMeth(param) {
  return request({
    url: '/cooperation/listCompany',
    method: 'get',
    params:param
  })
}

export function addCompanyMeth(param) {
  return request({
    url: '/cooperation/addCompany',
    method: 'post',
    data:param,
  })
}

export function delCompanyMeth(param) {
  return request({
    url: '/cooperation/delCompany',
    method: 'delete',
    data:param,
  })
}
export function editCompanyMeth(param) {
  return request({
    url: '/cooperation/editCompany',
    method: 'patch',
    data:param,
  })
}

