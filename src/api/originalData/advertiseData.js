import request from '@/utils/request'

export function getAdvertiseData(param) {
  return request({
    url: '/base/app/advinfo',
    method: 'post',
    data:param,
  })
}




