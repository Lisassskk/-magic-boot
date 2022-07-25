<template>
  <div class="app-container">

    <div class="filter-container">
      <a-form layout="inline" >
        <a-form-item label="菜单搜索" >
          <a-input v-model:value="searchValue" @input="searchMenu" placeholder="菜单名称、链接、权限标识" style="width: 200px" />
        </a-form-item>
        <a-form-item >
          <a-space>
            <a-button class="filter-item" type="primary"  @click="searchMenu">
              <template #icon><ElIconSearchOutlined /></template>
              搜索
            </a-button>
            <a-button class="filter-item"  @click="() => { searchValue = ''; searchMenu() }">
            <template #icon><ElIconDeleteOutlined /></template>
              清空
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <a-row class="toolbar-container">
      <a-space>
        <a-button class="filter-item" type="primary" @click="addSubMenu('0')" v-permission="'menu:save'">
          <template #icon><ElIconPlusOutlined /></template>
          添加菜单
        </a-button>
        <a-button type="primary"  plain @click="expand">
          <template #icon><ElIconVerticalAlignMiddleOutlined /></template>
        展开/折叠</a-button>
      </a-space>
    </a-row>

    <mb-table ref="table" v-bind="tableOptions" v-if="menuData && menuData.length > 0 && refreshTable" />

    <mb-dialog ref="menuFormDialog" width="970px" :title="dialogTitle" @confirm-click="menuFormRef.save($event)">
      <template #content>
        <menu-form ref="menuFormRef" :title="dialogTitle" :menu-tree="menuTree" :menu-data="menuData" @reload-table="reloadTable" />
      </template>
    </mb-dialog>

  </div>
</template>

<script setup>

import { ref,reactive, onMounted, getCurrentInstance, nextTick, watch } from 'vue'
import MenuForm from './menu-form'

const { proxy } = getCurrentInstance()

const refreshTable = ref(true)
let menuTree = ref([])
const menuData = ref([])
let searchValue = ref('')
const tableOptions = reactive({
  props: {
    'tree-props': { children: 'children', hasChildren: 'hasChildren' },
    'row-key': 'id'
  },
  showNo: false,
  page: false,
  cols: [
    {
      field: 'name',
      label: '菜单名称',
      align: 'left',
      width: '15%',
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
      customRender: (row) => {
          return generateIconCode(row.icon);
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
          icon: 'ElIconUpOutlined',
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
          icon: 'ElIconDownOutlined',
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
          type: 'text',
          permission: 'menu:save',
          icon: 'ElIconPlusOutlined',
          click: (row) => {
            addSubMenu(row.id)
          }
        },
        {
          label: '修改',
          type: 'text',
          permission: 'menu:save',
          icon: 'ElIconFormOutlined',
          click: (row) => {
            handleUpdate(row)
          }
        },
        {
          label: '删除',
          type: 'text',
          permission: 'menu:delete',
          icon: 'ElIconDeleteOutlined',
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
const dialogTitle = ref('')
var searchTimeout = null
const menuFormDialog = ref()
const menuFormRef = ref()

const table = ref();

function reloadTable(){
  proxy.$get('/system/menu/tree').then(res => {
    menuData.value = res.data.list
    tableOptions.data = menuData.value
  })
}

function expand(){
  refreshTable.value = false;
  tableOptions.props["default-expand-allRows"] = !tableOptions.props["default-expand-allRows"];
  nextTick(() => refreshTable.value = true);


  // console.log('table:::{}',menuData.value);
  // table.value.getExpandedRowKeys(menuData.value)
  // nextTick(() => refreshTable.value = true)
}

function searchMenu() {
  refreshTable.value = false
  tableOptions.props["default-expand-all"] = true
  nextTick(() => refreshTable.value = true)
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if(searchValue.value){
      tableOptions.data = proxy.$treeTable.recursionSearch(['name', 'url', 'permission'], proxy.$common.copyNew(menuData.value), searchValue.value)
    }else{
      tableOptions.data = menuData.value
    }
  },500)
}

function addSubMenu(id) {
  // console.log('id::{}::::{}',id,menuData);
  dialogTitle.value = '添加'
  menuFormDialog.value.show()
  nextTick(() => {
    menuFormRef.value.addSubMenu(id)
  })
}

function handleUpdate(row) {
  // console.log('row::{}::::{}',row,menuData);
  dialogTitle.value = '修改'
  menuFormDialog.value.show();
  nextTick(() => {
    // console.log('***************menuFormRef：：：{}',menuFormRef);
    menuFormRef.value.getInfo(row);
    
    
    
  })
}

function generateIconCode(symbol) {
  return `<svg style="width: 20px;height: 20px;fill: #999" aria-hidden="true" class="svg-icon disabled"><use href="${symbol}"></use></svg>`
}

onMounted(() => reloadTable())

watch(menuData, () => {
  menuTree.value = [{
    label: '根节点',
    value: '0',
    children: proxy.$treeTable.genTree(menuData.value)
  }]
})

</script>