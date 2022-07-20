<template>
  <a-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="90px" v-if="isForm">
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item label="登录名称" name="username">
          <a-input v-model:value="temp.username" autocomplete="new-password" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="密码" name="password">
          <a-input v-model:value="temp.password" type="password" autocomplete="new-password" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item label="姓名/昵称" name="name">
          <a-input v-model:value="temp.name" autocomplete="new-password" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="temp.phone" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12">
        <a-form-item label="组织机构" name="officeId">
          <mb-treeselect url="/system/user/offices" v-model="temp.officeId" :key="temp.officeId" placeholder="请选择组织机构" check-strictly />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="选择角色" name="roles">
          <mb-select v-model:value="temp.roles" url="/system/role/all" placeholder="请选择角色" multiple />
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item label="登录状态" name="isLogin" v-if="temp.id != '1'">
      <a-radio-group v-model="temp.isLogin">
        <a-radio-button label="0">有效</a-radio-button>
        <a-radio-button label="1">锁定</a-radio-button>
      </a-radio-group>
    </a-form-item>
  </a-form>
</template>

<script setup>

import { ref, reactive, getCurrentInstance, nextTick } from 'vue'

const emit = defineEmits(['reload-table'])
const { proxy } = getCurrentInstance()

const rules = reactive({
  name: [{ required: true, message: '请输入姓名/昵称', trigger: 'blur' }],
  username: [{ required: true, message: '请输入登录名称', trigger: 'blur' }],
  roles: [{ required: true, message: '请选择角色', trigger: 'blur' }],
  officeId: [{ required: true, message: '请选择组织机构', trigger: 'blur' }]
})
const temp = ref(getTemp())
const isForm = ref(true)
const dataForm = ref()

function getTemp() {
  return {
    id: '',
    name: '',
    username: '',
    password: '',
    phone: '',
    isLogin: 0,
    roles: null,
    officeId: null
  }
}

function resetTemp() {
  isForm.value = false
  rules.password = [{ required: true, message: '请输入密码', trigger: 'blur' }]
  temp.value = getTemp()
  nextTick(() => {
    isForm.value = true
    nextTick(() => {
      dataForm.value.clearValidate()
    })
  })
}

function save(d) {
  dataForm.value.validate().then((valid) => {
    if (valid) {
      d.loading()
      proxy.$post('/system/user/save', temp.value).then(() => {
        d.hideLoading()
        proxy.$notify({
          title: '成功',
          message: d.title + '成功',
          type: 'success',
          duration: 2000
        })
        emit('reload-table')
      }).catch(() => d.hideLoading())
    }
  })
}

function getInfo(row) {
  isForm.value = false
  delete rules.password
  nextTick(() => {
    isForm.value = true
  })
  for (var t in temp.value) {
    if (t !== 'roles') {
      temp.value[t] = row[t]
    }
  }
  proxy.$get('/system/user/roles', { userId: temp.value.id }).then((res) => {
    temp.value.roles = res.data.join(',')
  })
}

defineExpose({ save, getInfo, resetTemp })

</script>
