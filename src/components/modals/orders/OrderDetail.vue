<template>
  <div class="modal">
    <div class="modal__content">
      <a-descriptions title="">
        <a-descriptions-item label="Откуда">{{
          data.addressFrom
        }}</a-descriptions-item>

        <a-descriptions-item label="Куда">{{
          data.addressTo
        }}</a-descriptions-item>

        <a-descriptions-item label="Стоимость">{{
          data.preOrderCost
        }}</a-descriptions-item>

        <a-descriptions-item label="Тариф">{{
          data.tariff.type
        }}</a-descriptions-item>

        <a-descriptions-item label="Кол-во пассажиров">{{
          data.maxCountPassenger
        }}</a-descriptions-item>

        <a-descriptions-item v-if="data.babyChair" label="Детское кресло">
          <a-checkbox :value="data.babyChair" :disabled="true" />
        </a-descriptions-item>

        <a-descriptions-item v-if="data.transportationAnimals" label="Животные">
          <a-checkbox :value="data.transportationAnimals" :disabled="true" />
        </a-descriptions-item>

        <a-descriptions-item label="Длительность">
          {{ routeOrder.durationInTraffic }}(без пробок {{ routeOrder.duration }}), {{ routeOrder.distance }}
        </a-descriptions-item>
      </a-descriptions>

      <div id="map" style="width: 320px; height:300px"></div>
    </div>

    <div class="modal__footer">
      <a-button type="primary" size="large" @click="handleTakeOrder">
        Взять заказ
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue';

import { loadYmap } from 'vue-yandex-maps';
import { yaSettings } from '../../../settings';

export default defineComponent({
  name: "OrderDetailModal",
  props: {
    data: Object,
  },
  setup({ data = {} }) {
    const routeOrder = reactive({
      distance: '',
      duration: '',
      durationInTraffic: '',
    });

    const { addressFrom, addressTo, location } = data;

    const { from } = JSON.parse(location);

    onMounted(() => {
      loadingYMap();
    });

    const loadingYMap = async () => {
      await loadYmap({ ...yaSettings });

      ymaps.ready(function () {
        const multiRoute = new ymaps.multiRouter.MultiRoute({
          // Описание опорных точек мультимаршрута.
          referencePoints: [
            addressFrom,
            addressTo
          ],
          // Параметры маршрутизации.
          params: {
            // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
            results: 2,
          }
        }, {
          // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
          boundsAutoApply: true,
          activeRouteAutoSelection: true,
        });

        const zoomControl = new ymaps.control.ZoomControl({
          options: {
            size: 'small',
            float: 'none',
            position: {
              bottom: 145,
              left: 10
            }
          }
        });

        // Создаем карту с добавленными на нее кнопками.
        const myMap = new ymaps.Map('map', {
          center: [from.lat, from.lon],
          zoom: 7,
          controls: []
        });

        // Получить данные маршрута.
        multiRoute.model.events
          .add('requestsuccess', function (event: any) {
            let route = event.get('target').getRoutes()[0];

            if (route) {
              routeOrder.distance = route.properties.get('distance').text;
              routeOrder.duration = route.properties.get('duration').text;
              routeOrder.durationInTraffic = route.properties.get('durationInTraffic').text;
            }
          })
          .add('requestfail', function (event: any) {
            alert("Ошибка загрузки маршрута");

            console.log("Ошибка загрузки маршрута: " + event.get("error").message);
          });

        // Добавляем zoom на карту.
        myMap.controls.add(zoomControl);
        // Добавляем мультимаршрут на карту.
        myMap.geoObjects.add(multiRoute);
      });
    }


    const handleTakeOrder = () => {

    }

    return {
      data,
      yaSettings,
      routeOrder,
      handleTakeOrder,
    };
  },
});
</script>
