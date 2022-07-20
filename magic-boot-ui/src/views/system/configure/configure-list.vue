<template>
  <div class="app-container">

    <mb-search :where="tableOptions.where" @search="reloadTable" />

    <a-row class="toolbar-container">
      <a-button v-permission="'configure:save'" class="filter-item" type="primary"  @click="handleCreate">
        <template #icon><ElIconPlusOutlined /></template>
        添加
      </a-button>
    </a-row>

    <mb-table ref="table" v-bind="tableOptions" />

    <mb-dialog ref="roleFormDialog" :title="dialogTitle" width="900px" @confirm-click="save($event)">
      <template #content>
        <a-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="键值" name="configureKey">
                <mb-input v-model="temp.configureKey" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="数据值" name="configureValue">
                <a-input v-model:value="temp.configureValue" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="名称" name="configureName">
                <mb-input v-model="temp.configureName" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="配置类型" name="configureType">
                <mb-select v-model:value="temp.configureType" type="dict_type"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="条件筛选" name="configureCondition">
                <a-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入条件筛选"
                    v-model:value="temp.configureCondition">
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="配置说明" name="configureDescRibe">
                <a-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入配置说明"
                    v-model:value="temp.configureDescRibe">
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item label="备注" name="remarks">
                <a-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入备注"
                    v-model:value="temp.remarks">
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
    </mb-dialog>
  </div>
</template>

<script setup>

import { ref, reactive, nextTick, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const dialogTitle = ref('')
const roleFormDialog = ref()
const tableOptions = reactive({
  url: '/system/configure/list',
  page: true,
  where: {
    configureCondition: {
      label: '查询条件'
    },
    configureKey: {
      label: '配置键值'
    },
    configureValue: {
      label: '配置数据'
    }
  },
  cols: [
    {
      field: 'configureKey',
      label: '配置键值',
      width: '15%'
    },
    {
      field: 'configureValue',
      label: '配置数据',
      width: '10%'
    },
    {
      field: 'configureName',
      label: '配置名称',
      width: '10%'
    },
    {
      field: 'configureType',
      label: '配置类型',
      dictType: 'dict_type',
      width: '10%'
    },
    {
      field: 'configureCondition',
      label: '查询条件',
      width: '10%'
    },
    {
      field: 'configureDescRibe',
      label: '配置说明',
      width: '10%'
    },
    {
      field: 'remarks',
      label: '备注',
      width: '10%'
    },
    {
      field: 'createDate',
      label: '创建时间',
      width: '15%'
    },
    {
      label: '操作',
      type: 'btns',
      width: 220,
      fixed: 'right',
      btns: [
        {
          permission: 'configure:save',
          label: '修改',
          type: 'text',
          icon: 'ElIconEditOutlined',
          click: (row) => {
            handleUpdate(row)
          }
        },
        {
          permission: 'configure:delete',
          label: '删除',
          type: 'text',
          icon: 'ElIconDeleteOutlined',
          click: (row) => {
            proxy.$common.handleDelete({
              url: '/system/configure/delete',
              id: row.id,
              done: () => {
                reloadTable()
                proxy.$common.getDictData()
              }
            })
          }
        }
      ]
    }
  ]
})
const temp = ref(getTemp())
const dialogFormVisible = ref(false)
const dialogStatus = ref('')
const textMap = reactive({
  update: '修改',
  create: '添加'
})
const rules = reactive({
  configureName: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
  configureKey: [{ required: true, message: '请输入配置键值', trigger: 'blur' }],
  configureValue: [{ required: true, message: '请输入配置数据', trigger: 'blur' }],
  configureType: [{ required: true, message: '请选择类型', trigger: 'blur' }]
})
const table = ref()
const dataForm = ref()

function getTemp() {
  return {
    id: '',
    configureCondition:'',
    configureName:'',
    configureKey:'',
    configureValue:'',
    configureType:'',
    configureDescRibe:'',
    remarks:''
  }
}

function reloadTable() {
  table.value.reload()
}

function handleCreate() {
  temp.value = getTemp()
  dialogTitle.value = '添加'
  roleFormDialog.value.show()
  nextTick(() => {
    dataForm.value.clearValidate()
  })
}

function save() {
  dataForm.value.validate().then((valid) => {
    if (valid) {
      proxy.$post('/system/configure/save', temp.value).then((response) => {
        roleFormDialog.value.hide()
        proxy.$notify({
          title: '成功',
          message: (dialogStatus.value === 'create' ? '创建' : '修改') + '成功',
          type: 'success',
          duration: 2000
        })
        reloadTable()
      })
    }
  })
}

function handleUpdate(row) {
  proxy.$common.objAssign(temp.value, row)
  dialogTitle.value = '添加'
  roleFormDialog.value.show()
  nextTick(() => {
    dataForm.value.clearValidate()
  })
}

</script>
