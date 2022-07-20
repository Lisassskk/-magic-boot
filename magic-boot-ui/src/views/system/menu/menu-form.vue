<style>
.ant-input .ant-input{
  text-align: left;
}
</style>

<template>
  <a-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px">
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item label="菜单类型" name="type">
          <a-radio-group v-model:value="menuType">
            <a-radio-button value="menu">菜单</a-radio-button>
            <a-radio-button value="button">按钮</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="上级菜单" name="pid">
          <a-tree-select v-model:value="temp.pid" :tree-data="menuTree" :key="temp.pid" style="width: 100%" check-strictly />
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item label="菜单名称" name="name">
      <a-input v-model:value="temp.name" />
    </a-form-item>
    <a-form-item label="菜单链接" name="url" v-if="menuType == 'menu'">
      <a-input v-model:value="temp.url" />
    </a-form-item>
    <a-form-item label="关联组件" name="componentName" v-if="menuType == 'menu'">
      <a-tree-select v-model:value="temp.componentName" :tree-data="componentTree" :key="temp.componentName" allow-clear style="width: 100%" placeholder=" " />
    </a-form-item>
    <a-form-item label="权限标识" name="permission" v-if="menuType == 'button'">
      <a-input v-model:value="temp.permission" />
    </a-form-item>
    <a-row :gutter="24">
      <a-col :span="6">
        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="temp.sort" controls-position="right" />
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="选择图标" name="icon" v-if="menuType == 'menu'">
          <a @click="openIcons">
            <a-input-search v-model:value="temp.icon" class="input-with-select">
              <template #enterButton>
                <a-button style="height:32px;">
                  <mb-icon :icon="temp.icon" />
                </a-button>
              </template>
            </a-input-search>
          </a>
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="菜单显示" v-if="menuType == 'menu'">
          <a-radio-group v-model:value="temp.isShow">
            <a-radio-button :value="1">显示</a-radio-button>
            <a-radio-button :value="0">不显示</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item label="路由缓存" v-if="menuType == 'menu'">
          <a-radio-group v-model:value="temp.keepAlive">
            <a-radio-button :value="1">缓存</a-radio-button>
            <a-radio-button :value="0">不缓存</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
  <mb-dialog ref="iconDialog">
    <template #content>
      <menu-icons :select-icon="selectIcon" />
    </template>
  </mb-dialog>
</template>

<script setup>
import { ref, reactive, watch, nextTick, getCurrentInstance } from 'vue'
import MenuIcons from './menu-icons'

const { proxy } = getCurrentInstance()

const props = defineProps({
  menuTree: {
    type: Array,
    default: () => []
  },
  menuData: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['reload-table'])
const componentTree = ref()
const dataForm = ref()
const iconDialog = ref()
const menuType = ref('menu')
const getTemp = () => {
  return {
    id: '',
    name: '',
    url: '',
    permission: '',
    sort: 0,
    descRibe: '',
    isShow: 1,
    pid: 0,
    icon: '',
    keepAlive: 0,
    componentName: ''
  }
}

proxy.$get('/system/component/select').then(res => {
  componentTree.value = res.data
})

const temp = ref(getTemp())

var validateUrl = (rule, value,callback) => {
  console.log('***********validateUrl:::{}');
  if(menuType.value == 'menu'){
    if(!value){
      return Promise.reject(new Error('请输入菜单链接'))
    }else{
      return Promise.resolve();
    }
  }else{
    return Promise.resolve();
  }
}

var validatePermission = (rule, value,callback) => {
   console.log('***********validatePermission:::{}');
  if(menuType.value == 'button'){
    if(!value){
      return Promise.reject(new Error('请输入权限标识'))
    }else{
      return Promise.resolve();
    }
  }else{
    return Promise.resolve();
  }
}

const rules = reactive({
  pid: [{ required: true, message: '请选择上级菜单', trigger: 'blur' }],
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  url: [{ required: true, trigger: 'blur', validator: validateUrl }],
  permission: [{ required: true, trigger: 'blur', validator: validatePermission }]
})

watch(menuType, (type) => {
  nextTick(() => {
    dataForm.value.clearValidate()
  })
  if(type == 'menu'){
    temp.value.isShow = 1
  }else{
    temp.value.isShow = 0
  }
})

function save(d) {
  console.log('*********save********:{}',dataForm.value);
  dataForm.value.validate().then((valid) => {
    console.log('*****************11111');
    if (valid) {
      d.loading()
      if(temp.value.pid == temp.value.id){
        proxy.$notify({
          title: '失败',
          message: '上级菜单不能选当前菜单',
          type: 'error',
          duration: 2000
        })
        return
      }
      if(proxy.$treeTable.isChildren(proxy.$treeTable.queryChildren(props.menuData, temp.value.id), temp.value.pid)){
        proxy.$notify({
          title: '失败',
          message: '上级菜单不能选当前菜单子级',
          type: 'error',
          duration: 2000
        })
        return
      }
      if(menuType.value == 'menu'){
        temp.value.permission = ''
      }else{
        temp.value.isShow = 0
        temp.value.keepAlive = 0
        temp.value.icon = ''
        temp.value.url = ''
      }
       console.log('*****************222222');
      proxy.$post('/system/menu/save', temp.value).then(() => {
         console.log('*****************33333333333',d);
        d.hideLoading()
         d.hide()
        proxy.$notify({
          title: '成功',
          message: d.title + '成功',
          type: 'success',
          duration: 2000
        })
       
        emit('reload-table')
      }).catch(() => d.hideLoading())
    }
  }).catch(e=>{
    console.error('**********************************:{}',e);
  })
}

function addSubMenu(id) {
  resetTemp()
  menuType.value = 'menu'
  temp.value.pid = id
  temp.value.id = proxy.$common.uuid()
  getSort()
  nextTick(() => {
    dataForm.value.clearValidate()
  })
}
function getInfo(row) {
  console.log('getInfo执行了**********:{}',row);
  for (var t in temp.value) {
    temp.value[t] = row[t]
  }
  menuType.value = temp.value.url ? 'menu' : 'button'
  temp.value.name = temp.value.name.replaceAll(/<font.*?>(.*?)<\/font>/g,'$1')
  nextTick(() => {
    dataForm.value.clearValidate()
  })
  console.log('temp::::{}',temp);
}

function resetTemp() {
  temp.value = getTemp()
}

function selectIcon(symbol) {
  temp.value.icon = symbol
  iconDialog.value.hide()
}

function openIcons() {
  iconDialog.value.show()
}

function getSort() {
  proxy.$get('/system/menu/sort', { pid: temp.value.pid }).then(res => {
    temp.value.sort = res.data
  })
}

defineExpose({ addSubMenu, getInfo, save })

</script>
