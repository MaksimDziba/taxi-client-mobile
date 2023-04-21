<template>
  <a-auto-complete
    v-model:value="address"
    style="width: 100%"
    placeholder="Начните вводит адрес"
    allow-clear
    :options="findOptions"
    :filter-option="false"
    :not-found-content="fetching ? undefined : null"
    @search="fetchAddress"
    @select="handleSelect"
  />
</template>
<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from "vue";
import { debounce } from "lodash-es";

import GeoService from "../../api/geo";

export default defineComponent({
  name: "SearchAddress",
  props: {
    modelValue: String,
  },
  setup(props, { emit }) {
    let lastFetchId = 0;

    const address = computed({
      get: () => [props.modelValue],
      set: (value) => emit("update:modelValue", value),
    });

    const state = reactive({
      findOptions: [],
      fetching: false,
    });

    const fetchAddress = debounce(async (value: string) => {
      lastFetchId += 1;

      const fetchId = lastFetchId;

      state.fetching = true;

      const address = await GeoService.fetchAddresses(value);

      // for fetch callback order
      if (fetchId !== lastFetchId) {
        return;
      }

      const data = address.map((item: { value: string}) => ({
        label: item.value,
        value: item.value,
      }));

      state.findOptions = data;
      state.fetching = false;
    }, 1000);

    const handleSelect = (value: string) => {
      emit("update:modelValue", value);
    };

    return {
      address,
      handleSelect,
      fetchAddress,
      ...toRefs(state),
    };
  },
});
</script>
