<template>
  <div class="box__xs box__center">
    <a-typography-title :level="3">{{ title }}</a-typography-title>

    <a-form
      ref="formRef"
      layout="vertical"
      :model="formData"
      :rules="rules"
      validateOnRuleChange
    >
      <a-form-item label="Телефон" name="phone">
        <a-input
          placeholder="Заполнить поле"
          disabled
          v-model:value="formData.phone"
        />
      </a-form-item>

      <a-form-item label="ФИО" name="name">
        <a-input
          placeholder="Заполнить поле"
          autoComplete="off"
          v-model:value="formData.name"
        />
      </a-form-item>

      <a-form-item label="Паспорт" name="passport">
        <a-input
          placeholder="Заполнить поле"
          v-model:value="formData.passport"
        />
      </a-form-item>

      <a-form-item label="Адрес проживания" name="address">
        <a-input
          placeholder="Заполнить поле"
          autoComplete="off"
          v-model:value="formData.address"
        />
      </a-form-item>

      <a-form-item label="Водительское удостоверение" name="driverLicense">
        <a-input
          placeholder="Заполнить поле"
          autoComplete="off"
          v-model:value="formData.driverLicense"
        />
      </a-form-item>

      <a-form-item label="Номер договора" name="contractNumber">
        <a-input
          placeholder="Заполнить поле"
          v-model:value="formData.contractNumber"
        />
      </a-form-item>

      <a-form-item label="Способ оплаты заказа" name="paymentMethod">
        <a-radio-group v-model:value="formData.paymentMethod">
          <a-radio value="phone">телефон</a-radio>
          <a-radio value="terminal">терминал</a-radio>
          <a-radio value="cash">наличными</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        label="Согласие на транспортировку животных"
        name="transportationAnimals"
      >
        <a-radio-group v-model:value="formData.transportationAnimals">
          <a-radio :value="true">Да</a-radio>
          <a-radio :value="false">Нет</a-radio>
        </a-radio-group>
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
import { useStore } from "vuex";
import StorageService from "../../service/storage.service.js";

import DriverService from "../../api/drivers";

import { IDriverCreate } from "../../interface/Driver";
import type { FormInstance } from "ant-design-vue";

import { notification } from "../../service/notification";

export default defineComponent({
  name: "CreateDriver",
  props: {
    title: String,
  },
  setup(props, { emit }) {
    {
      const formRef = ref<FormInstance>();
      const validForm = ref<boolean>(true);

      const rules = {
        name: [{ required: true, message: "Обязательное поле!" }],
        passport: [{ required: true, message: "Обязательное поле!" }],
        address: [{ required: true, message: "Обязательное поле!" }],
        phone: [{ required: true, message: "Обязательное поле!" }],
        driverLicense: [{ required: true, message: "Обязательное поле!" }],
        contractNumber: [{ required: true, message: "Обязательное поле!" }],
        paymentMethod: [{ required: true, message: "Обязательное поле!" }],
        transportationAnimals: [
          { required: true, message: "Обязательное поле!" },
        ],
      };

      const formData = reactive<IDriverCreate>({
        name: "",
        passport: "",
        address: "",
        phone: "",
        driverLicense: "",
        contractNumber: "",
        paymentMethod: "phone",
        transportationAnimals: false,
      });

      onMounted(async () => {
        fetchUser();
      });

      async function fetchUser() {
        const { phone } = await StorageService.user.get();

        formData.phone = phone;
      }

      const onSubmit = async () => {
        try {
          if (formRef.value) {
            const isValidForm = await formRef.value.validate();

            if (isValidForm) {
              const driver = await DriverService.create(toRaw(formData));

              if (driver) {
                formRef.value.resetFields();
                await StorageService.driver.set(driver);

                emit("change-step", 1);
              }
            }
          }
        } catch (error) {
          console.log("При создании водителя произошла ошибка", error);

          notification("error", "При создании водителя произошла ошибка");
        }
      };

      const resetForm = () => {
        if (formRef.value) {
          formRef.value.resetFields();
        }
      };

      return {
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
