<template>
  <div v-if="!visible" />
  <a-modal
    v-else
    width="100%"
    destroyOnClose
    :visible="visible"
    :title="modal.title"
    :footer="null"
    @cancel="handleClose"
  >
    <component :is="type" />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

import { useStore } from "vuex";

import CreateShift from "./shifts/CreateShift.vue";
import FinishedShift from "./shifts/FinishedShift.vue";

const modals = {
  "create-shift": {
    title: "Взять смену",
    component: "CreateShift",
  },
  "finished-shift": {
    title: "Завершить смену",
    component: "FinishedShift",
  },
};

type modalsType = keyof typeof modals;

export default defineComponent({
  components: {
    CreateShift,
    FinishedShift,
  },
  setup() {
    const store = useStore();
    const modalStore = store.state["modal"];

    if (!Object.keys(modals).includes(modalStore.type)) {
      store.commit("modal/CLOSE_MODAL");
    }

    const modal = computed(() => modals[modalStore.type as modalsType] || {});

    const handleClose = () => {
      store.commit("modal/CLOSE_MODAL");
    };

    return {
      type: computed(() => modalStore.type),
      visible: computed(() => modalStore.show),
      modal,
      handleClose,
    };
  },
});
</script>
