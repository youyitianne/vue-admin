import request from '@/utils/request'

export function getDailyMsg(param) {
  return request({
    url: '/daily',
    method: 'post',
    responseType: "blob",
    data:param
  })
}

export function getDailyMsg1(param) {
  return request({
    url: '/daily_preview',
    method: 'post',
    data:param
  })
}
