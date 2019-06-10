import request from '@/utils/request'

export function listUserDataMeth(param) {
  return request({
    url: '/cooperation/listUserData',
    method: 'post',
    data:param,
  })
}

export function listAdDataMeth(param) {
  return request({
    url: '/cooperation/listAdData',
    method: 'post',
    data:param,
  })
}
