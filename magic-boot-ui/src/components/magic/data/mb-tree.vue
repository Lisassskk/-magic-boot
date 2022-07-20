<template>
  <div>
    <div style="margin-bottom: 5px;" v-if="expand || checked">
      <a-button v-if="expand" type="primary" plain @click="doExpand">
        <template #icon><ElIconVerticalAlignMiddleOutlined /></template>
        展开/折叠
      </a-button>
      <a-button v-if="checked" type="primary" icon="ElIconCheck" plain @click="() => { treeAllChecked = !treeAllChecked; checkedAll(treeData, treeAllChecked) }">全选/全不选</a-button>
    </div>
    <div style="margin-bottom: 5px;" v-if="search">
      <a-input v-model:value="searchValue" placeholder="输入关键字进行过滤" @input="tree.filter(searchValue)" :style="{ width: searchWidth }" />
    </div>
    <a-tree
      v-if="refreshTree"
      ref="tree"
      :tree-data="treeData"
      v-bind="props.props"
      node-key="id"
      :default-expand-all="defaultExpandAll"
      @check-change="checkChange"
      @node-click="nodeClick"
      :props="defaultProps"
      :filter-node-method="searchTree"
      :style="style"
      :fieldNames = "{children:'children', title:'name', key:'key' }"
    />
  </div>
</template>

<script setup>

import { watch, ref, reactive, nextTick, getCurrentInstance, onBeforeMount } from 'vue'

const { proxy } = getCurrentInstance()

const emit = defineEmits(['update:modelValue', 'check-change', 'node-click'])

const props = defineProps({
  url: {
    type: String,
    default: ''
  },
  params: {
    type: Object,
    default: () => {}
  },
  modelValue: {
    type: String,
    default: ''
  },
  style: {
    type: Object,
    default: () => {}
  },
  props: {
    type: Object,
    default: () => {}
  },
  expand: {
    type: Boolean,
    default: true
  },
  checked: {
    type: Boolean,
    default: true
  },
  search: {
    type: Boolean,
    default: false
  },
  searchWidth: {
    type: String,
    default: '230px'
  }
})

const tree = ref()
const treeData = ref([])
const defaultProps = reactive({
  children: 'children',
  label: 'name'
})
const defaultExpandAll = ref(true)
const refreshTree = ref(false)
const treeAllChecked = ref(false)
const searchValue = ref('')

onBeforeMount(async () => {
  await loadTreeData()
})

watch(() => props.modelValue, (value) => {
  nextTick(() => selectIds(value))
})

function selectIds(ids){
  ids = ids.split(',')
  for(var i=0;i<ids.length;i++){
    // tree.value && tree.value.setChecked(ids[i],true,false)
    if(tree.value){
      tree.value.checked = true;
    }
  }
}

function searchTree(value, data) {
  if (!value) return true
  return data.name.includes(value)
}

function doExpand() {
  refreshTree.value = false
  defaultExpandAll.value = !defaultExpandAll.value
  nextTick(() => refreshTree.value = true)
}

async function loadTreeData() {
  if(treeData.value.length == 0){
    await proxy.$get(props.url, props.params).then((res) => {
      treeData.value = res.data.list
      console.log('treeData.value::::{}',treeData.value);
      // treeData.value.forEach(item=>{
      //   item.title = item.name;
      // })
    })
    refreshTree.value = true
    nextTick(() => selectIds(props.modelValue))
  }
}

function getTree() {
  return tree.value
}

function checkChange(node) {
  var selectMenus = []
  var checkedNodes = tree.value.getCheckedNodes(false, true)
  for (var i = 0; i < checkedNodes.length; i++) {
    selectMenus.push(checkedNodes[i].id)
  }
  emit('update:modelValue', selectMenus.join(','))
  emit('check-change', selectMenus.join(','))
}

function nodeClick(param1, param2, param3){
  emit('node-click', param1, param2, param3)
}

function checkedAll(children, checked) {
  if (tree.value) {
    for (var i in children) {
      var id = children[i].id
      if(children[i].children && children[i].children.length > 0){
        checkedAll(children[i].children, checked)
      }
      // tree.value.setChecked(id, checked, true)
      tree.value.checked = checked;
    }
  }
}

defineExpose({ getTree })

</script>

