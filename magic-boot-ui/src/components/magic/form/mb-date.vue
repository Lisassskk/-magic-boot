<template>

 
  <template v-if="type=='datetimerange'  || type=='daterange'">
      <a-range-picker
        v-model:value="selectValue"
        :type="type"
        :format="format"
        :valueFormat="valueFormat"
        :placeholder="[startPlaceholder, endPlaceholder]"
        v-bind="props.props"
        :showToday="true"
        :showTime="format.toLowerCase().indexOf('hh')>-1"
      />
  </template>
  <template v-else>
      
      <a-date-picker
        v-model:value="selectValue"
        :type="type"
        :format="format"
        :valueFormat="valueFormat"
        :placeholder="placeholder"
        v-bind="props.props"
        :showToday="true"
        :showTime="format.toLowerCase().indexOf('hh')>-1"
      />
  </template>



  <!-- 

 :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"

   -->
</template>

<script setup>
import dayjs from 'dayjs';
  import { watch, ref } from 'vue'
  const emit = defineEmits(['update:modelValue'])
  const selectValue = ref('')
  const props = defineProps({
    modelValue: String,
    type: String,
    placeholder: {
      type: String,
      default: '请选择时间'
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    startPlaceholder: {
      type: String,
      default: '开始时间'
    },
    endPlaceholder: {
      type: String,
      default: '结束时间'
    },
    props: Object
  })
  console.log('***************8',props.format);

  selectValue.value = props.modelValue;
  watch(() => props.modelValue, (value) => {
     if(!(value instanceof Array) && value.indexOf(',')>-1){
        selectValue.value = value.split(',')
     }else{
        selectValue.value = value
     }
    
  })

  const valueFormat = ref(props.format);

  watch(selectValue, (value) => {
    // console.log('::::selectValue:::{}',selectValue,value);
    if(value instanceof Array){
      emit('update:modelValue', value?.join(','))
    }else{
      emit('update:modelValue', value)
    }
  })
</script>
