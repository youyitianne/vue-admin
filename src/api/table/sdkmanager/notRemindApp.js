import request from '@/utils/request'

export function getNotRemindAppMeth(param) {
  return request({
    url: '/apkInfo/ListNotRemindApp',
    method: 'get',
    params:param,
  })
}

