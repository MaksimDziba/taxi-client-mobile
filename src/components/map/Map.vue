<template>
  <component :is="type" />
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';

import MapClient from './client/MapClient.vue';
import MapDriver from './driver/MapDriver.vue';

export default defineComponent({
  name: 'MapComponent',
  components: {
    MapClient,
    MapDriver,
  },
  setup() {
    const store = useStore();
    const role = computed(() => store.state['base'].user.role || '');
    const type = ref<'MapClient' | 'MapDriver' | ''>('');

    if (role.value === 'client') {
      type.value = 'MapClient';
    } else if (role.value === 'driver') {
      type.value = 'MapDriver';
    }

    return {
      type,
    };
  },
});
</script>
