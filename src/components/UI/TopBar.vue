<template>
  <div class="top-bar">
    <div class="top-bar__left">
      <div class="top-bar__avatar">
        <a-avatar shape="square" :size="40" @click="handleOpenProfile">
          <template #icon><UserOutlined /></template>
        </a-avatar>

        <div class="top-bar__user-info">
          <div class="top-bar__user-info_name">{{ name }}</div>

          <div class="top-bar__user-info_rating">
            <span class="top-bar__user-info_star">
              <StarFilled style="color: #f7ce09" />
            </span>

            <span class="top-bar__user-info_score">4.0</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isDriver" class="top-bar__right">
      <div class="top-bar__balance">1 840 ₽</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';

import { UserOutlined, StarFilled } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'TopBar',
  components: {
    UserOutlined,
    StarFilled,
  },
  setup() {
    const store = useStore();

    const storeBase = store.state['base'];
    const name = computed(() => storeBase.user?.name || '');

    const isDriver = computed(() => !storeBase.client && storeBase.driver);

    const handleOpenProfile = () => {
      store.commit('modal/SET_MODAL', {
        type: 'profile',
        show: true,
      });
    };

    return {
      name,
      isDriver,
      handleOpenProfile,
    };
  },
});
</script>
