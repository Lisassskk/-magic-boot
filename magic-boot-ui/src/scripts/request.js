import axios from 'axios'
// import { ElMessage, ElMessageBox } from 'element-plus'
import { message } from 'ant-design-vue';
import { logout, login } from '@/scripts/auth'
import { getToken } from '@/scripts/auth'
import global from '@/scripts/global'

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000 * 60 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

var currentMessage
// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.config.url.indexOf('user/info') !== -1 && response.data.code === 402) {
      logout()
    }
    return new Promise((reslove, reject) => {
      const res = response.data
      if (res.code !== 200) {
        var duration = 5
        if (res.code === 402) {
          duration = 1
          if(global.user.info.username){
            Modal.confirm({
              title: `提示`,
              icon: createVNode(ExclamationCircleOutlined),
              content: createVNode('div', { style: 'color:red;' },  `当前账号：${global.user.info.username}凭证已过期，请输入密码重新登录`),
              onOk() {
                console.log('OK');
                if (action === 'confirm') {
                  login({
                    username: global.user.info.username,
                    password: instance.inputValue
                  }).then((res) => {
                    if (res) {
                      done()
                      service(response.config).then(ret => reslove(ret))
                    }
                  })
                } else if (action === 'cancel') {
                  logout()
                } else {
                  done()
                }
              },
              onCancel() {
                console.log('Cancel');
                if (action === 'confirm') {
                  login({
                    username: global.user.info.username,
                    password: instance.inputValue
                  }).then((res) => {
                    if (res) {
                      done()
                      service(response.config).then(ret => reslove(ret))
                    }
                  })
                } else if (action === 'cancel') {
                  logout()
                } else {
                  done()
                }
              },
              class: 'test',
              okText: '确定',
              cancelText: '退出',
            });

            // ElMessageBox.prompt(`当前账号：${global.user.info.username}凭证已过期，请输入密码重新登录`, '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '退出',
            //   inputType: 'password',
            //   closeOnClickModal: false,
            //   beforeClose: (action, instance, done) => {
            //     if (action === 'confirm') {
            //       login({
            //         username: global.user.info.username,
            //         password: instance.inputValue
            //       }).then((res) => {
            //         if (res) {
            //           done()
            //           service(response.config).then(ret => reslove(ret))
            //         }
            //       })
            //     } else if (action === 'cancel') {
            //       logout()
            //     } else {
            //       done()
            //     }
            //   }
            // })
          }
        }
        if (res.code !== 402) {
          console.log('****************res:{}',res);
          console.log('currentMessage:{{{{}}}',currentMessage);
          // if(currentMessage){
          //   currentMessage.close()
          // }
          if(res.code == 403 && import.meta.env.MODE == 'demo'){
            res.message = '演示模式，不允许操作！'
          }
          // currentMessage = ElMessage({
          //   message: res.message || 'Error',
          //   type: 'error',
          //   duration: duration * 1000,
          //   showClose: true
          // })
          currentMessage = message.error(res.message || 'Error');
          reject(res)
        }
      } else {
        reslove(res)
      }
    })
  },
  error => {
    console.log('err' + error) // for debug
    // if(currentMessage){
    //   currentMessage.close()
    // }
    // currentMessage = ElMessage({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    currentMessage = message.error(res.message || 'Error');
    return Promise.reject(error)
  }
)

export default service
