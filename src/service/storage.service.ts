/**
 * Служба для управления локальным хранилищем IndexedDB.
 * Храним (кэшируем) информацию о пользователе, токен аутентификации
 */

// https://github.com/jakearchibald/idb#readme
import { openDB } from "idb";

import { IUser } from "../interface/User";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const DRIVER_KEY = "driver";
const CLIENT_KEY = "client";

const dbPromise = openDB("taxi-store", 1, {
  upgrade(db) {
    db.createObjectStore("taxi-client");
  },
});

interface IStorageMethods { 
  get: () => {};
  set: (value: any) => void;
  remove: () => void;
}

interface IStorageSErvice {
  token: IStorageMethods;
  user: IStorageMethods;
  driver: IStorageMethods;
  client: IStorageMethods;
}

const idbShifts = {
  get: async (key: string) => (await dbPromise).get("taxi-client", key),
  set: async (key: string, value: any) => (await dbPromise).put("taxi-client", value, key),
  delete: async (key: string) => (await dbPromise).delete("taxi-client", key),
  clear: async () => (await dbPromise).clear("taxi-client"),
};

const StorageService: IStorageSErvice = {
  token: {
    get: () => idbShifts.get(TOKEN_KEY),
    set: (accessToken: string) => idbShifts.set(TOKEN_KEY, accessToken),
    remove: () => idbShifts.delete(TOKEN_KEY),
  },
  user: {
    get: () => idbShifts.get(USER_KEY),
    set: (user: IUser) => idbShifts.set(USER_KEY, user),
    remove: () => idbShifts.delete(USER_KEY),
  },
  driver: {
    get: () => idbShifts.get(DRIVER_KEY),
    set: (user: IUser) => idbShifts.set(DRIVER_KEY, user),
    remove: () => idbShifts.delete(DRIVER_KEY),
  },
  client: {
    get: () => idbShifts.get(CLIENT_KEY),
    set: (user: IUser) => idbShifts.set(CLIENT_KEY, user),
    remove: () => idbShifts.delete(CLIENT_KEY),
  },
};

export default StorageService;
