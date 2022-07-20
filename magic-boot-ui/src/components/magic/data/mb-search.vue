<template>
  <div class="filteron-ctainer">
    <a-form layout="inline" @keyup.enter="search" >
      <span v-for="(it, i) in where"  v-bind:key="'key:' + i">
        <a-form-item v-if="it && it.label" :label="it.label" :key="i" >
          <component
              :is="!it.component ? 'mb-input' : it.component.startsWith('a-') || $global.dynamicComponentNames.indexOf(it.component) != -1 ? it.component : 'mb-' + it.component"
              v-model:value="it.value"
              :item-label="it.label"
              v-bind="it.props"
          />
        </a-form-item>
      </span>
      <a-form-item>
        <a-button class="filter-item" type="primary"  @click="search">
          <template #icon><ElIconSearchOutlined /></template>
          搜索
        </a-button>
        <a-button class="filter-item"  @click="reset">
          <template #icon><ElIconDeleteOutlined /></template>
          清空
        </a-button>
        <slot name="btns" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>

import { nextTick } from 'vue'

const props = defineProps({
  where: {
    type: Object,
    default: () => {}
  },
  notReset: {
    type: String,
    default: ''
  }
})

for(var key in props.where){
  if(props.where[key] instanceof Object && props.where[key].value == undefined){
    props.where[key].value = null
  }
}

const emit = defineEmits(['search'])

function input(input){
  if(input){
    emit('search')
  }
}

function search(){
  for(var key in props.where){
    if(props.where[key] instanceof Object){
      if(props.where[key].type && props.where[key].type.startsWith('date') && props.where[key].value instanceof Array && props.where[key].value.join(',')){
        props.where[key].value = props.where[key].value.join(',')
      }
    }
  }
  nextTick(() => {
    emit('search')
    for(var key in props.where){
      if(props.where[key] instanceof Object){
        if(props.where[key].type && props.where[key].type.startsWith('date') && props.where[key].value){
          props.where[key].value = props.where[key].value.split(',')
        }
      }
    }
  })
}

function reset() {
  for(var key in props.where){
    if(props.notReset.indexOf(key) == -1){
      if(props.where[key] instanceof Object){
        if(props.where[key].value instanceof Array){
          props.where[key].value = []
        }else{
          props.where[key].value = null
        }
      }else{
        if(props.where[key] instanceof Array){
          props.where[key] = []
        }else{
          props.where[key] = null
        }
      }
    }
  }
  nextTick(() => emit('search'))
}

</script>

<style scoped>

</style>
