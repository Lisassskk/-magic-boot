<template>
  <a-menu
    class="aside-menu"
    mode="inline"
    triggerSubMenuAction="click"
  >
    <sidebar-item v-for="(route,index) in permissionRoutes" v-bind:key="route.path"   :item="route"  />
  </a-menu>
</template>

<script setup>
  import SidebarItem from './sidebar-item.vue'
  import { getCurrentInstance, computed } from 'vue'

  
  const { proxy } = getCurrentInstance()
  const permissionRoutes = proxy.$global.user.permissionRoutes
  const activeMenu = computed(() => {
    const route = proxy.$route
    console.log('*********route:{}',route);
    const { meta, path } = route
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
      return meta.activeMenu
    }
    return path
  })
</script>

<style scoped>
  .aside-menu{
    height: 100%;
  }
  .aside-menu :deep(a){
    text-decoration: none;
  }
</style>