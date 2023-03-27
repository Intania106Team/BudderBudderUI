import { Center, Heading, Stack, Text } from "@hope-ui/solid";
import { createEffect, onMount } from "solid-js";
import { useAppContext } from "../../context/context";

export function NotFoundPage() {
  const [{}, { setPage }] = useAppContext();
  onMount(() => {
    setTimeout(() => {
      setPage("login");
      console.log("Change!");
    }, 1500);
  });
  return (
    <Center>
      <Stack>
        <Heading size="2xl">Sorry, Page Not found.</Heading>
        <Text>You will be redirected to main page</Text>
      </Stack>
    </Center>
  );
}

export function UnknownRouter() {
  return (
    <Text>
      Sorry, The app router failed. Please contact <b>PatrickChoDev</b> to fix
      this. But please refresh the page first ;-;
    </Text>
  );
}
