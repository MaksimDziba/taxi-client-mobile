<template>
  <component v-if="isDataLoaded" :is="layout" />
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import apiClient from "./api/http/axios-client";

import MainLayout from "./layout/MainLayout.vue";
import AuthLayout from "./layout/AuthLayout.vue";

export default defineComponent({
  name: "App",
  components: {
    MainLayout,
    AuthLayout,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const isDataLoaded = ref(false);

    onBeforeMount(async () => {
      const token = await store.dispatch("base/checkAuth");

      if (token) {
        apiClient.defaults.headers.common.Authorization = token;
      }

      isDataLoaded.value = true;
    });

    return {
      layout: computed(() =>
        !!route?.meta?.auth || false ? MainLayout : AuthLayout
      ),
      isDataLoaded,
    };
  },
});
</script>

<style lang="sass">
@import "./assets/style/main.scss"
</style>
