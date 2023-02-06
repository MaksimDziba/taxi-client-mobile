import { Commit } from 'vuex';

export interface State {
  type: string;
  show: boolean;
  data?: {} | null;
}

export enum MT {
  'SET_MODAL' = 'SET_MODAL',
  'CLOSE_MODAL' = 'CLOSE_MODAL',
}

const initialState = () => ({
  type: '',
  show: false,
  data: null,
});

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    [MT.SET_MODAL](state: State, payload: State) {
      Object.assign(state, payload);
    },
    [MT.CLOSE_MODAL](state: State) {
      Object.assign(state, initialState());
    },
  },
  actions: {
    setModal({ commit }: { commit: Commit }, payload: State) {
      commit(MT.SET_MODAL, payload);
    },
    setClose({ commit }: { commit: Commit }) {
      commit(MT.CLOSE_MODAL);
    },
  },
  modules: {},
};
