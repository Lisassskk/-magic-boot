<template>
  <div class="app-container">

    <mb-search :where="tableOptions.where" @search="reloadTable" not-reset="dictId" />

    <a-row class="toolbar-container">
      <a-button v-permission="'dict:items:save'" class="filter-item" type="primary"  @click="handleCreate">
        <template #icon><ElIconPlusOutlined /></template>
        添加
      </a-button>
    </a-row>

    <mb-table ref="table" v-bind="tableOptions" />

    <mb-dialog ref="formDialog" :title="dialogTitle" width="640px" @confirm-click="save($event)">
      <template #content>
        <a-form ref="dataForm" layout="inline" :rules="rules" :model="temp" label-position="right" label-width="80px">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="标签名" name="label">
                <a-input v-model:value="temp.label" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="值" name="value">
                <a-input v-model:value="temp.value" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="排序" name="sort">
                <a-input v-model:value="temp.sort" />
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

  </div>
</template>

<script setup>

import { ref, reactive, getCurrentInstance, nextTick } from 'vue'

const { proxy } = getCurrentInstance()

const props = defineProps({
  dictId: {
    type: String,
    default: ''
  }
})

const tableOptions = reactive({
  url: '/system/dict/items/list',
  page: true,
  where: {
    label: {
      label: '标签'
    },
    value: {
      label: '值'
    },
    dictId: props.dictId
  },
  cols: [
    {
      field: 'label',
      label: '标签'
    },
    {
      field: 'value',
      label: '值'
    },
    {
      field: 'sort',
      label: '排序'
    },
    {
      label: '排序',
      type: 'btns',
      width: 150,
      btns: [
        {
          label: '上移',
          type: 'text',
          icon: 'ElIconUpOutlined',
          click: (row) => {
            proxy.$get('/system/dict/items/sort/up',{
              id: row.id,
              sort: row.sort,
              dictId: props.dictId
            }).then(() => {
              reloadTable()
            })
          }
        },
        {
          label: '下移',
          type: 'text',
          icon: 'ElIconDownOutlined',
          click: (row) => {
            proxy.$get('/system/dict/items/sort/down',{
              id: row.id,
              sort: row.sort,
              dictId: props.dictId
            }).then(() => {
              reloadTable()
            })
          }
        }
      ]
    },
    {
      field: 'remarks',
      label: '备注'
    },
    {
      label: '操作',
      type: 'btns',
      width: 160,
      fixed: 'right',
      btns: [
        {
          permission: 'dict:items:save',
          label: '修改',
          type: 'text',
          icon: 'ElIconEditOutlined',
          click: (row) => {
            handleUpdate(row)
          }
        },
        {
          permission: 'dict:items:delete',
          label: '删除',
          type: 'text',
          icon: 'ElIconDeleteOutlined',
          click: (row) => {
            proxy.$common.handleDelete({
              url: '/system/dict/items/delete',
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
const dialogTitle = ref('')
const rules = reactive({
  value: [{ required: true, message: '请输入值', trigger: 'blur' }],
  label: [{ required: true, message: '请输入标签名', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
})
const temp = ref(getTemp())
const table = ref()
const formDialog = ref()
const dataForm = ref()

function reloadTable() {
  table.value.reload()
}

function getTemp() {
  return {
    id: '',
    value: '',
    label: '',
    dictId: props.dictId,
    sort: 0,
    remarks: ''
  }
}

function getSort() {
  proxy.$get('/system/dict/items/sort', { dictId: props.dictId }).then(res => {
    temp.value.sort = res.data
  })
}

function handleCreate() {
  temp.value = getTemp()
  getSort()
  dialogTitle.value = '添加'
  formDialog.value.show()
  nextTick(() => {
    dataForm.value.clearValidate()
  })
}

function save(d) {
  dataForm.value.validate().then((valid) => {
    if (valid) {
      d.loading()
      proxy.$post('/system/dict/items/save', temp.value).then(() => {
        d.hideLoading()
        formDialog.value.hide()
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
  formDialog.value.show()
  nextTick(() => {
    dataForm.value.clearValidate()
  })
}

</script>
