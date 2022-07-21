import * as PlusIcons from '@ant-design/icons-vue'
import { notification } from 'ant-design-vue';
import request from './request'
import global from './global'
import common from './common'
import treeTable from './treeTable'
import { message } from 'ant-design-vue';


import { nextTick } from 'vue'
const install = (app) => {
  app.config.globalProperties.$request = request
  app.config.globalProperties.$post = common.$post
  app.config.globalProperties.$postJson = common.$postJson
  app.config.globalProperties.$get = common.$get
  app.config.globalProperties.$delete = common.$delete
  app.config.globalProperties.$global = global
  app.config.globalProperties.$common = common
  app.config.globalProperties.$treeTable = treeTable
  app.config.globalProperties.$notify = notification.open;
  app.config.globalProperties.$message = message;

  app.config.globalProperties.$nextTick = nextTick;
  for(var key in PlusIcons) {
    app.component(`ElIcon${key}`, PlusIcons[key])
  }
}
export default install
