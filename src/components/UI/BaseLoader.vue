<template>
  <div v-if="visible" class="base-loader">
    <img alt="Taxi service logo" src="../../assets/taxi-logo.png" />
    <LoadingOutlined class="base-loader__icon" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

import { LoadingOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  name: "BaseLoader",
  components: {
    LoadingOutlined,
  },
  setup() {
    const store = useStore();
    const baseStore = store.state["base"];

    return {
      visible: computed(() => baseStore.loading),
    };
  },
});
</script>
