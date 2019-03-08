import Cookies from 'js-cookie'

const OutIpKey = 'My-Out-Ip'
const InnerIpKey = 'My-Inner-Ip'

export function getMyOutIp() {
  return Cookies.get(OutIpKey)
}

export function setMyOutIp(ip) {
  return Cookies.set(OutIpKey, ip)
}

export function removeMyOutIp() {
  return Cookies.remove(OutIpKey)
}

export function getMyInnerIp() {
  return Cookies.get(InnerIpKey)
}

export function setMyInnerIp(ip) {
  return Cookies.set(InnerIpKey, ip)
}

export function removeMyInnerIp() {
  return Cookies.remove(InnerIpKey)
}
