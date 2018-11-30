import request from '@/utils/request'

export function gettest(param) {
  return request({
    url: '/test',
    method: 'get',
    param
  })
}
