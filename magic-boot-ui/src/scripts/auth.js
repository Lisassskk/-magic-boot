import global from './global'
import request from '@/scripts/request'
const TokenKey = 'magic_boot_token'

export function getToken() {
  return localStorage.getItem(TokenKey);
}

export function setToken(token) {
  localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  localStorage.removeItem(TokenKey);
  global.user = {
    token: '',
    authorities: [],
    info: {},
    permissionRoutes: []
  }
}

export async function getUserInfo() {
  await request({
    url: 'user/info',
    method: 'get'
  }).then(response => {
    const { data } = response
    if(data){
      var authorities_ = []
      for (var i = 0; i < data.authorities.length; i++) {
        authorities_.push(data.authorities[i])
      }
      global.user.authorities = authorities_
      global.user.info = data
    }
  })
}

export function login(data){
  return new Promise((resolve, reject) => {
    request({
      url: 'security/login',
      method: 'post',
      data
    }).then(res => {
      var token = res.data
      setToken(token)
      resolve(token)
    }).catch((e) => {
      reject(e)
    })
  })
}

export function logout(){
  request({
    url: 'security/logout',
    method: 'get'
  }).then(() => {
    removeToken()
    location.reload()
  })
}
