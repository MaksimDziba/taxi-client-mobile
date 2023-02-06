<template>
  <a-layout class="page-registration">
    <div class="steps-content">
      <component
        :is="steps[current].content"
        :title="steps[current].title"
        @change-step="current = $event"
      />
    </div>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import CreateDriver from "../components/registration/CreateDriver.vue";
import CreateVehicle from "../components/registration/CreateVehicle.vue";

export default defineComponent({
  name: "Registration",
  components: {
    CreateDriver,
    CreateVehicle,
  },
  setup() {
    {
      const current = ref<number>(0);

      return {
        current,
        steps: [
          {
            title: "Данные о водителе",
            content: CreateDriver,
          },
          {
            title: "Данные ТС",
            content: CreateVehicle,
          },
        ],
      };
    }
  },
});
</script>

<style scoped>
.error-infos :deep(.ant-form-explain) {
  white-space: pre-line;
}
</style>
