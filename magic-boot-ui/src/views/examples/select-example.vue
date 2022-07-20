<template>
  <div style="padding: 50px;">
    <h2>多选</h2>
    <a-button type="primary" @click="getData" style="margin-bottom: 10px">获取数据</a-button>
    <mb-select v-model:value="dictType" type="dict_type" multiple />
  </div>
</template>

<script>

export default {
  name: 'SelectExample',
  data() {
    return {
      dictType: '0,1'
    }
  },
  methods: {
    getData() {
      console.log(this.dictType)
    }
  }
}
</script>
