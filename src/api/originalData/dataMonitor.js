import request from '@/utils/request'

export function dataCheck(param) {
  return request({
    url: '/base/app/dataCheck/',
    method: 'post',
    data:param,
  })
}




