import { createApp } from "vue";

import router from "./router";
import store from "./service/store";

import YmapPlugin from 'vue-yandex-maps';

import App from "./App.vue";

const app = createApp(App);

app.use(store);
app.use(router);
app.use(YmapPlugin)

app.mount("#app");
