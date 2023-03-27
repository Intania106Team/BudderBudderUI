import {
  Text,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@hope-ui/solid";
import axios from "axios";
import { VsSignOut } from "solid-icons/vs";
import { createEffect } from "solid-js";
import { CONFIG } from "../config";
import { useAppContext } from "../context/context";

export function AppDrawerComponent() {
  const [state, { toggleDrawer, setPage, setUser }] = useAppContext();

  createEffect(() => {
    if (state.page !== "login") {
      if (!state.user) return setPage("login");
      return axios
        .get(`${CONFIG.backend_url}/users`, { headers: { u: state.user.u } })
        .then((res) => {
          if (res.data) return;
        })
        .catch(() => setPage("login"));
    }
    if (state.user && state.user.u) return setPage("profiles");
  });

  createEffect(() => {
    console.log("Page Changed:", state.page);
  });

  return (
    <>
      <Drawer
        opened={state.isDrawerOpen}
        placement="bottom"
        onClose={() => toggleDrawer(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>BuddyBudder106 {state.isDrawerOpen}</DrawerHeader>

          <DrawerBody>
            <Accordion>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Text flex={1} fontWeight="$medium" textAlign="start">
                      Chatting
                    </Text>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <Text
                    color={"$primary10"}
                    onClick={() => setPage("budder-chat")}
                  >
                    Budder
                  </Text>
                </AccordionPanel>
                <AccordionPanel>
                  <Text
                    color={"$warning10"}
                    onClick={() => setPage("buddy-chat")}
                  >
                    Buddy
                  </Text>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton onClick={() => setPage("profiles")}>
                    <Text flex={1} fontWeight="$medium" textAlign="start">
                      View Profile
                    </Text>
                  </AccordionButton>
                </h2>
              </AccordionItem>
            </Accordion>
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr="$3"
              rightIcon={<VsSignOut />}
              onClick={() => {
                toggleDrawer(false), setUser(undefined);
              }}
            >
              Sign out
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
