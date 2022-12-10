<template>
  <div class="top-bar">
    <div class="top-bar__left">
      <div class="top-bar__avatar">
        <a-avatar shape="square" :size="40">
          <template #icon><UserOutlined /></template>
        </a-avatar>

        <div class="top-bar__user-info">
          <div class="top-bar__user-info_name">{{ name }}</div>
          <div class="top-bar__user-info_rating">
            <span class="top-bar__user-info_star"
              ><StarFilled style="color: #f7ce09"
            /></span>
            <span class="top-bar__user-info_score">4.0</span>
          </div>
        </div>
      </div>
    </div>

    <div class="top-bar__right">
      <div class="top-bar__balance">1 840 ₽</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

import { UserOutlined, StarFilled } from "@ant-design/icons-vue";

export default defineComponent({
  name: "TopBar",
  components: {
    UserOutlined,
    StarFilled,
  },
  setup() {
    const store = useStore().state["base"];
    const name = computed(() => store.user?.name || "");

    return { name };
  },
});
</script>
