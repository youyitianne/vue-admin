import request from '@/utils/request'


// export function getUmengAppHandler() {
//   return request({
//     url: '/dataStatisics/getUmengApp',
//     method: 'get'
//   })
// }
//
// export function getUmengChannelHandler(param) {
//   return request({
//     url: '/dataStatisics/getUmengChannel',
//     method: 'get',
//     params:param
//   })
// }
//
// export function getUmengVersionHandler(param) {
//   return request({
//     url: '/dataStatisics/getUmengVersion',
//     method: 'get',
//     params:param
//   })
// }
//
// export function getUmengRetentionHandler(param) {
//   return request({
//     url: '/dataStatisics/getUmengRetention',
//     method: 'post',
//     data:param,
//   })
// }

export function getProjectList() {
  return request({
    url: '/api/listProject',
    method: 'get',
  })
}

export function getRetentionData(param) {
  return request({
    url: '/umData/app/rentioin',
    method: 'post',
    data:param,
  })
}



