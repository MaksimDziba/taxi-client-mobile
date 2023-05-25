<template>
  <yandex-map
    v-if="isLoading"
    class="page-map__content"
    zoom="12"
    :settings="yaSettings"
    :coords="coords"
    :center="coords"
    :cluster-options="clusters"
  >
    <ymap-marker
      v-for="order in mapOrders"
      :key="order.id"
      :marker-id="order.id"
      marker-type="Placemark"
      cluster-name="1"
      :coords="order.location"
      @click="setSelectedOrder(order.id)"
    />
  </yandex-map>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';

import { yaSettings } from '../../../settings';

import OrderService from '../../../api/orders';

import { IOrder } from '../../../interface/Order';

interface IMapProperty {
  [key: string]: {
    iconCaption: string;
    hintContent: string;
  };
}

export default defineComponent({
  name: 'MapDriver',
  setup() {
    const store = useStore();
    
    const isUpdateData = computed(() => store.state['base'].updateData);

    watch(isUpdateData, () => {
      fetchData();
    });

    const orders = ref<IOrder[]>([]);
    const isLoading = ref<Boolean>(false);

    const coordsDriver = [57.000348, 40.973921];

    const fetchData = async () => {
      isLoading.value = false;

      try {
        orders.value = await OrderService.getPending();
      } finally {
        isLoading.value = true;
      }
    };

    onMounted(() => {
      fetchData();
    });

    const mapOrders = computed(() => {
      return orders.value.map((order: IOrder) => {
        const location = JSON.parse(order.location) || {};

        const { from = { lat: null, lon: null } } = location;

        return {
          id: order.id,
          addressFrom: order.addressFrom,
          addressTo: order.addressTo,
          location: [from.lat, from.lon],
          tariff: order.tariff.type,
          cost: order.preOrderCost,
        };
      });
    });

    const properties = computed(() => {
      return orders.value.reduce((acc: IMapProperty, item: IOrder) => {
        const hintContent = `<div>Стоимость: ${item.preOrderCost}</div>`;

        const iconCaption = `
              <div>Старт: ${item.addressFrom}</div>
              <div>Место назначения: ${item.addressTo}</div>
            `;

        acc[`${item.id}`] = {
          iconCaption,
          hintContent,
        };

        return acc;
      }, {});
    });

    const setSelectedOrder = (id: number) => {
      const findOrder = orders.value.find((order) => order.id === id);

      if (findOrder) {
        store.commit('modal/SET_MODAL', {
          type: 'order-detail',
          show: true,
          data: findOrder,
        });
      }
    };

    return {
      isLoading,
      clusters: {
        1: {
          groupByCoordinates: false,
          clusterHideIconOnBalloonOpen: false,
          geoObjectHideIconOnBalloonOpen: false,
          clusterDisableClickZoom: false,
        },
      },
      yaSettings,
      coords: coordsDriver,
      properties,
      mapOrders,
      setSelectedOrder,
    };
  },
});
</script>
