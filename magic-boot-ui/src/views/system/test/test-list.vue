<template>
  <div class="app-container">
    <div class="filter-container">
      <a-form layout="inline">
        <a-form-item>
          <a-button class="filter-item" type="primary"  @click="handleCreate">
            <template #icon><ElIconPlusOutlined /></template>
            添加
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <mb-table ref="table" v-bind="tableOptions" />

    <a-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible" :close-on-click-modal="false" width="700px">
      <a-form ref="dataForm" layout="inline" :model="temp" label-position="right" label-width="100px" style="margin-left: 20px">
        <a-form-item label="name" name="name">
          <a-input v-model:value="temp.name" />
        </a-form-item>
      </a-form>
      <template #footer>
        <div class="dialog-footer">
          <a-button @click="dialogFormVisible = false">
            关闭
          </a-button>
          <a-button type="primary" @click="save()">
            确认
          </a-button>
        </div>
      </template>
    </a-dialog>

  </div>
</template>

<script setup>

import { ref, reactive, nextTick, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const tableOptions = reactive({
  url: '/system/test/list',
  page: true,
  cols: [
    {
      field: 'name',
      label: 'name'
    },
  ]
})
const temp = ref(getTemp())
const dialogFormVisible = ref(false)
const dialogStatus = ref('')
const textMap = reactive({
  update: '修改',
  create: '添加'
})
const table = ref()
const dataForm = ref()

function getTemp() {
  return {
    name: ''
  }
}

function reloadTable() {
  table.value.reload()
}

function handleCreate() {
  temp.value = getTemp()
  dialogStatus.value = 'create'
  dialogFormVisible.value = true
  nextTick(() => {
    dataForm.value.clearValidate()
  })
}

function save() {
  dataForm.value.validate().then((valid) => {
    if (valid) {
      proxy.$post('/system/test/save', temp.value).then((response) => {
        dialogFormVisible.value = false
        proxy.$notify({
          title: '成功',
          message: (dialogStatus.value === 'create' ? '创建' : '修改') + '成功',
          type: 'success'
        })
        reloadTable()
      })
    }
  })
}

</script>
