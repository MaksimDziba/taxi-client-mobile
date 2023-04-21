<template>
  <div v-if="orders.length">
    <div class="p-shifts__top">{{ title }}</div>

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
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue'; 

interface Order {
  id?: number;
  date: string;
  addressFrom: string;
  addressTo: string;
  tariff: string;
  cost?: number;
}

export default defineComponent({
  name: 'OrdersList',
  props: {
    title: {
      type: String,
      required: true,
    },
    orders: {
      type: Array as PropType<Order[]>,
      default: () => ([]),
    },
  },
  setup(props) {
    const { title, orders } = props;

    return {
      title,
      orders, 
    };
  },
});
</script>
