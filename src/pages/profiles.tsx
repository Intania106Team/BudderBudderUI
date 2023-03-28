import {
  Center,
  VStack,
  Text,
  Avatar,
  Heading,
  SimpleGrid,
  Button,
  createDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tr,
  Tag,
  Thead,
  Th,
} from "@hope-ui/solid";
import axios from "axios";
import { createEffect, For } from "solid-js";
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
      hint?: string;
      words?: string;
      desire?: string;
      depart?: string;
      interests?: string[];
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
          {(person, index) => {
            const { isOpen, onOpen, onClose } = createDisclosure();
            return (
              <>
                <Modal
                  motionPreset="fade-in-bottom"
                  size={"full"}
                  opened={isOpen()}
                  onClose={onClose}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>
                      {(person.role
                        ? person.role == "You"
                          ? "Your"
                          : person.role
                        : undefined || '"Unknown"') + " info"}
                    </ModalHeader>
                    <ModalBody>
                      <Table striped="odd" dense>
                        <TableCaption>
                          {(person.role
                            ? person.role == "You"
                              ? "Your"
                              : person.role
                            : undefined || '"Unknown"') + " info"}
                        </TableCaption>
                        <Thead>
                          <Tr borderBottom={"white"}>
                            <Th>Topic</Th>
                            <Th>Description</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {person.codename ? (
                            <Tr>
                              <Td>Code name</Td>
                              <Td>{person.codename}</Td>
                            </Tr>
                          ) : undefined}
                          {person.name ? (
                            <Tr>
                              <Td>ชื่อเล่น</Td>
                              <Td>{person.name}</Td>
                            </Tr>
                          ) : undefined}
                          {person.group ? (
                            <Tr>
                              <Td>กรุ๊ป</Td>
                              <Td>{person.group}</Td>
                            </Tr>
                          ) : undefined}
                          {person.depart ? (
                            <Tr>
                              <Td>ภาค</Td>
                              <Td>{person.depart}</Td>
                            </Tr>
                          ) : undefined}
                          {person.hint ? (
                            <Tr>
                              <Td>คำใบ้</Td>
                              <Td>
                                <pre style={{ "white-space": "pre-wrap" }}>
                                  {person.hint}
                                </pre>
                              </Td>
                            </Tr>
                          ) : undefined}
                          {person.desire ? (
                            <Tr>
                              <Td>สิ่งที่อยากได้</Td>
                              <Td>
                                <pre style={{ "white-space": "pre-wrap" }}>
                                  {person.desire}
                                </pre>
                              </Td>
                            </Tr>
                          ) : undefined}
                          {person.words ? (
                            <Tr>
                              <Td>สิ่งที่อยากบอกบัดเดอร์</Td>
                              <Td>
                                <pre style={{ "white-space": "pre-wrap" }}>
                                  {person.words}
                                </pre>
                              </Td>
                            </Tr>
                          ) : undefined}
                          {person.interests ? (
                            <Tr>
                              <Td>สิ่งที่สนใจ</Td>
                              <Td>
                                <For
                                  each={person.interests}
                                  fallback={<i>No interests</i>}
                                >
                                  {(int) => <Tag margin={"$1"}>{int}</Tag>}
                                </For>
                              </Td>
                            </Tr>
                          ) : undefined}
                        </Tbody>
                      </Table>
                    </ModalBody>
                    <ModalFooter>
                      <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <VStack spacing={"$4"}>
                  <Heading size={"3xl"} color={"$primary10"}>
                    {person.role || "Unknown"}
                  </Heading>
                  <Avatar
                    bg="$primary9"
                    size={"2xl"}
                    bgColor={person.isYou ? "$primary5" : "$warning8"}
                  />
                  <Heading size={"4xl"}>{person.name || "????"}</Heading>
                  <Text size={"xl"}>Group {person.group || "?"}</Text>
                  <Text size={"lg"}>
                    <b>Codename :</b> {person.codename || "????"}
                  </Text>
                  <Button variant={"subtle"} size="sm" onClick={onOpen}>
                    More Info
                  </Button>
                </VStack>
              </>
            );
          }}
        </For>
      </SimpleGrid>
    </Center>
  );
}
