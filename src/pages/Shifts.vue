<template>
  <div class="p-container p-shifts">
    <div class="p-inner">
      <div class="p-shifts__top">
        <a-button
          v-if="hasActiveShift"
          type="primary"
          shape="round"
          danger
          @click="finishedShift"
          >Закончить смену</a-button
        >
        <a-button v-else type="primary" shape="round" @click="openModal"
          >Взять смену</a-button
        >
      </div>

      <div class="p-shifts__main">
        <a-typography-title v-if="hasActiveShift" :level="5"
          >Активная смена:</a-typography-title
        >

        <a-card v-if="working" class="card-primary">
          <a-card-meta>
            <template #description>
              <div>Модель машины: {{ working.carModel }},</div>
              <div>Гос номер: {{ working.gosNumber }},</div>
            </template>
          </a-card-meta>
        </a-card>

        <br />
        <a-typography-title :level="5">Завершённые смены:</a-typography-title>

        <a-card v-for="item in finished" :key="item.id" class="card-primary">
          <a-card-meta :title="item.title">
            <template #description>
              <div>Модель машины: {{ item.carModel }},</div>
              <div>Гос номер: {{ item.gosNumber }}</div>
            </template>
          </a-card-meta>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";

import { useStore } from "vuex";
import ShiftService from "../api/shifts";
import { IShift } from "../interface/Shift";
import { dateToMoscow } from "../service/helper.service";

interface Shift {
  id: number;
  title: string;
  carModel: string;
  gosNumber: string;
}

export default defineComponent({
  name: "Shifts",
  setup() {
    const store = useStore();

    const working = ref<IShift | null>(null);
    const finished = ref<Shift[] | []>([]);

    const hasActiveShift = ref(false);
    const isUpdateData = computed(() => store.state["base"].updateData);

    watch(isUpdateData, () => {
      fetchData();
    });

    onMounted(async () => fetchData());

    const fetchData = async () => {
      const response = await ShiftService.getShifts();

      if (response.finished.length) {
        finished.value = response.finished.map((item: IShift) => ({
          id: item.id,
          title: `${dateToMoscow(new Date(item.endTime))}`,
          carModel: item.carModel,
          gosNumber: item.gosNumber,
        }));
      }

      
      if (response.working?.id) {
        working.value = response.working;

        hasActiveShift.value = true;
      }
    };

    const finishedShift = () =>
      store.commit("modal/SET_MODAL", {
        type: "finished-shift",
        show: true,
      });

    const openModal = () =>
      store.commit("modal/SET_MODAL", {
        type: "create-shift",
        show: true,
      });

    return {
      hasActiveShift,
      working,
      finished,
      finishedShift,
      openModal,
    };
  },
});
</script>
