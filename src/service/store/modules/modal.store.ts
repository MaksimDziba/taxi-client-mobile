export interface State {
  type: string;
  show: boolean;
}

export enum MT {
  'SET_MODAL' = 'SET_MODAL';
  'CLOSE_MODAL' = 'CLOSE_MODAL';
}

const initialState = () => ({
  type: "",
  show: false,
})

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    [MT.SET_MODAL](state, payload: State) {
      Object.assign(state, payload);
    },
    [MT.CLOSE_MODAL](state: State) {
      Object.assign(state, initialState());
    },
  },
  actions: {
    setModal({ commit }, payload: State) {
      commit(MT.SET_MODAL, payload);
    },
    setClose({ commit } ) {
      commit(MT.CLOSE_MODAL);
    },
  },
  modules: {},
};
