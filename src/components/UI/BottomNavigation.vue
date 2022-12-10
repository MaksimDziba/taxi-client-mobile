<template>
  <div class="bot-nav">
    <div
      v-for="menu in menuList"
      :key="menu.path"
      class="menu-item"
      :class="{
        'menu-item_active': menu.path === path,
      }"
      @click="handleSelectItem(menu.path)"
    >
      <div class="menu-item__img"><component :is="menu.icon" /></div>
      <div class="menu-item__title">
        <router-link :to="menu.path">{{ menu.title }}</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

// icons
import { ScheduleOutlined, SlackOutlined } from "@ant-design/icons-vue";

const driverMenu = [
  {
    title: "Карта",
    path: "/map-driver",
    icon: "slack-outlined",
  },
  {
    title: "Смены",
    path: "/shifts",
    icon: "schedule-outlined",
  },
  {
    title: "Заказы",
    path: "/orders-driver",
    icon: "schedule-outlined",
  },
];

const clientMenu = [
  {
    title: "Карта",
    path: "/map-client",
    icon: "slack-outlined",
  },
  {
    title: "Заказы",
    path: "/order-client",
    icon: "schedule-outlined",
  },
];

export default defineComponent({
  name: "BottomNavigation",
  components: {
    ScheduleOutlined,
    SlackOutlined,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const menuRole = () => {
      const role = store.state["base"].user.role;

      switch (role) {
        case "driver": {
          return driverMenu;
        }
        case "client": {
          return clientMenu;
        }
        default: {
          return driverMenu;
        }
      }
    };

    const path = computed(() => route.path);

    const menuList = reactive(menuRole());

    const handleSelectItem = (path: string) => {
      router.push({ path });
    };

    onBeforeMount(() => {
      store.dispatch("base/setUserData");
    });

    return {
      path,
      menuList,
      handleSelectItem,
    };
  },
});
</script>
