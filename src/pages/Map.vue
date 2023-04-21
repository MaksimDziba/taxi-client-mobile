<template>
  <div>
    <map-component />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import MapComponent from '../components/map/Map.vue';

export default defineComponent({
  name: 'MapPage',
  components: {
    MapComponent,
  },
})
</script>