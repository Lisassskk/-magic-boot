<template>
  <a-layout class="container">
    <a-layout-header>
      <div class="title">
        {{ $global.title }}
      </div>
      <div class="header-right header-right-col">
        <a-col>
          <a-avatar v-if="$global.user.info.headPortrait" :size="40" fit="contain"
            :src="$global.baseApi + $global.user.info.headPortrait" />
          <a-avatar v-else :size="40" fit="contain">
            {{ $global.user.info.name.substring(0, 1) }}
          </a-avatar>
        </a-col>
        <a-col style="line-height: 40px;">

          <!-- <icon  class="el-icon--right" color="white"> -->
          <!-- <arrow-down /> -->
          <a-dropdown trigger="click">

            <template #overlay>
              <a-menu>
                <router-link to="/user-center">
                  <a-menu-item key="1">个人中心</a-menu-item>
                </router-link>
                <a-menu-item key="2" @click="logout">退出</a-menu-item>
              </a-menu>
            </template>

            <a-button style="background-color: transparent;border: none;color:white">
              {{ $global.user.info.username }}
              <DownOutlined />
            </a-button>
          </a-dropdown>
        </a-col>
      </div>
    </a-layout-header>
    <a-layout class="main-container">
      <a-layout-sider width="var(--mb-sidebar-width)">
        <sidebar />
      </a-layout-sider>
      <a-layout>
        <a-layout-header class="tabs">
          <tabs />
        </a-layout-header>
        <div class="main-box">
          <a-layout-content>
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component v-if="$route.meta.keepAlive" :is="Component" :key="$route.path" />
              </keep-alive>
              <component v-if="!$route.meta.keepAlive" :is="Component" :key="$route.path" />
            </router-view>
          </a-layout-content>
        </div>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { DownOutlined } from '@ant-design/icons-vue';
import Tabs from './tabs.vue'
import Sidebar from './sidebar/sidebar.vue'
import { logout } from '@/scripts/auth'
</script>

<style scoped>
.container {
  height: 100%;
}

.main-container {
  height: calc(100% - var(--mb-header-height));
}

.title {
  font-family: PoetsenOne;
  line-height: 60px;
  font-size: 24px;
  color: white;
  padding-left: 20px;
  box-sizing: border-box;
  float: left;
}

.header-right {
  float: right;
  height: 100%;
}

.header-right .username {
  font-size: 14px;
  color: white;
  margin: 0px 5px;
}

.header-right .ant-avatar {
  height: 100%;
  display: flex;
  align-items: center;
}

.header-right .ant-avatar :deep(.ant-avatar--circle) {
  align-items: center;
}

.header-right-col {
  display: flex;
  margin-top: 10px;
}

.container> .ant-layout-header {
  background: #409EFF;
  padding: 0px;
  height: 60px;
}

.tabs {
  margin-left: -50px;
  height: 40px;
  background-color: rgb(255 255 255);
}

.ant-tabs :deep(.ant-layout-header) {
  margin: 0px;
}


.main-box {
  padding: 10px;
  background-color: #F0F2F5;
  height: 100%;
  overflow: auto;
}

.ant-layout-content {
  border-radius: 10px;
  background-color: white;
  height: 100%;
  overflow: auto;
  position: relative;
  padding: 20px;
}

.ant-tabs-nav-list .ant-tabs-nav-wrap .ant-tabs-tab .tabs .ant-tabs-tab-btn .ant-btn-group .ant-dropdown-button{
  height: 40px !important; 
}
</style>
