<template>
  <div class="app-container">
    <a-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 800px">
      <a-form-item label="头像" name="headPortrait">
        <mb-upload-image v-model="temp.headPortrait" />
      </a-form-item>
      <a-form-item label="姓名/昵称" name="name">
        <a-input v-model:value="temp.name" disabled />
      </a-form-item>
      <a-form-item label="手机号" name="phone">
        <a-input v-model:value="temp.phone" type="tel" :maxlength="11" autocomplete="phone" />
      </a-form-item>
      <a-form-item label="原密码" name="password">
        <a-input v-model:value="temp.password" type="password" autocomplete="new-password" />
      </a-form-item>
      <a-form-item label="新密码" name="newPassword">
        <a-input v-model:value="temp.newPassword" type="password" autocomplete="new-password" />
      </a-form-item>
      <a-form-item label="确认密码" name="confirmPassword">
        <a-input v-model:value="temp.confirmPassword" type="password" autocomplete="new-password" />
      </a-form-item>
      <a-form-item>
        <a-button class="filter-item" type="primary" @click="save">
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>

import { ref, reactive, getCurrentInstance, nextTick } from 'vue'
const temp = ref(getTemp())
const { proxy } = getCurrentInstance()

var validatePass2 = (rule, value, callback) => {
  if(temp.value.newPassword){
    if (value === '') {
      return Promise.reject(new Error('请再次输入密码'));
    } else if (value !== temp.value.newPassword) {
      return Promise.reject(new Error('两次输入密码不一致!'));
    } else {
      return Promise.resolve();
    }
  }else{
    return Promise.resolve();
  }
}
const rules = reactive({
  password: [{ required: true, message: '请输入原密码', trigger: 'blur' }, { min: 6, message: '密码不少于6位' }],
  phone: [{ min: 11, message: '请输入11位手机号', trigger: 'blur' }],
  newPassword: [{ min: 6, message: '密码不少于6位' }],
  confirmPassword: [{  validator: validatePass2,min: 6, message: '密码不少于6位' }],
})
const dataForm = ref()

function getTemp() {
  return {
    id: '',
    name: '',
    password: '',
    phone: '',
    headPortrait: '',
    newPassword: '',
    confirmPassword: ''
  }
}

function resetTemp() {
  temp.value = getTemp()
  nextTick(() => {
    dataForm.value.clearValidate()
  })
}

function save() {
  dataForm.value.validate().then((valid) => {
    if (valid) {
      proxy.$post('/system/user/center/update', temp.value).then(() => {
        proxy.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
        })
      })
    }
  })
}

proxy.$common.objAssign(temp.value, proxy.$global.user.info, ['password'])
</script>
