<template>


  <mb-table ref="table" v-bind="tableOptions"  />
</template>

<script setup>
import MbTable from '../../../components/magic/data/mb-table.vue'
import { ref,reactive, onMounted, getCurrentInstance, nextTick, watch } from 'vue';
const tableOptions = reactive({
  props: {
    'tree-props': { children: 'children', hasChildren: 'hasChildren' },
    'row-key': 'id'
  },
  emptyText:'暂无数据测试文本',
  showNo: false,
  page: false,
  cols: [
    {
      field: 'name',
      label: '菜单名称',
      align: 'left',
      type: 'html'
    },
    {
      field: 'url',
      label: '路径',
      align: 'left',
      type: 'html'
    },
    {
      field: 'permission',
      label: '权限标识',
      width: 150,
      align: 'left',
      type: 'html'
    },
    {
      field: 'icon',
      label: '图标',
      width: 55,
      align: 'center',
      templet: (row) => {
        return generateIconCode(row.icon)
      }
    },
    {
      field: 'sort',
      label: '排序',
      width: 60
    },
    {
      label: '排序',
      type: 'btns',
      width: 150,
      btns: [
        {
          label: '上移',
          type: 'text',
          icon: 'ElIconArrowUpOutlined',
          click: (row) => {
            proxy.$get('/system/menu/sort/up',{
              id: row.id,
              pid: row.pid,
              sort: row.sort
            }).then(() => {
              reloadTable()
            })
          }
        },
        {
          label: '下移',
          type: 'text',
          icon: 'ElIconArrowDownOutlined',
          click: (row) => {
            proxy.$get('/system/menu/sort/down',{
              id: row.id,
              pid: row.pid,
              sort: row.sort
            }).then(() => {
              reloadTable()
            })
          }
        }
      ]
    },
    {
      field: 'isShow',
      label: '是否显示',
      type: 'switch',
      width: 100,
      change: (row) => {
        proxy.$get('/system/menu/change', {
          id: row.id,
          isShow: row.isShow
        })
      }
    },
    {
      field: 'keepAlive',
      label: '是否缓存',
      type: 'switch',
      width: 100,
      change: (row) => {
        proxy.$get('/system/menu/change', {
          id: row.id,
          keepAlive: row.keepAlive
        })
      }
    },
    {
      label: '操作',
      type: 'btns',
      width: 260,
      fixed: 'right',
      align: 'left',
      btns: [
        {
          label: '添加下级菜单',
          type: 'link',
          permission: 'menu:save',
          icon: 'ElIconPlusOutlined',
          click: (row) => {
            addSubMenu(row.id)
          }
        },
        {
          label: '修改',
          type: 'link',
          permission: 'menu:save',
          icon: 'ElIconEditOutlined',
          click: (row) => {
            handleUpdate(row)
          }
        },
        {
          label: '删除',
          type: 'link',
          permission: 'menu:delete',
          icon: 'ElIconCloseOutlined',
          click: (row) => {
            proxy.$common.handleDelete({
              url: '/system/menu/delete',
              id: row.id,
              done: () => reloadTable()
            })
          }
        }
      ]
    }
  ]
})
const menuData = [];
const { proxy } = getCurrentInstance()

function reloadTable(){
  proxy.$get('/system/menu/tree').then(res => {
    menuData.value = res.data.list
    // menuData.value = []
    tableOptions.data = menuData.value
    console.log('menuData:{}',menuData);
  })
}


function handleUpdate(row) {
  console.log('row::{}::::{}',row,menuData);
}
function generateIconCode(symbol) {
  return `<svg style="width: 20px;height: 20px;fill: #999" aria-hidden="true" class="svg-icon disabled"><use href="#icon-${symbol}"></use></svg>`
}
reloadTable();

</script>

<style>

</style>