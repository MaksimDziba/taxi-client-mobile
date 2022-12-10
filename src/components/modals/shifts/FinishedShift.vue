<template>
  <div class="modal">
    <div class="modal__content">Уверены, что хотите закончить смену?</div>
    <div class="modal__footer">
      <a-button type="primary" size="middle" @click="onFinishedShift"
        >Да</a-button
      >

      <a-button type="secondary" size="middle" @click="handleClose"
        >Нет</a-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw, watch } from "vue";
import { useStore } from "vuex";

import DriverService from "../../../api/drivers";

import { notification } from "../../../service/notification";

export default defineComponent({
  name: "FinishedShift",
  setup() {
    const store = useStore();

    const onFinishedShift = async () => {
      try {
        await DriverService.finishedShift();
      } catch (error) {
        console.log("При завершении смены произошла ошибка", error);

        notification("error", "При завершении смены произошла ошибка");
      } finally {
        store.dispatch("base/setUpdateData");
        store.dispatch("modal/setClose");
      }
    };

    const handleClose = () => {
      store.dispatch("modal/setClose");
    };

    return { onFinishedShift, handleClose };
  },
});
</script>
