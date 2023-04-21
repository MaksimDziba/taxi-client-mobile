<template>
  <div v-if="!visible" />
  <a-modal
    v-else
    width="100%"
    :class="{
      'ant-modal--fullscreen': modal?.fullscreen,
    }"
    destroyOnClose
    :visible="visible"
    :title="modal.title"
    :footer="null"
    @cancel="handleClose"
  >
    <component :is="type" :data="modal.data" />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import { useStore } from 'vuex';

import CreateShift from './shifts/CreateShift.vue';
import FinishedShift from './shifts/FinishedShift.vue';
import OrderDetail from './orders/OrderDetail.vue';
import OrderInProgress from './orders/OrderInProgress.vue';
import Profile from './profile/Profile.vue';

type modal = {
  title: string;
  component: string;
  fullscreen?: boolean;
};

const modals: Record<string, modal> = {
  'create-shift': {
    title: 'Взять смену',
    component: 'CreateShift',
  },
  'finished-shift': {
    title: 'Завершить смену',
    component: 'FinishedShift',
  },
  'order-detail': {
    title: 'Заказ',
    component: 'OrderDetail',
  },
  'order-in-progress': {
    title: 'Выполнение заказа',
    component: 'OrderInProgress',
    fullscreen: true,
  },
  'profile': {
    title: 'Профиль',
    component: 'Profile',
    fullscreen: true,
  },
};

type modalsType = keyof typeof modals;

export default defineComponent({
  components: {
    CreateShift,
    FinishedShift,
    OrderDetail,
    OrderInProgress,
    Profile,
  },
  setup() {
    const store = useStore();
    const modalStore = store.state['modal'];

    const handleClose = () => store.commit('modal/CLOSE_MODAL');

    if (!Object.keys(modals).includes(modalStore.type)) {
      handleClose();
    }

    const modal = computed(() => ({
      ...modals[modalStore.type as modalsType],
      data: modalStore.data || {},
    }));

    return {
      type: computed(() => modalStore.type),
      visible: computed(() => modalStore.show),
      modal,
      handleClose,
    };
  },
});
</script>
