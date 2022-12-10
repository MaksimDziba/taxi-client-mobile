import DriverService from '../../../api/drivers';
import StorageService from '../../storage.service';


export interface State {
  user: null | {};
  token: null | string;
}

export enum MT {
  'SET_TOKEN' = 'SET_TOKEN',
  'SET_USER' = 'SET_USER',
  'SET_DRIVER' = 'SET_DRIVER',
  'SET_CLIENT' = 'SET_CLIENT',
  'SET_LOADING' = 'SET_LOADING',
  'SET_UPDATE_DATA' = 'SET_UPDATE_DATA',
}

const initialState = () => ({
  user: null,
  driver: null,
  client: null,
  token: null,
  loading: false,
  updateData: {},
})

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    [MT.SET_TOKEN](state, token) {
      state.token = token;
    },
    [MT.SET_USER](state, user) {
      state.user = user;
    },
    [MT.SET_DRIVER](state, driver) {
      state.user.name = driver.name
      state.driver = driver;
    },
    [MT.SET_CLIENT](state, client) {
      state.user.name = client.name
      state.client = client;
    },
    [MT.SET_LOADING](state, loading) {
      state.loading = loading;
    },
    [MT.SET_UPDATE_DATA](state) {
      state.updateData = {};
    },
  },
  actions: {
    async setToken({ commit }, token) {
      commit(MT.SET_TOKEN, token);

      await StorageService.token.set(token);
    },
    async setUser({ commit }, user) {
      commit(MT.SET_USER, user);

      await StorageService.user.set(user);
    },
    async setDriver({ commit }, driver) {
      commit(MT.SET_DRIVER, driver);
    },
    async setClient({ commit }, client) {
      commit(MT.SET_CLIENT, client);
    },
    async setLoading({ commit }, payload) {
      commit(MT.SET_LOADING, payload);
    },
    async setUpdateData({ commit }) {
      commit(MT.SET_UPDATE_DATA);
    },
    async checkAuth({ dispatch }) {
      try {
        const token = await StorageService.token.get() || '';
        const user = await StorageService.user.get() || {};
  
        if (token) {
          dispatch('setToken', token);
        }
  
        if (user.id) {
          dispatch('setUser', user);
        }

        return token;
      } catch (error) {
        throw new Error(error);
      }
    },
    async setUserData({ state, commit, dispatch }) {
      const phone = state.user.phone;
      const role = state.user.roles[0].value;

      if (role === 'driver') {
        const driver = await DriverService.getDriverByPhone(phone);

        dispatch('setDriver', driver);
      } else if (role === 'client') {
        const client = await ClientService.getClientByPhone(phone);

        dispatch('setClient', client);
      }
    }
  },
  modules: {},
};
