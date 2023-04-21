<template>
  <div>
    <div id="map" style="width: 390px; height: 716px"></div>

    <order-pending v-if="showPending" @accept="showPending = false"/>

    <order-client @update-map="handleUpdateMap" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { loadYmap } from 'vue-yandex-maps';

import { yaSettings } from '../../../settings';
import { IYandexMapType } from '../../../interface/YandexMap';

import OrderClient from './OrderClient.vue';
import OrderPending from './OrderPending.vue';

const coordsClient = [57.000348, 40.973921];

export default defineComponent({
  name: 'MapClient',
  components: {
    OrderClient,
    OrderPending,
  },
  setup() {
    const showPending = ref<boolean>(false);

    onMounted(() => {
      loadingYMap('', '');
    });

    let map: IYandexMapType | null = null;

    const loadingYMap = async (addressFrom: string, addressTo: string) => {
      await loadYmap({ ...yaSettings });

      ymaps.ready(function () {
        const multiRoute = new ymaps.multiRouter.MultiRoute(
          {
            referencePoints: [addressFrom, addressTo],
            params: {
              results: 2,
            },
          },
          {
            boundsAutoApply: true,
            activeRouteAutoSelection: true,
          },
        );

        const zoomControl = new ymaps.control.ZoomControl({
          options: {
            size: 'small',
            float: 'none',
            position: {
              bottom: 145,
              left: 10,
            },
          },
        });

        map = new ymaps.Map('map', {
          center: [coordsClient[0], coordsClient[1]],
          zoom: 12,
          controls: [],
        });

        map!.controls.add(zoomControl);
        map!.geoObjects.add(multiRoute);
      });
    };

    const handleUpdateMap = async (data: {
      addressFrom: string;
      addressTo: string;
    }) => {
      showPending.value = true;

      if (map) {
        // Удаляем предыдущую карту
        map.destroy();

        // Создаем новую карту с обновленными данными маршрута
        await loadingYMap(data.addressFrom, data.addressTo);
      }
    };

    return {
      yaSettings,
      coords: [57.000348, 40.973921],
      showPending,
      handleUpdateMap,
    };
  },
});
</script>
