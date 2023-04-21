<template>
  <div class="p-container p-shifts">
    <div class="p-inner">
      <orders-list title="Ожидают выполнения" :orders="ordersPending" />

      <orders-list title="Завершённые" :orders="ordersFinished" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

import ClientService from '../api/clients';

import { dateToMoscow } from '../service/helper.service';
import { IOrder } from '../interface/Order';

import OrdersList from '../components/orders/OrdersList.vue';

interface Order {
  id?: number;
  date: string;
  addressFrom: string;
  addressTo: string;
  tariff: string;
  cost?: number;
}

export default defineComponent({
  name: 'OrdersClient',
  components: {
    OrdersList
  },
  setup() {
    const store = useStore();
    const isUpdateData = computed(() => store.state['base'].updateData);
    const clientID = computed(() => store.state['base'].client.id);

    const ordersPending = ref<Order[] | []>([]);
    const ordersFinished = ref<Order[] | []>([]);

    watch(isUpdateData, () => {
      fetchData();
    });

    onMounted(() => fetchData());

    const fetchData = async () => {
      const groupOrders = await ClientService.getOrders(clientID.value);

      ordersPending.value = createOrder(groupOrders.pending) || [];
      ordersFinished.value = createOrder(groupOrders.finished) || [];
    };

    const createOrder = (orders: IOrder[]) => {
      return orders.map((order) => ({
        id: order.id,
        date: `${dateToMoscow(new Date(order?.updatedAt || ''))}`,
        addressFrom: order.addressFrom,
        addressTo: order.addressTo,
        tariff: order.tariff?.type || '',
        cost: order.preOrderCost,
      }));
    };

    return {
      ordersPending,
      ordersFinished,
    };
  },
});
</script>
