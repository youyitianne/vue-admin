import request from '@/utils/request'

export function getOperationLog(param) {
  return request({
    url: '/operationlog',
    method: 'post',
    data:param
  })
}
