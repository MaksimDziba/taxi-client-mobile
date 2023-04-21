<template>
  <div class="modal">
    <div class="modal__content">
      <a-button danger @click="handleLogout"> выйти из приложения </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ProfileModal',
  props: {
    data: Object,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const handleLogout = async () => {
      store.dispatch('base/logout');
      store.dispatch('modal/setClose');

      router.push({ path: '/auth' });
    };

    return {
      handleLogout,
    };
  },
});
</script>
