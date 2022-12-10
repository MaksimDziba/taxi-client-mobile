<template>
  <base-loader />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BaseLoader from "../components/UI/BaseLoader.vue";

export default defineComponent({
  name: "AuthLayout",
  components: {
    BaseLoader,
  },
});
</script>
