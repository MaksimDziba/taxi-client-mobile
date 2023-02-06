<template>
  <div class="p-container p-shifts">
    <div class="p-inner">
      <div class="p-shifts__top"></div>

      <div class="p-shifts__main">Vehicles</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useStore } from "vuex";

export default defineComponent({
  name: "Vehicles",
  setup() {
    const store = useStore();

    const openModal = () =>
      store.commit("modal/SET_MODAL", {
        type: "create-shift",
        show: true,
      });

    return {
      openModal,
    };
  },
});
</script>
