import request from '@/utils/request'

export function getRemindedAppMeth(param) {
  return request({
    url: '/apkInfo/ListRemindApp',
    method: 'get',
    params:param,
  })
}

