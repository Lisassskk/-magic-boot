<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <a-pagination
      :background="background"
      v-model:current="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      v-bind="$attrs"
      @change="handleCurrentChange"
       :show-total="total => `共 ${total} 条`"
    />

    <!--  
      :layout="layout"
      :page-sizes="pageSizes"
      handleCurrentChange
      -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { scrollTo } from '@/scripts/scroll-to'

const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50]
    }
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: true
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:page', 'update:limit', 'pagination'])


const currentPage = computed({
  get: () => props.page,
  set: (val) => {
    emit('update:page', val)
  }
})

const pageSize = computed({
  get: () => props.limit,
  set: (val) => {
    emit('update:limit', val)
  }
})

// function handleSizeChange(val) {
//   emit('pagination', { page: currentPage, limit: val })
//   if (props.autoScroll) {
//     scrollTo(0, 800)
//   }
// }

function handleCurrentChange(page, pageSize) {
  emit('pagination', { page: page, limit: pageSize })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
