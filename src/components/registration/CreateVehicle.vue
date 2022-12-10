<template>
  <div class="box__xs box__center">
    <a-typography-title :level="3">{{ title }}</a-typography-title>

    <a-form
      ref="formRef"
      layout="vertical"
      :model="formData"
      validateOnRuleChange
      @validate="handleValidate"
    >
      <a-form-item
        label="Модель"
        name="carModel"
        :rules="[{ required: true, message: 'Обязательное поле!' }]"
      >
        <a-input
          placeholder="Заполнить поле"
          autoComplete="off"
          v-model:value="formData.carModel"
        />
      </a-form-item>

      <a-form-item
        label="Гос. номер"
        name="gosNumber"
        :rules="[{ required: true, message: 'Обязательное поле!' }]"
      >
        <a-input
          placeholder="Заполнить поле"
          v-model:value="formData.gosNumber"
        />
      </a-form-item>

      <a-form-item
        label="Цвет автомобиля"
        name="carColor"
        :rules="[{ required: true, message: 'Обязательное поле!' }]"
      >
        <a-input
          placeholder="Заполнить поле"
          autoComplete="off"
          v-model:value="formData.carColor"
        />
      </a-form-item>

      <a-form-item
        label="Дата производства"
        name="dateManufacture"
        :rules="[{ required: true, message: 'Обязательное поле!' }]"
      >
        <a-input
          placeholder="Заполнить поле"
          v-model:value="formData.dateManufacture"
        />
      </a-form-item>

      <a-form-item
        label="Грузоподъемность"
        name="capacity"
        :rules="[{ required: true, message: 'Обязательное поле!' }]"
      >
        <a-select
          placeholder="Заполнить поле"
          v-model:value="formData.capacity"
          :options="capacityOptions"
        />
      </a-form-item>

      <a-form-item
        label="Детское кресло"
        name="babyChair"
        :rules="[{ required: true, message: 'Обязательное поле!' }]"
      >
        <a-radio-group v-model:value="formData.babyChair">
          <a-radio :value="true">Да</a-radio>
          <a-radio :value="false">Нет</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        label="Макс. кол-во пассажиров"
        name="maxCountPassenger"
        :rules="[{ required: true, message: 'Обязательное поле!' }]"
      >
        <a-input
          v-model:value="formData.maxCountPassenger"
          placeholder="Заполнить поле"
        />
      </a-form-item>

      <a-form-item class="box__footer">
        <a-button type="primary" size="middle" @click.prevent="onSubmit">
          Сохранить
        </a-button>

        <a-button type="secondary" size="middle" @click="resetForm">
          Сбросить
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRaw } from "vue";
import { useRouter } from "vue-router";

import StorageService from "../../service/storage.service.js";
import { notification } from "../../service/notification";

import VehicleService from "../../api/vehicles";

import { IVehicle } from "../../interface/Vehicle";
import { FormInstance } from "ant-design-vue";

const capacity = [
  { label: "Малой грузоподъемности (0,5-2 тонны)", value: "0,5-2 тонны" },
  {
    label: "Средней грузоподъемности (от 2 до 5 тонн)",
    value: "от 2 до 5 тонн",
  },
  { label: "Большой грузоподъемности (5-16 тонн)", value: "5-16 тонн" },
  { label: "Особой большой (от 16 тонн)", value: "от 16 тонн" },
];

export default defineComponent({
  name: "CreateDriver",
  props: {
    title: String,
  },
  setup() {
    {
      const router = useRouter();

      const formRef = ref<FormInstance>();
      const validForm = ref<boolean>(true);

      const capacityOptions = capacity;

      const rules = {
        gosNumber: [{ required: true, message: "Обязательное поле!" }],
        dateManufacture: [{ required: true, message: "Обязательное поле!" }],
        carModel: [{ required: true, message: "Обязательное поле!" }],
        carColor: [{ required: true, message: "Обязательное поле!" }],
        capacity: [{ required: true, message: "Обязательное поле!" }],
        babyChair: [{ required: true, message: "Обязательное поле!" }],
        maxCountPassenger: [{ required: true, message: "Обязательное поле!" }],
        drivers: [{ required: true, message: "Обязательное поле!" }],
      };

      const formData = reactive<IVehicle>({
        gosNumber: "",
        dateManufacture: "",
        carModel: "",
        carColor: "",
        capacity: null,
        babyChair: false,
        maxCountPassenger: null,
        drivers: [],
      });

      onMounted(async () => {
        fetchDriver();
      });

      async function fetchDriver() {
        const { id } = await StorageService.driver.get();

        formData.drivers = [id];
      }

      const onSubmit = async () => {
        try {
          if (formRef.value) {
            const isValidForm = await formRef.value.validate();

            if (isValidForm) {
              const vehicle = await VehicleService.create(toRaw(formData));

              if (vehicle) {
                formRef.value.resetFields();

                router.push({ path: "/shifts" });
              }
            }
          }
        } catch (error) {
          console.log("При создании ТС произошла ошибка", error);

          notification("error", "При создании водителя произошла ошибка");
        }
      };

      const resetForm = () => {
        if (formRef.value) {
          formRef.value.resetFields();
        }
      };

      return {
        capacityOptions,
        rules,
        formRef,
        formData,
        onSubmit,
        resetForm,
        validForm,
      };
    }
  },
});
</script>
