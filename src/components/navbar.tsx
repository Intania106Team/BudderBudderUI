import { Box, Heading, HStack, IconButton } from "@hope-ui/solid";
import { HiSolidMenuAlt2 } from "solid-icons/hi";
import { Show } from "solid-js";
import { useAppContext } from "../context/context";
import { AppDrawerComponent } from "./drawer";

export function NavBarComponent(props: any) {
  const [state, { toggleDrawer }] = useAppContext();

  return (
    <>
      <Show when={state.page !== "login"}>
        <AppDrawerComponent />
      </Show>
      <Box
        maxH={"15vh"}
        padding={"$2"}
        position="sticky"
        w={"100vw"}
        top={0}
        margin={0}
      >
        <HStack spacing={"$4"}>
          <Show when={state.page !== "login"}>
            <IconButton
              aria-label="Drawer Open"
              variant={"ghost"}
              icon={
                <HiSolidMenuAlt2
                  onClick={() => toggleDrawer(true)}
                  size={"40"}
                />
              }
            />
          </Show>
          <Heading padding={"$5"}>{state.title}</Heading>
        </HStack>
      </Box>
    </>
  );
}
