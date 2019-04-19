import request from '@/utils/request'


export function delQiniuFileRecordMeth(param) {
  return request({
    url: '/api/system/delQiniuFileRecord',
    method: 'delete',
    params:param,
  })
}

export function getQiniuFileLimitMeth(param) {
  return request({
    url: '/qiniufile/limit',
    method: 'get',
    params:param,
  })
}






