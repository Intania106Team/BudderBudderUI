import {
  createCookieStorage,
  createLocalStorage,
} from "@solid-primitives/storage";
import { createContext, useContext, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { pageTitle, PageTitleEnum } from "../utils/title";

export type AppContextState = {
  appTheme: boolean; // f -> dark, t -> light
  page: PageTitleEnum;
  user: { name?: string; userId?: string; u?: string };
  isDrawerOpen: boolean;
  title: string;
};
export type AppContextValue = [
  state: AppContextState,
  actions: {
    switchAppTheme: () => void;
    setPage: (val: string) => void;
    setUser: (user: any) => void;
    toggleDrawer: (val: boolean) => void;
  }
];

const defaultAppContextState: AppContextState = {
  appTheme: false,
  page: "login",
  user: {},
  isDrawerOpen: false,
  title: "",
};

const AppContext = createContext<AppContextValue>(
  [
    defaultAppContextState,
    {
      switchAppTheme: () => undefined,
      setPage: (val: string) => undefined,
      setUser: (user: any) => undefined,
      toggleDrawer: (val: boolean) => undefined,
    },
  ],
  {
    name: "AppContext",
  }
);

export function ContextProvider(props: any) {
  const [local, setLocal] = createLocalStorage({
    serializer: (value) => JSON.stringify(value),
    deserializer: (v) => {
      if (!v || v === "undefined") return undefined;
      return JSON.parse(v);
    },
  });
  const [state, setState] = createStore({
    ...defaultAppContextState,
    ...local,
  });
  const setStorage = (k: keyof AppContextState, v: any) => {
    setState(k, v);
    setLocal(k, v);
  };
  setStorage("appTheme", local.appTheme || defaultAppContextState.appTheme);
  setStorage(
    "isDrawerOpen",
    local.isDrawerOpen || defaultAppContextState.isDrawerOpen
  );
  setStorage("page", local.page || defaultAppContextState.page);
  setStorage("title", local.title || defaultAppContextState.title);
  setStorage("user", local.user || defaultAppContextState.user);

  const actions = {
    switchAppTheme: () => setStorage("appTheme", !state.appTheme),
    setPage: (val: string) => {
      setStorage("isDrawerOpen", false);
      setStorage("page", val);
    },
    setUser: (user: any) => setStorage("user", user),
    toggleDrawer: (val: boolean) => {
      setStorage("isDrawerOpen", val);
    },
  };

  createEffect(() => console.log(state.user));

  createEffect(() => {
    setStorage("title", pageTitle[state.page as PageTitleEnum]);
  });

  return (
    <AppContext.Provider value={[state, actions]}>
      {props.children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
