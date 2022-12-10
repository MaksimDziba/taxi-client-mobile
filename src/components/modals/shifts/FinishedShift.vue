<template>
  <div class="modal">
    <div class="modal__content">Уверены, что хотите закончить смену?</div>
    <div class="modal__footer">
      <a-button type="primary" size="middle" @click="finishedShift"
        >Да</a-button
      >

      <a-button type="secondary" size="middle" @click="cancel"
        >Нет</a-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw, watch } from "vue";
import { useStore } from "vuex";

import ShiftsService from "../../../api/shifts";

import { notification } from "../../../service/notification";

export default defineComponent({
  name: "FinishedShift",
  setup() {
    const store = useStore();

    const finishedShift = async () => {
      try {
        await ShiftsService.finishedShift();
      } catch (error) {
        console.log("При завершении смены произошла ошибка", error);

        notification("error", "При завершении смены произошла ошибка");
      } finally {
        store.dispatch("base/setUpdateData");
        store.dispatch("modal/setClose");
      }
    };

    const cancel = () => {
      store.dispatch("modal/setClose");
    };

    return { finishedShift, cancel };
  },
});
</script>
