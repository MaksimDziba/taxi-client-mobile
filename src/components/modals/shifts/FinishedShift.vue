<template>
  <div class="modal">
    <div class="modal__content">Уверены, что хотите закончить смену?</div>
    <div class="modal__footer">
      <a-button type="primary" size="middle" @click="onFinishedShift">
        Да
      </a-button>

      <a-button type="secondary" size="middle" @click="handleClose">
        Нет
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

import ShiftService from '../../../api/shifts';

export default defineComponent({
  name: 'FinishedShift',
  props: {
    data: Object,
  },
  setup({ data }) {
    const store = useStore();

    const onFinishedShift = async () => {
      if (!data?.id) {
        return;
      }

      try {
        await ShiftService.finishedShift(data.id);
      } finally {
        store.dispatch('base/setUpdateData');
        store.dispatch('modal/setClose');
      }
    };

    const handleClose = () => {
      store.dispatch('modal/setClose');
    };

    return {
      onFinishedShift,
      handleClose,
    };
  },
});
</script>
