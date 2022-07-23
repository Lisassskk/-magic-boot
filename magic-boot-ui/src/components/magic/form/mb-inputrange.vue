<template>
  <a-input v-model:value="input1" />
  <span>-</span>
  <a-input v-model:value="input2"  />
</template>

<script setup>
import { ref, watch } from 'vue'
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  itemLabel: String
})
const input1 = ref('')
const input2 = ref('')
if(props.modelValue){
  input1.value = props.modelValue.split(',')[0]
  input2.value = props.modelValue.split(',')[1]
}

watch(() => props.modelValue, (value) => {
     if(value && !(value instanceof Array) && value.indexOf(',')>-1){
        input1.value = props.modelValue.split(',')[0]
        input2.value = props.modelValue.split(',')[1]
     }else{
        input1.value = null;
        input2.value = undefined;
     }
  })

watch([input1, input2], () => {
  if(input1.value && input2.value){
    emit('update:modelValue', input1.value + ',' + input2.value);
  }else if(!input1.value && input2.value){
    emit('update:modelValue',  ',' + input2.value);
  }else if(input1.value && !input2.value){
    emit('update:modelValue', input1.value + ',' );
  }
  
})
</script>

<style scoped>
  .ant-input{
    display: inline-block;
    width: 47%;
  }
  span{
    margin: 0px 8px;
  }
</style>
