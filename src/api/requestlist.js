import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/2018-10-27_2018-10-27_保护气球',
    method: 'get',
    params
  })
}
