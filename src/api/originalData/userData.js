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
// export function getUmengDataHandler(param) {
//   return request({
//     url: '/dataStatisics/getUmengData',
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

export function getProjectVersion(param) {
  return request({
    url: '/umData/app/visions/'+param.sdkguid,
    method: 'get',
  })
}

export function getUserData(param) {
  return request({
    url: '/umData/app/data',
    method: 'post',
    data:param,
  })
}




