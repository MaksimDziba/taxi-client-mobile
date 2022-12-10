<template>
  <a-layout class="layout-wrapper">
    <a-layout-header class="layout-header">
      <top-bar />
    </a-layout-header>

    <a-layout-content class="layout-content">
      <router-view />
    </a-layout-content>

    <a-layout-footer class="layout-footer">
      <bottom-navigation />
    </a-layout-footer>
  </a-layout>

  <modals />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import TopBar from "../components/UI/TopBar.vue";
import BottomNavigation from "../components/UI/BottomNavigation.vue";
import Modals from "../components/modals/Modals.vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    TopBar,
    BottomNavigation,
    Modals,
  },
});
</script>
