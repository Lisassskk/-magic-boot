<template>
  <mb-icon v-if="icon" :icon="icon" style="margin-right: 5px;"/>
  <span v-if="title" slot="title" style="color:black" >{{ title }}</span>

</template>

<script setup>
  const props = defineProps({
    icon: String,
    title: String
  })
</script>

<style scoped>
.ant-menu .ant-menu-item .is-active svg{
  fill: var(--mb-main-color);
}
</style>