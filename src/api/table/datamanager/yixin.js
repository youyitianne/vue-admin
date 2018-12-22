import request from '@/utils/request'


export function getyixindata(param) {
  return request({
    url: '/yixin/'+param.start+'/'+param.end,
    method: 'get',
  })
}
