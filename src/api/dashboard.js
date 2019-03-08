import request from '@/utils/request'

export function updatePassword(param) {
  return request({
    url: '/updatePassword',
    method: 'post',
    data:param
  })
}
