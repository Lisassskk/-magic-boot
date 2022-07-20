<template>
  <a-checkbox-group
    v-model:value="selectValue"
    :size="size"
    :disabled="disabled"
    @change="change"
  >
    <!-- <el-checkbox-button v-if="button" v-for="it in checkboxOptions" v-bind="it" :label="it[valueField]">
      {{ it[labelField] }}
      :fill="fill"
    </el-checkbox-button> -->
    <template v-for="it in checkboxOptions">
      <a-checkbox v-if="!button" v-bind:key="it[valueField]"   :value="it[valueField]">
        {{ it[labelField] }}
      </a-checkbox>

      <a-checkbox v-if="button" v-bind:key="it[valueField]"   :value="it[valueField]">
      {{ it[labelField] }}
        <!-- <template #default >
          <a-button>{{ it[labelField] }}</a-button>
        </template> -->
      </a-checkbox>
    </template>
    
  </a-checkbox-group>
</template>

<script setup>
  import {watch, ref, getCurrentInstance, onMounted} from "vue";
  import request from '@/scripts/request'
  const emit = defineEmits(['update:modelValue', 'change'])
  const { proxy } = getCurrentInstance()

  const props = defineProps({
    modelValue: {
      required: true
    },
    type: String,
    button: {
      type: Boolean,
      default: false
    },
    options: Array,
    url: String,
    data: Object,
    method: {
      type: String,
      default: 'get'
    },
    labelField: {
      type: String,
      default: 'label'
    },
    valueField: {
      type: String,
      default: 'value'
    },
    size: String,
    disabled: {
      type: Boolean,
      default: false
    },
    min: Number,
    max: Number,
    textColor: {
      type: String,
      default: '#fff'
    },
    fill: {
      type: String,
      default: '#409EFF'
    },
    join: {
      type: Boolean,
      default: true
    }
  })

  const selectValue = ref([])
  const checkboxOptions = ref([])

  watch(() => [props.type, props.url, props.options], () => {
    loadData()
  }, { deep: true })

  watch(() => props.modelValue, (value) => {
    setValue(value)
  })

  watch(selectValue, (value) => {
    if(props.join){
      emit('update:modelValue', value.join(','))
      emit('change', value.join(','))
    }else{
      emit('update:modelValue', value)
      emit('change', value)
    }
  })

  onMounted(() => {
    loadData()
  })

  function setValue(value){
    if(value){
      if(props.join){
        selectValue.value = value.split(',')
      }else{
        selectValue.value = value
      }
    }
  }

  function loadData(){
    if(props.type){
      checkboxOptions.value = proxy.$common.getDictType(props.type)
      setValue(props.modelValue)
    }else if(props.url){
      if(props.method.toLowerCase() == 'post'){
        proxy.$post(props.url, props.data).then(res => {
          console.log('res.data：：qq：{}',res.data);
          checkboxOptions.value = res.data.list || res.data
          setValue(props.modelValue)
        })
      }else{
        proxy.$get(props.url, props.data).then(res => {
          console.log('res.data：：：{}',res.data);
          checkboxOptions.value = res.data.list || res.data
          setValue(props.modelValue)
        })
      }
    }else if(props.options){
      checkboxOptions.value = props.options
      setValue(props.modelValue)
    }
  }

  function change(value){
    emit('change', value)
  }

</script>
