<template>
  <a-layout class="page-auth">
    <img alt="Taxi service logo" src="../assets/taxi-logo.png" />

    <div class="box__xs box__center">
      <a-tabs v-model:activeKey="activeKey" destroyInactiveTabPane animated>
        <a-tab-pane key="1" tab="Вход">
          <a-form
            ref="formRefAuth"
            :model="formStateAuth"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item
              label="Телефон"
              name="phone"
              :rules="[{ required: true, message: 'Обязательное поле!' }]"
            >
              <a-input autoComplete="off" v-model:value="formStateAuth.phone">
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item
              label="Пароль"
              name="password"
              :rules="[{ required: true, message: 'Обязательное поле!' }]"
            >
              <a-input-password
                autoComplete="off"
                v-model:value="formStateAuth.password"
              >
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-button
              type="primary"
              size="middle"
              :disabled="disabledAuth"
              @click="onAuth"
            >
              Вход
            </a-button>
          </a-form>
        </a-tab-pane>

        <a-tab-pane key="2" tab="Регистрация">
          <a-form
            ref="formRefRegistration"
            :model="formStateRegistration"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item
              label="Телефон"
              name="phone"
              :rules="[{ required: true, message: 'Обязательное поле!' }]"
            >
              <a-input
                autoComplete="off"
                v-model:value="formStateRegistration.phone"
              >
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item
              label="Пароль"
              name="password"
              :rules="[{ required: true, message: 'Обязательное поле!' }]"
            >
              <a-input-password
                autoComplete="off"
                v-model:value="formStateRegistration.password"
              >
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item
              label="Роль"
              name="role"
              :rules="[{ required: true, message: 'Обязательное поле!' }]"
            >
              <a-select v-model:value="formStateRegistration.role">
                <a-select-option value="driver">Водитель</a-select-option>
                <a-select-option value="client">Клиент</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>

          <a-button
            type="primary"
            size="middle"
            :disabled="disabledRegistration"
            @click="onRegistration"
          >
            Регистрация
          </a-button>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-layout>
</template>

<script lang="ts">
import { registrationUser, loginUser } from "../api/auth";

import { computed, defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";

import type { FormInstance } from "ant-design-vue";

interface FormState {
  phone: string;
  password: string;
  role?: string;
}

export default defineComponent({
  name: "Auth",
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const formRefAuth = ref<FormInstance>();
    const formRefRegistration = ref<FormInstance>();

    const formStateAuth = reactive<FormState>({
      phone: "",
      password: "",
    });

    const formStateRegistration = reactive<FormState>({
      phone: "",
      password: "",
      role: "driver",
    });

    const onAuth = async () => {
      try {
        if (formRefAuth.value) {
          const isValidForm = await formRefAuth.value.validate();

          if (isValidForm) {
            const { token, user } = await loginUser(formStateAuth);

            if (token && user) {
              store.dispatch("base/setToken", token);
              store.dispatch("base/setUser", user);

              updateRoute(user.roles[0].value);
            }
          }
        }
      } catch (error) {
        console.log("При авторизации произошла ошибка", error);
      }
    };

    const onRegistration = async () => {
      try {
        if (formRefRegistration.value) {
          const isValidForm = await formRefRegistration.value.validate();

          if (isValidForm) {
            store.dispatch("base/setLoading", true);

            const response = await registrationUser(formStateRegistration);

            if (response) {
              store.dispatch("base/setToken", response.token);
              store.dispatch("base/setUser", response.user);

              router.push({ path: "/registration" });
            }
          }
        }
      } catch (error) {
        console.log("При регистрации произошла ошибка", error);
      } finally {
        store.dispatch("base/setLoading", false);
      }
    };

    const updateRoute = (role: string) => {
      if (role === "driver") {
        router.push({ path: "/shifts" });
      } else if (role === "client") {
        router.push({ path: "/order-client" });
      }
    };

    const disabledAuth = computed(() => {
      return !(formStateAuth.phone && formStateAuth.password);
    });

    const disabledRegistration = computed(() => {
      const { phone, password, role } = formStateRegistration;

      return !(phone && password && role);
    });

    return {
      activeKey: ref("1"),
      formStateAuth,
      formStateRegistration,
      formRefAuth,
      formRefRegistration,
      disabledAuth,
      disabledRegistration,
      onAuth,
      onRegistration,
    };
  },
});
</script>
