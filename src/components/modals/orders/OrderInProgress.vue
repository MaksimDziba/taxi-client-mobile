<template>
  <div class="modal">
    <div class="modal__content">
      <div id="map" style="width: 342px; height: 500px"></div>

      <div v-if="isOrderComplete">
        Заказ выполнен. Вы приехали в указанное место!

        <a-button type="primary" @click="handleOrderComplete">
          Подтвердить выполнение заказа
        </a-button>
      </div>

      <div v-else class="order-in-progress">
        <div class="order-in-progress__detail">
          {{ routeInfo.duration }}(без пробок
          {{ routeInfo.durationInTraffic }}), {{ routeInfo.distance }}
        </div>

        <div class="order-in-progress__detail">
          <a-progress
            :stroke-color="{
              '0%': '#108ee9',
              '100%': '#87d068',
            }"
            :percent="routeProgress"
          />
        </div>

        <div
          v-if="routeProgress < 100"
          class="order-in-progress__test-button"
        >
          <a-button @click="handleProgressButton"><PlusOutlined /></a-button>
        </div>

        <div v-else class="order-in-progress__test-button">
          <a-button type="primary" @click="handleInviteClient">
            Пригласить клиента
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { loadYmap } from 'vue-yandex-maps';
import { useStore } from 'vuex';
import { PlusOutlined } from '@ant-design/icons-vue';

import { yaSettings } from '../../../settings';

import OrderService from '../../../api/orders';

import { IYandexMapType } from '../../../interface/YandexMap'

type routeState = 'to-start-order' | 'to-end-order';


const initDriverLocation = {
  lat: 40.924641,
  lon: 57.053076,
};

export default defineComponent({
  name: 'OrderInProgressModal',
  components: {
    PlusOutlined,
  },
  props: {
    data: Object,
  },
  setup({ data = {} }) {
    const store = useStore();
    const isOrderComplete = ref<boolean>(false);
    const currentRoute = ref<routeState>('to-start-order');
    const routeCount = ref<number>(0);
    const routeProgress = ref<number>(0);
    const routeInfo = ref({
      distance: '',
      duration: '',
      durationInTraffic: '',
    });

    const { id: orderID, addressFrom, addressTo } = data;

    const mockRouteToStartOrder = [
      {
        from: 'г Иваново, 5-й Коноховский переулок, 4',
        to: addressFrom,
      },
      {
        from: [57.04681629448938, 40.91559421456949],
        to: addressFrom,
      },
      {
        from: [57.041618559386464, 40.906589200500946],
        to: addressFrom,
      },
      {
        from: [57.03900557087106, 40.910088289560925],
        to: addressFrom,
      },
      {
        from: addressFrom,
        to: addressTo,
      },
    ];

    const mockRouteToEndOrder = [
      {
        from: addressFrom,
        to: addressTo,
      },
      {
        from: [57.0274697062882,40.93281060404501],
        to: addressTo,
      },
      {
        from: [57.01900018921245,40.959994737317174],
        to: addressTo,
      },
      {
        from: [57.03900557087106, 40.910088289560925],
        to: addressTo,
      },
      {
        from: addressTo,
        to: addressTo,
      },
    ];

    onMounted(() => {
      loadingYMap();
    });

    let map: IYandexMapType | null = null;

    const loadingYMap = async () => {
      await loadYmap({ ...yaSettings });

      const routeOrder = {
        'to-start-order': mockRouteToStartOrder[routeCount.value],
        'to-end-order': mockRouteToEndOrder[routeCount.value],
      }[currentRoute.value];

      ymaps.ready(function () {
        const multiRoute = new ymaps.multiRouter.MultiRoute(
          {
            // Описание опорных точек мультимаршрута.
            referencePoints: [routeOrder.from, routeOrder.to],
            // Параметры маршрутизации.
            params: {
              // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
              results: 2,
            },
          },
          {
            // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
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

        // Создание карты с кнопками управления
        map = new ymaps.Map('map', {
          center: [initDriverLocation.lat, initDriverLocation.lon],
          zoom: 7,
          controls: [],
        });

        // Получить данные маршрута.
        multiRoute.model.events
          .add('requestsuccess', function (event: any) {
            let route = event.get('target').getRoutes()[0];

            if (route) {
              const newRouteInfo = {
                distance: route.properties.get('distance').text,
                duration: route.properties.get('duration').text,
                durationInTraffic:
                  route.properties.get('durationInTraffic').text,
              };

              routeInfo.value = newRouteInfo;
            }
          })
          .add('requestfail', function (event: any) {
            alert('Ошибка загрузки маршрута');

            console.log(
              'Ошибка загрузки маршрута: ' + event.get('error').message,
            );
          });

        // Добавляем zoom на карту.
        map!.controls.add(zoomControl);
        // Добавляем мультимаршрут на карту.
        map!.geoObjects.add(multiRoute);
      });
    };

    const handleProgressButton = async () => {
      routeProgress.value += 25;
      routeCount.value += 1;

      if (map) {
        // Удаляем предыдущую карту
        map.destroy();

        // Создаем новую карту с обновленными данными маршрута
        await loadingYMap();
      }

      if (
        currentRoute.value === 'to-end-order' &&
        routeProgress.value === 100
      ) {
        isOrderComplete.value = true;
      }
    };

    const handleInviteClient = () => {
      routeProgress.value = 0;
      routeCount.value = 0;

      currentRoute.value = 'to-end-order';
    };

    const handleOrderComplete = async () => {
      try {
        await OrderService.finishedOrder(orderID);
      } finally {
        store.dispatch('modal/setClose');
        store.dispatch("base/setUpdateData");
      }
    };

    return {
      data,
      routeInfo,
      routeProgress,
      yaSettings,
      isOrderComplete,
      handleProgressButton,
      handleInviteClient,
      handleOrderComplete,
    };
  },
});
</script>
