<script setup lang="ts">
import { computed , onMounted} from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './views/layouts/NavbarView.vue';
import SideBar from './views/layouts/AsideView.vue';

const route = useRoute();

const isAuthenticated = computed(() => route.meta.requireAuth);

onMounted(() => {

})

</script>

<template>
  <div class="nk-app-root">
    <SideBar v-if="!!isAuthenticated"></SideBar>
    <div class="nk-main">
      <div class="nk-wrap" v-if="!!isAuthenticated">
        <Navbar></Navbar>
        <RouterView />
      </div>
    </div>
  </div>

  <RouterView v-if="!isAuthenticated" />
</template>

<style scoped>
.nk-main {
  padding-left: 60px;
}

@media (max-width: 991px) {
  .nk-main {
    padding-left: 0px;
  }
}
</style>
