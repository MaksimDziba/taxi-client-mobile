<template>
  <div>OrderClient</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "OrderClient",
  setup() {
    const collapsed = ref<boolean>(false);
    const loading = ref<boolean>(true);

    return {
      collapsed,
      loading,
    };
  },
});
</script>
