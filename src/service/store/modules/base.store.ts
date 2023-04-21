import { Commit, Dispatch } from 'vuex';

import DriverService from '../../../api/drivers';
import ClientService from '../../../api/clients';
import { logoutUser } from '../../../api/auth';
import StorageService from '../../storage.service';
import { IDriver } from '../../../interface/Driver';
import { IClient } from '../../../interface/Client';

export interface State {
  user: null | Record<string, any>;
  driver: null | Record<string, any>;
  client: null | Record<string, any>;
  token: null | string;
  loading: boolean;
  updateData: {};
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
});

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    [MT.SET_TOKEN](state: State, token: string) {
      state.token = token;
    },
    [MT.SET_USER](state: State, user: Record<string, any>) {
      state.user = user;
    },
    [MT.SET_DRIVER](state: State, driver: Record<string, any>) {
      state.user = state.user
        ? { ...state.user, name: driver.name }
        : { name: driver.name };

      state.driver = driver;
    },
    [MT.SET_CLIENT](state: State, client: Record<string, any>) {
      state.user = state.user
        ? { ...state.user, name: client.name }
        : { name: client.name };

      state.client = client;
    },
    [MT.SET_LOADING](state: State, loading: boolean) {
      state.loading = loading;
    },
    [MT.SET_UPDATE_DATA](state: State) {
      state.updateData = {};
    },
  },
  actions: {
    async setToken({ commit }: { commit: Commit }, token: string) {
      commit(MT.SET_TOKEN, token);

      await StorageService.token.set(token);
    },
    async setUser({ commit }: { commit: Commit }, user: Record<string, any>) {
      commit(MT.SET_USER, user);

      await StorageService.user.set(user);
    },
    async setDriver({ commit }: { commit: Commit }, driver: IDriver) {
      commit(MT.SET_DRIVER, driver);
    },
    async setClient({ commit }: { commit: Commit }, client: IClient) {
      commit(MT.SET_CLIENT, client);
    },
    async setLoading({ commit }: { commit: Commit }, bool: boolean) {
      commit(MT.SET_LOADING, bool);
    },
    async setUpdateData({ commit }: { commit: Commit }) {
      commit(MT.SET_UPDATE_DATA);
    },
    async checkAuth({ dispatch }: { dispatch: Dispatch }) {
      try {
        const token = (await StorageService.token.get()) || '';
        const user = (await StorageService.user.get()) || {};

        if (token) {
          dispatch('setToken', token);
        }

        if (user?.id) {
          dispatch('setUser', user);
        }

        return token;
      } catch (error) {
        throw new Error(error);
      }
    },
    async logout({ dispatch }: { dispatch: Dispatch }) {
      try {
        await StorageService.token.set('');
        await StorageService.user.set('');

        dispatch('setToken', null);
        dispatch('setUser', {});

        logoutUser();
      } catch (error) {
        throw new Error(error);
      }
    },
    async setUserData({
      state,
      dispatch,
    }: {
      state: State;
      dispatch: Dispatch;
    }) {
      if (state.user) {
        const phone = state.user.phone;
        const role = state.user.role;

        if (role === 'driver') {
          const driver = await DriverService.getDriverByPhone(phone);

          dispatch('setDriver', driver);
        } else if (role === 'client') {
          const client = await ClientService.getClientByPhone(phone);

          dispatch('setClient', client);
        }
      }
    },
  },
  modules: {},
};
