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

            <a-form-item
              label="Роль"
              name="role"
              :rules="[{ required: true, message: 'Обязательное поле!' }]"
            >
              <a-select v-model:value="formState.role">
                <a-select-option value="driver">Водитель</a-select-option>
                <a-select-option value="client">Клиент</a-select-option>
              </a-select>
            </a-form-item>

            <a-button
              type="primary"
              size="middle"
              :disabled="disabledButton"
              @click="onAuth"
            >
              Вход
            </a-button>
          </a-form>
        </a-tab-pane>

        <a-tab-pane key="2" tab="Регистрация">
          <a-form
            ref="formRefRegistration"
            :model="formState"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item
              label="Телефон"
              name="phone"
              :rules="[{ required: true, message: 'Обязательное поле!' }]"
            >
              <a-input autoComplete="off" v-model:value="formState.phone">
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
                v-model:value="formState.password"
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
              <a-select v-model:value="formState.role">
                <a-select-option value="driver">Водитель</a-select-option>
                <a-select-option value="client">Клиент</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>

          <a-button
            type="primary"
            size="middle"
            :disabled="disabledButton"
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
import { registrationUser, loginUser } from '../api/auth';

import { computed, defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

import type { FormInstance } from 'ant-design-vue';

interface FormState {
  phone: string;
  password: string;
  role?: string;
}

export default defineComponent({
  name: 'Auth',
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const formRefAuth = ref<FormInstance>();
    const formRefRegistration = ref<FormInstance>();

    const formState = reactive({
      phone: '',
      password: '',
      role: 'client' as const,
    });

    const onAuth = async () => {
      try {
        if (formRefAuth.value) {
          const isValidForm = await formRefAuth.value.validate();

          if (isValidForm) {
            const { token, user } = await loginUser(formState);

            if (token && user) {
              await store.dispatch('base/setToken', token);
              await store.dispatch('base/setUser', user);

              await store.dispatch('base/setUserData');

              updateRoute(user.role);
            }
          }
        }
      } catch (error) {
        console.log('При авторизации произошла ошибка', error);
      }
    };

    const onRegistration = async () => {
      try {
        if (formRefRegistration.value) {
          const isValidForm = await formRefRegistration.value.validate();

          if (isValidForm) {
            store.dispatch('base/setLoading', true);

            const response = await registrationUser(formState);

            if (response) {
              store.dispatch('base/setToken', response.token);
              store.dispatch('base/setUser', response.user);

              router.push({ path: '/registration' });
            }
          }
        }
      } catch (error) {
        console.log('При регистрации произошла ошибка', error);
      } finally {
        store.dispatch('base/setLoading', false);
      }
    };

    const updateRoute = (role: string) => {
      if (role === 'driver') {
        router.push({ path: '/shifts' });
      } else if (role === 'client') {
        router.push({ path: '/order-client' });
      }
    };

    const disabledButton = computed(() => {
      return !(formState.phone && formState.password && formState.role);
    });

    return {
      activeKey: ref('1'),
      formStateAuth: formState,
      formState,
      formRefAuth,
      formRefRegistration,
      disabledButton,
      onAuth,
      onRegistration,
    };
  },
});
</script>
