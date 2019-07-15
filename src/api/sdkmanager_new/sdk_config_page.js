import request from '@/utils/request'

export function addSDKPageMeth(param) {
  return request({
    url: '/tjsdk/addSDKPage',
    method: 'post',
    data:param
  })
}

export function getName() {
  return request({
    url: '/names',
    method: 'get',
  })
}

export function getAllSDK() {
  return request({
    url: '/tjsdk/getAllSDK',
    method: 'get',
  })
}


export function getSDKPage(param) {
  return request({
    url: '/tjsdk/getSDKPage',
    method: 'get',
    params:param
  })
}


export function getSDKPageInfo(param) {
  return request({
    url: '/tjsdk/getSDKPageInfo',
    method: 'get',
    params:param
  })
}


// export function getProjectConfigPublish() {
//   return request({
//     url: '/api/projectconfig_publish',
//     method: 'get',
//   })
// }
//
//
// export function getSdkTemplate() {
//   return request({
//     url: '/api/listtemplate',
//     method: 'get',
//   })
// }
//
// export function getChannel() {
//   return request({
//     url: '/channel',
//     method: 'get',
//   })
// }
//
// export function delProjectConfigPublish(param) {
//   return request({
//     url: '/channel',
//     method: 'get',
//   })
// }
//
// export function updateProjectConfig(param) {
//   return request({
//     url: '/api/publish_delete',
//     method: 'post',
//     data:param
//   })
// }
//
// export function getProject() {
//   return request({
//     url: '/project',
//     method: 'get',
//   })
// }
//
// export function getProjectPublishLimitMeth(param) {
//   return request({
//     url: '/api/projectconfig_publish/limit',
//     method: 'get',
//     params:param,
//   })
// }
