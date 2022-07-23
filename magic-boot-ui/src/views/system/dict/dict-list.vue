<template>
  <div class="app-container">

    <mb-search :where="tableOptions.where" @search="reloadTable" />

    <a-row class="toolbar-container">
      <a-button v-permission="'dict:save'" class="filter-item" type="primary"  @click="handleCreate">
        <template #icon><ElIconPlusOutlined /></template>
        添加
      </a-button>
    </a-row>

    <mb-table ref="table" v-bind="tableOptions" />

    <mb-dialog ref="dictDialog" :title="dialogTitle" width="640px" @confirm-click="save($event)">
      <template #content>
        <a-form ref="dataForm" layout="inline" :rules="rules" :model="temp" label-position="right" label-width="80px">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="字典类型" name="dictType">
                <mb-select v-model:value="temp.dictType" type="dict_type" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="类型" name="type">
                <a-input v-model:value="temp.type" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="描述" name="descRibe">
                <a-input v-model:value="temp.descRibe" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="备注" name="remarks">
                <a-input v-model:value="temp.remarks" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
    </mb-dialog>

    <mb-dialog ref="dictItemsDialog" title="字典项" width="1400px" :show-footer="false">
      <template #content>
        <dict-items :key="Math.random()" v-model:dict-id="dictId" />
      </template>
    </mb-dialog>

  </div>
</template>

<script setup>
import DictItems from './dict-items'

import { ref, reactive, getCurrentInstance, nextTick } from 'vue'

const { proxy } = getCurrentInstance()

const tableOptions = reactive({
  url: '/system/dict/list',
  page: true,
  where: {
    type: {
      label: '类型'
    },
    dictType: {
      component: 'select',
      label: '字典类型',
      props: {
        'all-option': true,
        type: 'dict_type'
      }
    }
  },
  cols: [
    {
      field: 'type',
      label: '类型'
    },
    {
      field: 'descRibe',
      label: '描述'
    },
    {
      field: 'dictType',
      label: '字典类型',
      width: 200,
      dictType: 'dict_type'
    },
    {
      field: 'createDate',
      label: '创建时间'
    },
    {
      field: 'remarks',
      label: '备注',
      width: 200
    },
    {
      label: '操作',
      type: 'btns',
      width: 220,
      fixed: 'right',
      btns: [
        {
          permission: 'dict:save',
          label: '修改',
          type: 'text',
          icon: 'ElIconEditOutlined',
          click: (row) => {
            handleUpdate(row)
          }
        },
        {
          permission: 'dict:delete',
          label: '删除',
          type: 'text',
          icon: 'ElIconDeleteOutlined',
          click: (row) => {
            proxy.$common.handleDelete({
              url: '/system/dict/delete',
              id: row.id,
              done: () => {
                reloadTable()
                proxy.$common.getDictData()
              }
            })
          }
        },
        {
          permission: 'dict:items:view',
          label: '字典项',
          type: 'text',
          icon: 'ElIconList',
          click: (row) => {
            dictItemsDialog.value.show()
            dictId.value = row.id
          }
        }
      ]
    }
  ]
})

const dictId = ref('')
const temp = ref(getTemp())
const dialogTitle = ref('')
const rules = reactive({
  dictType: [{ required: true, message: '请输入标签', trigger: 'blur' }],
  type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
  descRibe: [{ required: true, message: '请输入描述', trigger: 'blur' }]
})
const table = ref()
const dictDialog = ref()
const dataForm = ref()
const dictItemsDialog = ref()

function getTemp() {
  return {
    id: '',
    dictType: '',
    type: '',
    descRibe: '',
    remarks: ''
  }
}

function reloadTable() {
  table.value.reload()
}

function handleCreate() {
  temp.value = getTemp()
  dialogTitle.value = '添加'
  dictDialog.value.show()
  nextTick(() => {
    dataForm.value.clearValidate()
  })
}

function save(d) {
  dataForm.value.validate().then((valid) => {
    if (valid) {
      d.loading()
      proxy.$post('/system/dict/save', temp.value).then((response) => {
        d.hideLoading()
        temp.value.id = response.data
        dictDialog.value.hide()
        proxy.$notify({
          title: '成功',
          message: dialogTitle.value + '成功',
          type: 'success'
        })
        reloadTable()
        proxy.$common.getDictData()
      }).catch(() => d.hideLoading())
    }
  })
}

function handleUpdate(row) {
  proxy.$common.objAssign(temp.value, row)
  dialogTitle.value = '修改'
  dictDialog.value.show()
  nextTick(() => {
    dataForm.value.clearValidate()
  })
}

</script>
