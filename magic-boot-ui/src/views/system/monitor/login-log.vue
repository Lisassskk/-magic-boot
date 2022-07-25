<template>
  <div class="app-container">
    <mb-search :where="tableOptions.where" @search="reloadTable" />
    <mb-table ref="table" v-bind="tableOptions" />
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  const table = ref()
  const tableOptions = reactive({
    url: '/system/log/login/list',
    where: {
      createDate: {
        component: 'date',
        label: '创建时间',
        props: {
          type: 'datetimerange',
          format: 'YYYY-MM-DD HH:mm:ss'
        }
      }
    },
    cols: [
      {
        field: 'username',
        label: '登录名',
        width: '10%'
      },
      {
        field: 'failPassword',
        label: '失败密码',
        width: '10%',
        ellipsis: true
      },
      {
        field: 'type',
        label: '登录状态',
        width: '10%',
        customRender: ({text, record, index, column}) => {
          return record.type == '成功' ? '<b style="color: #409EFF">成功</b>' : '<b style="color: red">失败</b>'
        }
      },
      {
        field: 'address',
        label: '登录地址',
        width: '10%'
      },
      {
        field: 'ip',
        label: 'ip',
        width: '10%'
      },
      {
        field: 'browser',
        label: '浏览器',
        width: '10%'
      },
      {
        field: 'os',
        label: '系统',
        width: '20%',
        props: {
          "show-overflow-tooltip": true
        }
      },
      {
        field: 'createDate',
        label: '操作时间',
        width: '20%'
      }
    ]
  })
  function reloadTable(){
    table.value.reload()
  }
</script>
