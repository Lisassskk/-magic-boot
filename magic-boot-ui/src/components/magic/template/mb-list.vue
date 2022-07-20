<template>
  <div class="app-container">

    <mb-search v-if="table.where" :where="table.where" :no-reset="search && search.noReset" @search="reload" />

    <a-row class="toolbar-container">
      <div v-for="(it, i) in tools" :key="i">
        <a-button v-if="it.type == 'add'" v-permission="it.permission" class="filter-item" type="primary"  @click="it.click">
          <template #icon><ElIconPlusOutlined /></template>
          {{ it.label || '添加' }}
        </a-button>
        <mb-button v-else-if="it.type == 'delete'" v-permission="it.permission" :plain="true" :request-url="it.url" :btn-type="'delete'" :request-data="{ id: ids }" :after-handler="reload" />
        <a-button v-else  :key="it.label" v-permission="it.permission" :type="it.type" :size="it.size" :class="it.class" @click="it.click(ids)">
          <template #icon>
            <component v-if="it.icon" :is="it.icon" />
          </template>
          {{ it.label }}
        </a-button>
      </div>
    </a-row>

    <mb-table ref="tableRef" v-bind="table" @selection-change="selectionChange" />

  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const tableRef = ref()
  const ids = ref([])

  const props = defineProps({
    search: {
      type: Object,
      default: () => {}
    },
    tools: {
      type: Array,
      default: () => []
    },
    table: {
      type: Object,
      default: () => {}
    }
  })

  props.tools.forEach(it => {
    if(it.type == 'delete'){
      props.table.selection = true
    }
  })

  function reload(){
    tableRef.value.reload()
  }

  function selectionChange(columns) {
    ids.value = columns.map(it => it['id']).join(',')
  }

  defineExpose({ reload })

</script>
