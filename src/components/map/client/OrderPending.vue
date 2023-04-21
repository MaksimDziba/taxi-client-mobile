<template>
  <div class="order-pending">
    <div v-if="!complete">
      <div>
        <loading-outlined />
      </div>

      Поиск водителя!
    </div>
    <div v-else>
      <div>
        <check-outlined />
      </div>

      <div>Водитель найден! Ожидайте мы вас пригласим!</div>

      <div><a-button @click="accept">Ok</a-button></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';

import { LoadingOutlined, CheckOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'OrderPending',
  components: {
    LoadingOutlined,
    CheckOutlined,
  },
  setup(props, { emit }) {
    const complete = ref<boolean>(false);
    let timer: any;

    onMounted(() => {
      timer = setTimeout(() => {
        complete.value = true;
      }, 3000);
    });

    onUnmounted(() => {
      clearTimeout(timer.value);
    });

    const accept = () => emit('accept');

    return {
      complete,
      accept
    };
  },
});
</script>
