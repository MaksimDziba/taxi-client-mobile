<template>
  <div class="p-container p-shifts">
    <div class="p-inner">
      <div class="p-shifts__top">Заказы</div>

      <a-card v-for="item in orders" :key="item.id" class="card-primary">
        <a-card-meta>
          <template #description>
            <div><span class="font-bold">Дата:</span> {{ item.date }},</div>
            <div>
              <span class="font-bold">Адрес клиента:</span>
              {{ item.addressFrom }},
            </div>
            <div>
              <span class="font-bold">Адрес назначения:</span>
              {{ item.addressTo }}
            </div>
            <div><span class="font-bold">Тариф:</span> {{ item.tariff }}</div>
            <div><span class="font-bold">Стоимость:</span> {{ item.cost }}</div>
          </template>
        </a-card-meta>
      </a-card>
    </div>

    <div v-if="!orders.length" class="p-inner">Заказы не найдены</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

import OrderService from '../api/orders';

import { dateToMoscow } from '../service/helper.service';

interface OrderDriver {
  id?: number;
  date: string;
  addressFrom: string;
  addressTo: string;
  tariff: string;
  cost?: number;
}

export default defineComponent({
  name: 'OrdersDriver',
  setup() {
    const store = useStore();
    const isUpdateData = computed(() => store.state['base'].updateData);

    const orders = ref<OrderDriver[] | []>([]);

    watch(isUpdateData, () => {
      fetchData();
    });

    onMounted(() => fetchData());

    const fetchData = async () => {
      const response = await OrderService.getAll();

      orders.value = response.map((order) => ({
        id: order.id,
        date: `${
          order.updatedAt
            ? dateToMoscow(new Date(order.updatedAt))
            : 'Дата отсутствует'
        }`,
        addressFrom: order.addressFrom,
        addressTo: order.addressTo,
        tariff: order.tariff?.type || '',
        cost: order.preOrderCost,
      }));
    };

    return {
      orders,
    };
  },
});
</script>
