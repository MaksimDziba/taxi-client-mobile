<template>
  <a-select
    style="width: 100%"
    placeholder="Выберите тариф"
    :options="tariffs"
    v-model:value="value"
  ></a-select>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';

import type { SelectProps } from 'ant-design-vue';

import TariffsService from '../../api/tariffs';

export default defineComponent({
  name: 'SearchTariffs',
  props: {
    modelValue: Number,
  },
  setup(props, { emit }) {
    const tariffs = ref<SelectProps['options']>([]);

    const value = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    onMounted(() => {
      getTariffs();
    });

    const getTariffs = async () => {
      const response = await TariffsService.getAll({
        search: '',
      });

      tariffs.value = response.map((item) => ({
        value: item.id,
        label: item.type,
      }));
    };

    return {
      value,
      tariffs,
    };
  },
});
</script>
``
