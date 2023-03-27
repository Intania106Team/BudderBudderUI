import {
  Center,
  VStack,
  Text,
  Avatar,
  Heading,
  SimpleGrid,
} from "@hope-ui/solid";
import axios from "axios";
import { createEffect, For, onMount, Suspense } from "solid-js";
import { createStore } from "solid-js/store";
import { CONFIG } from "../config";
import { useAppContext } from "../context/context";

export function SelfProfilePage() {
  const [{ user }] = useAppContext();
  const [data, setData] = createStore<
    {
      name?: string;
      codename: string;
      group?: string;
      role: string;
      isYou?: boolean;
    }[]
  >([]);

  createEffect(() => {
    axios
      .get(`${CONFIG.backend_url}/users/profiles`, {
        headers: { u: user.u },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      });
  });

  return (
    <Center>
      <SimpleGrid
        alignItems={"center"}
        h={"$screenH"}
        w={"90vw"}
        columns={{ "@initial": 1, "@sm": 1, "@md": 3 }}
        gap="$10"
      >
        <For each={data} fallback={"No Data"}>
          {(person, index) => (
            <>
              <VStack spacing={"$4"}>
                <Heading size={"3xl"} color={"$primary10"}>
                  {person.role || "You"}
                </Heading>
                <Avatar
                  bg="$primary9"
                  size={"2xl"}
                  bgColor={person.isYou ? "$primary5" : "$warning8"}
                />
                <Heading size={"4xl"}>{person.name || "???? ?????"}</Heading>
                <Text size={"xl"}>Group {person.group || "??"}</Text>
                <Text size={"lg"}>
                  <b>Codename :</b> {person.codename || "????"}
                </Text>
              </VStack>
            </>
          )}
        </For>
      </SimpleGrid>
    </Center>
  );
}
