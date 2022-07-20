<template>
  <a-tabs
    :v-model:activeKey="tabValue"
    type="editable-card"
    class="demo-tabs"
    hide-add 
    @tabClick="openTab"
    @edit="removeTab"
    style="height:40px;"
  >
    <a-tab-pane
      v-for="(view, key) in global.visitedViews" 
      :key="key"
      :closable="!(view.path == '/home')"
    >

     <template  #tab>
        <a-dropdown  trigger="contextmenu" placement="bottom" style="height: 40px;border: none;">
           <a style="padding: 0px;color:black;" v-if="$route.path != view.path">
           {{ view.name }}
          </a>
          <a style="padding: 0px;color:#1890ff;" v-else>
            {{ view.name }}
          </a>
          <template #overlay>
            <a-menu >
              <a-menu-item key="1" @click="refresh(view.path)">刷新</a-menu-item>
              <a-menu-item key="2" @click="close('left', view.path)">关闭左侧</a-menu-item>
              <a-menu-item key="3" @click="close('right', view.path)">关闭右侧</a-menu-item>
              <a-menu-item key="4" @click="close('other', view.path)">关闭其他</a-menu-item>
            </a-menu>
          </template>
          
        </a-dropdown>
      </template>
      <!-- <template #tab>
        <a-dropdown trigger="contextmenu">
          <div class="el-tabs__item  is-top is-closable is-focus"  v-if="$route.path != view.path">
           aaa: {{ view.name }}
          </div>
          <div class="el-tabs__item  is-top is-active is-closable is-focus" style="padding: 0px;" v-else>
            {{ view.name }}
          </div>
          <template #dropdown>
            <a-menu>
              <a-menu-item @click="refresh(view.path)">刷新</a-menu-item>
              <a-menu-item @click="close('left', view.path)">关闭左侧</a-menu-item>
              <a-menu-item @click="close('right', view.path)">关闭右侧</a-menu-item>
              <a-menu-item @click="close('other', view.path)">关闭其他</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template> -->

    </a-tab-pane>
  </a-tabs>
</template>

<script setup>
  import { getCurrentInstance, ref, watch } from 'vue'
  import global from '@/scripts/global.js'
  const { proxy } = getCurrentInstance()
  const tabValue = ref(proxy.$route.path)
  watch(global.tabValue, () => {
    tabValue.value = global.tabValue.value
  })
  function openTab(itemIndex){
   
    let item = global.visitedViews[itemIndex];
    proxy.$router.push({
      // path: '/examples/test',
      path:  item.path,
      query: global.visitedViews.filter(it => it.path == item.path)[0].query
    })
  }
  function removeTab(indeKey){
  
    if(global.visitedViews.length == 1){
      global.visitedViews.splice(0, 1)
      proxy.$router.push({
        path: '/home'
      })
    }else{
      global.visitedViews.forEach((it, i) => {
        if(i == indeKey){
          global.visitedViews.splice(i, 1)
          proxy.$router.push({
            path: global.visitedViews[global.visitedViews.length - 1].path,
            query: global.visitedViews[global.visitedViews.length - 1].query
          })
        }
      })
    }
  }
  function refresh(path){
    proxy.$router.replace({
      path: `/redirect${path}`,
      query: global.visitedViews.filter(it => it.path == path)[0].query
    })
  }
  function close(type, path){
    if(type == 'other'){
      for(var i = global.visitedViews.length - 1; i >= 0; i--){
        if(global.visitedViews[i].path != path){
          global.visitedViews.splice(i, 1)
        }
      }
    }else if(type == 'right'){
      for(var i = global.visitedViews.length - 1; i >= 0; i--){
        if(global.visitedViews[i].path != path){
          global.visitedViews.splice(i, 1)
        }else{
          break;
        }
      }
    }else{
      for(var i = 0, len = global.visitedViews.length; i < len; i++){
        if(global.visitedViews[0].path != path){
          global.visitedViews.splice(0, 1)
        }else{
          break;
        }
      }
    }
    proxy.$router.push({
      path: path,
      query: global.visitedViews.filter(it => it.path == path)[0].query
    })
  }

  function show(){
    console.log('show***********');
  }
</script>
