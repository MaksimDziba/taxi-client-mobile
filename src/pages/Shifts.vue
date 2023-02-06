<template>
  <div class="p-container p-shifts">
    <div class="p-inner">
      <div class="p-shifts__top">
        <a-button
          v-if="working"
          type="primary"
          shape="round"
          danger
          @click="handleFinishedShift"
        >
          Закончить смену
        </a-button>

        <a-button v-else type="primary" shape="round" @click="openModal">
          Взять смену
        </a-button>
      </div>

      <div class="p-shifts__main">
        <a-typography-title v-if="working" :level="5">
          Активная смена:
        </a-typography-title>

        <a-card v-if="working" class="card-primary">
          <a-card-meta>
            <template #description>
              <div>Модель машины: {{ working.carModel }},</div>

              <div>Гос номер: {{ working.carNumber }},</div>
            </template>
          </a-card-meta>
        </a-card>

        <br />

        <a-typography-title v-if="finished.length" :level="5"
          >Завершённые смены:</a-typography-title
        >

        <a-card v-for="item in finished" :key="item.id" class="card-primary">
          <a-card-meta :title="item.title">
            <template #description>
              <div>Модель машины: {{ item.carModel }},</div>
              <div>Гос номер: {{ item.carNumber }}</div>
            </template>
          </a-card-meta>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

import ShiftService from '../api/shifts';

import { dateToMoscow } from '../service/helper.service';

import { IShift } from '../interface/Shift';

interface Shift {
  id: number;
  title: string;
  carModel: string;
  carNumber: string;
}

export default defineComponent({
  name: 'Shifts',
  setup() {
    const store = useStore();

    const working = ref<IShift | null>(null);
    const finished = ref<Shift[] | []>([]);

    const isUpdateData = computed(() => store.state['base'].updateData);

    const fetchData = async () => {
      const response = await ShiftService.getShifts();

      finished.value = response.finished.map((item: IShift) => ({
        id: item.id,
        title: `${dateToMoscow(new Date(item.endTime))}`,
        carModel: item.carModel,
        carNumber: item.carNumber,
      }));

      working.value = response.working;
    };

    onMounted(() => {
      fetchData();
    });

    watch(isUpdateData, () => {
      fetchData();
    });

    const handleFinishedShift = () => {
      if (working.value?.id) {
        store.commit('modal/SET_MODAL', {
          type: 'finished-shift',
          show: true,
          data: {
            id: working.value.id,
          },
        });
      }
    };

    const openModal = () =>
      store.commit('modal/SET_MODAL', {
        type: 'create-shift',
        show: true,
      });

    return {
      working,
      finished,
      handleFinishedShift,
      openModal,
    };
  },
});
</script>
