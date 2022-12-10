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

        <a-form-item
          label="Время начала"
          name="startTime"
          :rules="[{ required: true, message: 'Обязательное поле!' }]"
        >
          <a-input
            placeholder="Заполнить поле"
            v-model:value="formData.startTime"
          />
        </a-form-item>

        <a-form-item
          label="Приоритет выдачи заказов"
          name="priority"
          :rules="[{ required: true, message: 'Обязательное поле!' }]"
        >
          <a-select
            placeholder="Заполнить поле"
            v-model:value="formData.priority"
            :options="priorityOptions"
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

        <a-form-item label="Гос номер ТС" name="gosNumber">
          <a-input
            placeholder="Укажите ТС"
            disabled
            v-model:value="formData.gosNumber"
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

import DriverService from "../../../api/drivers";
import { dateToMoscow } from "../../../service/helper.service";
import { notification } from "../../../service/notification";

import { IVehicle } from "../../../interface/Vehicle";

const statusOptions = [
  { label: "Работаю", value: "working" },
  { label: "Завершена", value: "finished" },
];

const priorityOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
];

export default defineComponent({
  name: "CreateShift",
  setup() {
    const store = useStore();
    const driver = store.state["base"].driver;

    const formRef = ref<FormInstance>();
    const validForm = ref<boolean>(true);
    const vehicleID = ref<number | null>(null);

    const nowTime = new Date();
    const time = dateToMoscow(nowTime);

    const vehiclesOptions = driver.vehicles.map((item: IVehicle) => ({
      label: `${item.carModel} - ${item.gosNumber}`,
      value: item.id,
    }));

    watch(vehicleID, (id) => {
      if (id) {
        const vehicle = driver.vehicles.find(
          (vehicle: IVehicle) => vehicle.id === id
        );

        formData.gosNumber = vehicle.gosNumber;
        formData.carModel = vehicle.carModel;
        formData.carColor = vehicle.carColor;
        formData.vehicleID = vehicle.id;
      } else {
        formData.gosNumber = "";
        formData.carModel = "";
        formData.carColor = "";
        formData.vehicleID = null;
      }
    });

    const formData = reactive({
      status: "working",
      startTime: time,
      priority: "",
      gosNumber: "",
      carModel: "",
      carColor: "",
      driverID: driver.id,
      vehicleID: null,
      ordersID: [],
    });

    const onSubmit = async () => {
      try {
        if (formRef.value) {
          const isValidForm = await formRef.value.validate();

          if (isValidForm) {
            const driver = await DriverService.createShift(
              toRaw({ ...formData, startTime: nowTime })
            );

            if (driver) {
              formRef.value.resetFields();
            }
          }
        }
      } catch (error) {
        console.log("При добавлении смены произошла ошибка", error);

        notification("error", "При добавлении смены произошла ошибка");
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
      priorityOptions,
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
