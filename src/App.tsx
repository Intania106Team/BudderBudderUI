import { HopeThemeConfig, HopeProvider } from "@hope-ui/solid";
import { Match, Switch } from "solid-js";
import { NavBarComponent } from "./components/navbar";
import { ContextProvider, useAppContext } from "./context/context";
import { BudderChattingPage } from "./pages/chats/budder";
import { BuddyChattingPage } from "./pages/chats/buddy";
import LoginPage from "./pages/login";
import { SelfProfilePage } from "./pages/profiles";
import { NotFoundPage, UnknownRouter } from "./pages/utils/exception";

// 2. Create a theme config to include custom colors, fonts, etc
const config: HopeThemeConfig = {
  initialColorMode: "dark",
};

export function Router() {
  const [state] = useAppContext();
  return (
    <>
      <NavBarComponent />
      <Switch
        fallback={() => {
          return <UnknownRouter />;
        }}
      >
        <Match when={state.page === "login"}>
          <LoginPage />
        </Match>
        <Match when={state.page === "profiles"}>
          <SelfProfilePage />
        </Match>
        <Match when={state.page === "budder-chat"}>
          <BudderChattingPage />
        </Match>
        <Match when={state.page === "buddy-chat"}>
          <BuddyChattingPage />
        </Match>
        <Match when={state.page === "404"}>
          <NotFoundPage />
        </Match>
      </Switch>
    </>
  );
}

export default function App() {
  return (
    <HopeProvider config={config}>
      <ContextProvider>
        <Router />
      </ContextProvider>
    </HopeProvider>
  );
}
