<template>
  <a-tree-select :fieldNames = "{children:'children', title:'name', key:'key' }" v-model:value="selectValue" :tree-data="options" :key="modelValue" :placeholder="placeholder || (itemLabel && '请选择' + itemLabel)" v-bind="props.props" />
</template>

<script setup>
  import { ref, getCurrentInstance, watch } from "vue"
  const emit = defineEmits(['update:modelValue'])
  const selectValue = ref(null)
  const { proxy } = getCurrentInstance()
  const props = defineProps({
    modelValue: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: '',
      required: true
    },
    itemLabel: String,
    placeholder: String,
    props: Object
  })

  selectValue.value = props.modelValue
  watch(() => props.modelValue, (value) => {
    console.log('props.modelValue::',props.modelValue,value);
    selectValue.value = value
  })
  watch(selectValue, (value) => {
    // console.log('selectValue::',selectValue,value);
    emit('update:modelValue', value)
  })

  const options = ref([])

  proxy.$get(props.url).then(res => {
    options.value = res.data.list
    proxy.$treeTable.deleteEmptyChildren(options.value)
  })

</script>
