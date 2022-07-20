<template>
  <a-switch
    :v-if="selectValue"
    v-model:checked="selectValue"
    :checked-value="activeValue"
    :un-checked-value="inactiveValue"
    v-bind="props.props"
  />
  <span>{{selectValue}}</span>
</template>

<script setup>
import {ref, watch} from 'vue'
  const emit = defineEmits(['update:modelValue'])
  const selectValue = ref(0)
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    activeValue: Boolean | String | Number,
    inactiveValue: Boolean | String | Number,
    props: Object
  })

  selectValue.value = props.modelValue
  watch(() => props.modelValue, (value) => {
    selectValue.value = value
  })
  watch(selectValue, (value) => {
    emit('update:modelValue', value)
  })

</script>
