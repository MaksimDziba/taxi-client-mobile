<template>
  <yandex-map 
    class="page_map"
    zoom="12"
    :settings="settings" 
    :coords="coords" 
    :center="coords"
  >
    <ymap-marker 
      marker-id="123" 
      :coords="coords"
      :marker-events="['click']"
    />
  </yandex-map>
</template>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
name: "Map",
setup() {
  return {
    coords: [57.000348, 40.973921],
    settings: {
      apiKey: 'a329dd57-1431-4b85-b38b-5a169adeb703',
      lang: 'ru_RU',
      coordorder: 'latlong',
      enterprise: false,
      version: '2.1',
    },
  }
},
});
</script>