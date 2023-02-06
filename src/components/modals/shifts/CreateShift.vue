<template>
  <div class="modal">
    <div class="modal__content">
      <a-form
        ref="formRef"
        layout="vertical"
        :model="formData"
        validateOnRuleChange
      >
        <a-form-item
          label="Выбрать ТС"
          name="status"
          :rules="[{ required: true, message: 'Обязательное поле!' }]"
        >
          <a-select
            placeholder="Заполнить поле"
            v-model:value="vehicleID"
            :options="vehiclesOptions"
          />
        </a-form-item>

        <a-form-item
          label="Статус"
          name="status"
          :rules="[{ required: true, message: 'Обязательное поле!' }]"
        >
          <a-select
            placeholder="Заполнить поле"
            v-model:value="formData.status"
            :options="statusOptions"
          />
        </a-form-item>

        <a-form-item label="Марка автомобиля" name="carModel">
          <a-input
            placeholder="Укажите ТС"
            disabled
            v-model:value="formData.carModel"
          />
        </a-form-item>

        <a-form-item label="Цвет автомобиля" name="carColor">
          <a-input
            placeholder="Укажите ТС"
            disabled
            v-model:value="formData.carColor"
          />
        </a-form-item>

        <a-form-item label="Гос номер ТС" name="carNumber">
          <a-input
            placeholder="Укажите ТС"
            disabled
            v-model:value="formData.carNumber"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw, watch } from "vue";
import { useStore } from "vuex";
import { FormInstance } from "ant-design-vue";

import ShiftService from "../../../api/shifts";
import { notification } from "../../../service/notification";

import { IVehicle } from "../../../interface/Vehicle";

const statusOptions = [
  { label: "Работаю", value: "working" },
  { label: "Завершена", value: "finished" },
];


export default defineComponent({
  name: "CreateShift",
  setup() {
    const store = useStore();
    const driver = store.state["base"].driver;

    const formRef = ref<FormInstance>();
    const validForm = ref<boolean>(true);
    const vehicleID = ref<number | null>(null);

    const vehiclesOptions = driver.vehicles.map((item: IVehicle) => ({
      label: `${item.carModel} - ${item.gosNumber}`,
      value: item.id,
    }));

    watch(vehicleID, (id) => {
      if (id) {
        const vehicle = driver.vehicles.find(
          (vehicle: IVehicle) => vehicle.id === id
        );

        formData.carNumber = vehicle.gosNumber;
        formData.carModel = vehicle.carModel;
        formData.carColor = vehicle.carColor;
      } else {
        formData.carNumber = "";
        formData.carModel = "";
        formData.carColor = "";
      }
    });

    const formData = reactive({
      status: "working",
      carNumber: "",
      carModel: "",
      carColor: "",
      driverID: driver.id,
    });

    const onSubmit = async () => {
      try {
        if (formRef.value) {
          const isValidForm = await formRef.value.validate();

          if (isValidForm) {
            const shift = await ShiftService.createShift(formData);

            if (shift) {
              formRef.value.resetFields();
            }
          }
        }
      } finally {
        store.dispatch("base/setUpdateData");
        store.dispatch("modal/setClose");
      }
    };

    const resetForm = () => {
      if (formRef.value) {
        formRef.value.resetFields();
      }
    };

    const handleValidate = (_: string, valid: boolean) => {
      validForm.value = !valid;
    };

    return {
      formRef,
      formData,
      statusOptions,
      vehiclesOptions,
      vehicleID,
      handleValidate,
      onSubmit,
      resetForm,
      validForm,
    };
  },
});
</script>
