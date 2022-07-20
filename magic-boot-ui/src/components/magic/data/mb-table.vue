<template>
  <div>
    <!--  v-loading="listLoading" -->
    <a-table
      bordered 
      :key="tableKey"
      :columns="cols"
      :data-source="list"
      fit
      highlight-current-row
      v-bind="props.props"
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="selectionChange"
      :row-selection="rowSelection"
      :locale="{'emptyText':emptyText,'filterConfirm':'确定','filterReset':'重置'}"
      tableLayout="auto"
      :pagination="false"
      v-if="list.length"
     


    >

<!--       :expandedRowKeys="expandedRowKeys"
      @expand="onTableExpand" 
       :default-expand-allRows="true"
      -->
    <!-- <template #expandIcon = "{ column, record, index }">
      <component :is="'ElIconPlusSquareOutlined'" v-if="tableKey==index"
        @click="expand(index)">
      </component>
      <component :is="'ElIconMinusSquareOutlined'" v-if="tableKey!=index" @click="expand('')">
      </component>
    </template> -->

      <!-- <a-table-column v-if="selection" align="center" type="selection" width="50" /> -->

      <!-- <a-table-column v-if="showNo" label="序号" prop="num" align="center" width="65">
        <template #default="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </a-table-column> -->
<!-- 
      <mb-table-column v-for="(col, i) in cols" :key="i" :col="col">
        <template v-for="(value, key) in $slots" #[key]="{ row, index }">
          <slot :row="row" :index="index" :name="key" />
        </template>
      </mb-table-column> -->

        <template #bodyCell="{ column, record,text,index }">
        <!-- <span>{{record[column.field]}}</span> -->
         <template v-if="!column.cols">
          <span v-if="column.dictType">
            {{ $common.getDictLabel(column.dictType, text + '') }}
          </span>
          <span v-else-if="column.templet" :v-html="column.templet(record)" />
          <slot v-else-if="column.type == 'dynamic'" :name="column.field" :row="text" :index="index" />
          <div v-else-if="column.type == 'switch'">
            <a-switch
                v-if="column.if === undefined ? true : column.if(text)"
                v-model:checked="record[column.field]"
                :checkedValue="column.activeValue || 1"
                :unCheckedValue="column.inactiveValue || 0"
                @change="column.change(record,text)"
            />
          </div>
          <div v-else-if="column.type == 'btns'">
            <template v-for="btn in column.btns">
              <a-button  v-if="btn.if === undefined ? true : btn.if(text)" :key="btn.label" v-permission="btn.permission" :type="btn.type" :size="btn.size || 'small'" :class="btn.class" @click="btn.click(record,index)">
                <template #icon>
                  <component v-if="btn.icon" :is="btn.icon" />
                  <!-- <mb-icon v-if="btn.icon" :icon="btn.icon" style="margin-right: 5px;"/> -->
                </template>
                {{ btn.label }}
              </a-button>
            </template>
          </div>
          <a-image
            v-else-if="column.type === 'image'"
            :src="text.startsWith('http') ? text : $global.baseApi + text"
            :preview-src-list="[text.startsWith('http') ? text : $global.baseApi + text]"
          />
          <span v-else-if="column.type === 'html'" v-html="text" ></span>
          <span v-else-if="column.click">
            <a style="color: blue" @click="column.click(record)">{{ text }}</a>
          </span>
          <span v-else-if="column.field">{{ text }}</span>
        </template>
      </template>

      <!-- <template empty>
        <a-empty :description="emptyText"  />
      </template> -->

    </a-table>
    <mb-pagination v-show="total > 0 && page" :total="total || 0" v-model:page="listCurrent" v-model:limit="limit" @pagination="handlerPagination" />
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, getCurrentInstance } from 'vue'
import common from "../../../scripts/common";

const { proxy } = getCurrentInstance()

let expandedRowKeys = ref([]);

const getExpandedRowKeys = (list) => {
    list.forEach((item) => {
      if (item.children && item.children.length) {
        // 将所有children的父节点取出
        expandedRowKeys.value.push(item.id);
        getExpandedRowKeys(item.children);
      }
    });
  };

const onTableExpand = (expanded, record) => {
    if (expanded) {
      expandedRowKeys.value.push(record.id);
    } else {
      expandedRowKeys.value.splice(expandedRowKeys.value.indexOf(record.id), 1);
    }
  };

const props = defineProps({
  props: {
    type: Object,
    default: () => {}
  },
  url: {
    type: String,
    default: ''
  },
  limit: {
    type: Number,
    default: 10
  },
  page: {
    type: Boolean,
    default: true
  },
  done: {
    type: Function,
    default: () => {}
  },
  where: {
    type: Object,
    default: () => {
      return {}
    }
  },
  showNo: {
    type: Boolean,
    default: true
  },
  selection: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array,
    default: null
  },
  method: {
    type: String,
    default: 'post'
  },
  cols: {
    type: Array,
    default: () => []
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  }
})
console.log('*********8props:{}',props);


// 将string的第一个字母转小写，之外的大写字母加-转小写
function nameChanged (string) { 
    let n = string.replace(string[0], string[0].toLowerCase())
     // 将字符串分割成相应的字符串数组
    const stringArray = n.split('')
    // console.log('stringArray=', stringArray)
    let newStr = ''
    stringArray.forEach(t => {
      if (t >= 'A' && t <= 'Z') {
        newStr += '-' + t.toLowerCase()
      } else {
        newStr += t
      }
    })
    return newStr
  }

// 兼容 antd 的属性
if(props.cols && props.cols.length>0){
    for(var col of props.cols){
      console.log('col::{}',col);
      if(col.label){
        col.title = col.label;
      }
      if(col.field){
        col.dataIndex = col.field;
      }
      col.key = col.dataIndex;

      // // 将按钮组中的icon修改为antd写法
      // if(col.btns  && col.btns.length>0){
      //   for(var btn of col.btns){
      //       if(btn.icon){
      //         btn.icon = nameChanged(btn.icon.replaceAll('ElIcon',''));
      //       }
      //   }
      // }
    }
}
const emit = defineEmits(['selection-change'])


const listCurrent = ref(1)
const total = ref(0)
const list = ref([])
const listLoading = ref(false)
let tableKey = ref(0)
let newWhere = reactive({})

// if(props.showNo){
  // for (let i = 0; i < props.data.length; i++) {
    // props.data.push({
    //   showNo: `${i}`,
    // });
  // }
// }

const rowSelection = ref({
  checkStrictly: props.selection,
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
});

function renderWhere(){
  newWhere = reactive(proxy.$common.renderWhere(props.where))
}

function getList() {
  renderWhere()
  listLoading.value = true
  if (props.page) {
    newWhere.current = listCurrent.value
    newWhere.size = props.limit
  } else {
    newWhere.size = 99999999
  }
  var then = (res) => {
    const { data } = res
    total.value = data.total
    list.value = data.list?data.list:[]
    listLoading.value = false
    props.done()
  }
  if(props.method.toLowerCase() == 'post'){
    proxy.$post(props.url, newWhere).then(res => {
      then(res)
    })
  }else{
    proxy.$get(props.url, newWhere).then(res => {
      then(res)
    })
  }
}

function sortChange(column) {
  let order = column.order
  if (order) {
    order = order === 'descending' ? 'desc' : ''
    order = column.prop + ' ' + order
  } else {
    order = null
  }
  newWhere.orderBy = order
  reload()
}

function selectionChange(columns) {
  emit('selection-change', columns)
}

function reload() {
  if (props.url) {
    newWhere.current = 1
    listCurrent.value = 1
    getList()
  }
  if (props.data) {
    handlerData()
  }
}

function renderExportData(sourceData){
  var data = []
  var fields = props.cols.filter(it => it.type != 'btns')
  sourceData.forEach(it => {
    var row = {}
    fields.forEach(f => {
      if(f.exportTemplet){
        row[f.label] = f.exportTemplet(it)
      }else if(f.templet){
        row[f.label] = f.templet(it)
      }else{
        row[f.label] = it[f.field]
      }
    })
    data.push(row)
  })
  return data
}

function exportExcel(){
  if(props.url){
    var where = proxy.$common.renderWhere(props.where)
    where.size = 99999999
    var then = (res) => {
      const { data } = res
      proxy.$common.exportExcel({
        data: renderExportData(data.list),
        fileName: '用户数据'
      })
    }
    if(props.method.toLowerCase() == 'post'){
      proxy.$post(props.url, where).then(res => {
        then(res)
      })
    }else{
      proxy.$get(props.url, where).then(res => {
        then(res)
      })
    }
  }else if(props.data){
    proxy.$common.exportExcel({
      data: props.data,
      fileName: '用户数据'
    })
  }
}

function handlerData() {
  listLoading.value = true
  total.value = props.data.length
  var currPageData = []
  if(props.page){
    props.data.forEach((it, i) => {
      if (i >= ((listCurrent.value - 1) * props.limit) && i < (listCurrent.value * props.limit) && currPageData.length < props.limit) {
        currPageData.push(it)
      }
    })
  }else{
    currPageData = props.data
  }
  list.value = currPageData
  props.done()
  listLoading.value = false
}

function handlerPagination() {
  if (props.url) {
    getList()
  }
  if (props.data) {
    handlerData()
  }
}

function keyup(){
  document.onkeyup = (e) => {
    if(e.target.nodeName != 'INPUT'){
      if (e && e.keyCode == 37) {
        if(listCurrent.value != 1){
          listCurrent.value -= 1
          handlerPagination()
        }
      } else if (e && e.keyCode == 39) {
        if(listCurrent.value != parseInt((total.value + props.limit - 1) / props.limit)){
          listCurrent.value += 1
          handlerPagination()
        }
      }
    }
  }
}

watch(() => props.data, () => {
  listCurrent.value = 1
  handlerData()
},{ deep: true })

watch(() => props.where,() => {
  renderWhere()
},{ deep: true })

renderWhere()

onMounted(() => {
  keyup()
  if (props.data) {
    handlerData()
  }
  if (props.url) {
    getList()
  }
})

defineExpose({ reload, exportExcel,getExpandedRowKeys })

</script>

<style scoped>
  .a-table :deep(.a-image .a-image__inner) {
    max-height: 100px;
    width: auto;
    height: auto;
  }
  .a-table :deep(.a-table__cell){
    z-index: auto;
  }
  .ant-btn{
    color: #409EFF;
    font-size: 12px;
  }
</style>

<style>
  .a-table-column--selection .cell {
    padding:0px 15px!important;
  }
  .a-table th {
    background: #F5F7FA;
  }
</style>
