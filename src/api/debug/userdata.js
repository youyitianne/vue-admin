import request from '@/utils/request'


export function getuserdata(param) {
  return request({
    url: '/userdata/'+param.start+'/'+param.end,
    method: 'get',
  })
}
