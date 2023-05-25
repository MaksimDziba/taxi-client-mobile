<template>
  <div
    class="order-client"
    :class="{
      'order-client__open': isShowOrderDialog,
    }"
  >
    <a-button
      class="order-client__btn-open"
      @click="isShowOrderDialog = !isShowOrderDialog"
    >
      <caret-up-outlined />
    </a-button>

    <a-form
      class="order-client__form"
      ref="formRef"
      layout="vertical"
      :model="formData"
      name="basic"
      validateOnRuleChange
      @validate="handleValidate"
    >
      <a-form-item
        label="Местонахождения"
        name="addressFrom"
        :rules="rules.required"
      >
        <search-address
          :modelValue="formData.addressFrom"
          @update:modelValue="formData.addressFrom = $event"
        />
      </a-form-item>

      <a-form-item label="Куда поедет" name="addressTo" :rules="rules.required">
        <search-address
          :modelValue="formData.addressTo"
          @update:modelValue="formData.addressTo = $event"
        />
      </a-form-item>

      <a-divider />

      <div class="tariffs-buttons">
        <div
          v-for="tariff in tariffsCalc"
          :key="tariff.id"
          class="tariffs-buttons__item"
          :class="{
            active: formData.tariffID === tariff.id,
          }"
          @click="formData.tariffID = tariff.id"
        >
          <img
            class="tariffs-buttons__item_img"
            alt="tariff button"
            src="../../../assets/car-icon.png"
          />
          <div class="tariffs-buttons__item_name">{{ tariff.type }}</div>
          <div class="tariffs-buttons__item_cost">{{ tariff.totalCost }} ₽</div>
        </div>
      </div>

      <a-form-item label="Макс. кол-во пассажиров" name="maxCountPassenger">
        <a-input
          v-model:value="formData.maxCountPassenger"
          placeholder="Заполнить поле"
        />
      </a-form-item>

      <a-form-item
        label="Транспортировка животных"
        name="transportationAnimals"
      >
        <a-radio-group v-model:value="formData.transportationAnimals">
          <a-radio :value="true">Да</a-radio>
          <a-radio :value="false">Нет</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="Детское кресло" name="babyChair">
        <a-radio-group v-model:value="formData.babyChair">
          <a-radio :value="true">Да</a-radio>
          <a-radio :value="false">Нет</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="Время подачи" name="timeOrder">
        <a-time-picker
          placeholder="Заполните время"
          :disabledHours="getDisabledHours"
          :disabledMinutes="getDisabledMinutes"
          :showNow="false"
          :minuteStep="5"
          format="HH:mm"
        />
      </a-form-item>

      <div class="order-client__footer">
        <a-button :disabled="disableButton" type="primary" @click="createOrder">
          Создать заказ
        </a-button>

        <a-button
          v-if="isExistsOrderPending"
          type="primary"
          @click="finishedOrder"
        >
          Завершить заказ
        </a-button>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  reactive,
  computed,
  watch,
} from 'vue';
import { useStore } from 'vuex';
import { loadYmap } from 'vue-yandex-maps';

import { yaSettings } from '../../../settings';

import TariffsService from '../../../api/tariffs';
import OrderService from '../../../api/orders';

import { ITariff } from '../../../interface/Tariff';
import { IOrder } from '../../../interface/Order';

import SearchAddress from '../../fields/SearchAddress.vue';
import SearchTariffs from '../../fields/SearchTariffs.vue';

import { CaretUpOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'OrderClient',
  components: {
    SearchAddress,
    SearchTariffs,
    CaretUpOutlined,
  },
  setup(props, { emit }) {
    const store = useStore();
    const client = computed(() => store.state['base'].client);

    const orderPending = client.value.orders.find(
      (order: IOrder) => order.status === 'pending',
    );

    const isExistsOrderPending = !!orderPending?.id;

    const isShowOrderDialog = ref<boolean>(false);
    const validForm = ref<boolean>(true);
    const tariffs = ref<ITariff[] | []>([]);
    const kilometersCount = ref<number>(4);

    const formData = reactive<IOrder>({
      status: 'pending',
      addressFrom: '',
      addressTo: '',
      maxCountPassenger: 1,
      transportationAnimals: false,
      babyChair: false,
      timeOrder: null,
      tariffID: 0,
      clientID: client.value?.id,
      client: {
        id: client.value?.id,
        name: client.value?.name || client.value.phone || '',
        phone: client.value.phone || '',
      },
      ...orderPending,
    });

    const disableButton = computed(() => {
      return (
        !(formData.addressFrom && formData.addressTo) || !!isExistsOrderPending
      );
    });

    onMounted(() => {
      getTariffs();

      if (isExistsOrderPending) {
        emit('update-map', {
          addressFrom: orderPending.addressFrom,
          addressTo: orderPending.addressTo,
        });
      }
    });

    const getTariffs = async () => {
      tariffs.value = await TariffsService.getAll();
    };

    const tariffsCalc = computed(() => {
      return tariffs.value.map((tariff) => {
        const { costPerKilometer, costBabyChair, costTransportingAnimals } =
          tariff;

        let totalCost = costPerKilometer * kilometersCount.value;

        if (formData.babyChair) {
          totalCost += costBabyChair;
        }

        if (formData.transportationAnimals) {
          totalCost += costTransportingAnimals;
        }

        return {
          ...tariff,
          totalCost: Math.floor(totalCost),
        };
      });
    });

    const handleValidate = (_: string, valid: boolean) => {
      validForm.value = !valid;
    };

    const getDisabledHours = () => {
      const hour = new Date().getHours();

      return [...Array(hour)].map((_, idx) => idx);
    };

    const getDisabledMinutes = (selectedHour: number) => {
      const nowTime = new Date();

      if (!selectedHour && selectedHour > nowTime.getHours()) {
        return [];
      }

      return [...Array(nowTime.getMinutes())].map((_, idx) => idx);
    };

    const rules = {
      required: [{ required: true, message: 'Обязательное поле!' }],
    };

    watch(formData, () => {
      if (formData.addressFrom && formData.addressTo) {
        loadingYMap(formData.addressFrom, formData.addressTo);
      }
    });

    const loadingYMap = async (addressFrom: string, addressTo: string) => {
      await loadYmap({ ...yaSettings });

      ymaps.ready(function () {
        const multiRoute = new ymaps.multiRouter.MultiRoute(
          {
            referencePoints: [addressFrom, addressTo],
            params: { results: 2 },
          },
          {
            boundsAutoApply: true,
            activeRouteAutoSelection: true,
          },
        );

        multiRoute.model.events
          .add('requestsuccess', function (event: any) {
            let route = event.get('target').getRoutes()[0];

            if (route) {
              kilometersCount.value = convertDistanceToNumber(
                route.properties.get('distance').text,
              );
            }
          })
          .add('requestfail', function (event: any) {
            alert('Ошибка загрузки маршрута');

            console.log(
              'Ошибка загрузки маршрута: ' + event.get('error').message,
            );
          });
      });
    };

    const convertDistanceToNumber = (distance: string) => {
      return Number(distance.split(' ')[0].replace(',', '.'));
    };

    const createOrder = async () => {
      try {
        const preOrderCost =
          tariffsCalc.value.find((tariff) => formData.tariffID === tariff.id)
            ?.totalCost || 0;

        const order = await OrderService.create({
          ...formData,
          preOrderCost,
        });

        emit('update-map', {
          addressFrom: order.addressFrom,
          addressTo: order.addressTo,
        });
      } finally {
        isShowOrderDialog.value = false;
      }
    };

    const finishedOrder = async () => {
      console.log('here');
    };

    return {
      isShowOrderDialog,
      isExistsOrderPending,
      kilometersCount,
      tariffsCalc,
      formData,
      getDisabledHours,
      getDisabledMinutes,
      rules,
      handleValidate,
      disableButton,
      createOrder,
      finishedOrder,
    };
  },
});
</script>
