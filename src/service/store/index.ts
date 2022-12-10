import { createStore } from "vuex";

import base from "./modules/base.store";
import modal from "./modules/modal.store";

export default createStore<State>({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    base,
    modal,
  },
});
