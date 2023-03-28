import {
  Box,
  Button,
  Center,
  createDisclosure,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@hope-ui/solid";
import { FiLoader, FiSend } from "solid-icons/fi";
import { BiSolidImageAlt } from "solid-icons/bi";
import { createEffect, createSignal, For, onMount } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { MessageDto } from "../../models/message";
import { ChatBox } from "../../components/chatbox";
import { useAppContext } from "../../context/context";
import { CONFIG } from "../../config";
import { io } from "socket.io-client";
import axios from "axios";

export function BudderChattingPage() {
  const [{ user }] = useAppContext();
  const { isOpen, onOpen, onClose } = createDisclosure();
  const socket = io(CONFIG.websocket_url, { autoConnect: true, transports: ["websocket"] });
  const [budder, setBudder] = createStore(
    {} as { userId?: string; codename?: string }
  );
  const [message, setMessage] = createSignal("");
  const [isSending, setSending] = createSignal(false);
  const [state, setState] = createStore([] as MessageDto[]);

  onMount(() => {
    axios
      .get(`${CONFIG.backend_url}/chats/budder`, { headers: { u: user.u } })
      .then((res) => {
        setState(res.data);
      });
  });

  createEffect(() => {
    const messageBox = document.getElementById("messagesBox");
    if (messageBox && state.length)
      messageBox.scrollTop = messageBox.scrollHeight;
  });

  createEffect(() => {
    axios
      .get(`${CONFIG.backend_url}/users/budder`, { headers: { u: user.u } })
      .then((res) => {
        setBudder("codename", res.data.codename);
        setBudder("userId", res.data.userId);
      });
  });

  createEffect(() => {
    console.log("Listening", `${user.userId}-budder`);
    if (user && user.userId && budder && budder.userId)
      socket.on(`${user.userId}-budder`, (message) => {
        setState([...state, message]);
      });
  });

  const handleSendMessage = () => {
    setSending(true);
    const tid = crypto.randomUUID();

    setState([
      ...state,
      {
        tid,
        text: message(),
        sender: user.userId!,
        timestamp: new Date(),
        reciever: budder.userId!,
        isSending: true,
        isFailed: false,
      },
    ]);
    socket.emit(
      "budder",
      {
        tid,
        text: message(),
        userId: user.userId,
      },
      (res: any) => {
        const data = JSON.parse(res) as {
          tid: string;
          code: number;
          mid: string;
        };
        if (data.code !== 0) {
          setState(
            (message) => message.tid === tid,
            produce(
              (message) => (
                (message.isFailed = true), (message.messageId = data.mid)
              )
            )
          );
          return onOpen();
        }
        return setState(
          (message) => message.tid === tid,
          produce(
            (message) => (
              (message.isSending = false), (message.messageId = data.mid)
            )
          )
        );
      }
    );
    setSending(false);
    setMessage("");
  };

  return (
    <>
      <Modal motionPreset="scale" opened={isOpen()} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Send Message Failed</ModalHeader>
          <ModalBody>
            <p>Can't send message, please try again later.</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <VStack
        spacing={"$4"}
        minW={"80vw"}
        maxW={"90vw"}
        shadow={"$md"}
        display={"flex"}
        marginRight={"auto"}
        marginLeft={"auto"}
        marginTop={"auto"}
        marginBottom={"$4"}
        flexDirection="column"
        h={"$prose"}
      >
        <VStack flex={1} w={"$full"} flexBasis={"100%"} h={"$prose"}>
          <Box bgColor={"$primary8"} padding={"$4"} w={"$full"}>
            <Heading fontWeight={"$light"}>
              <b>Codename: </b>
              {budder.codename}
            </Heading>
          </Box>

          <Box
            bgColor={"$neutral6"}
            w={"$full"}
            flex={1}
            overflow={"scroll"}
            id={"messagesBox"}
          >
            <VStack w={"$full"}>
              <For each={state}>
                {(message) => (
                  <ChatBox
                    send={message.sender === user.userId}
                    isSending={message.isSending || false}
                    isFailed={message.isFailed}
                  >
                    {message.image ? (
                      <Image
                        boxSize="100px"
                        src={message.image}
                        alt={`${message.messageId}-image`}
                      />
                    ) : undefined}
                    <Text style={{ "word-break": "break-word" }}>
                      {message.text}
                    </Text>
                  </ChatBox>
                )}
              </For>
            </VStack>
          </Box>
        </VStack>

        <Box w={"$full"}>
          <InputGroup>
            <InputLeftElement margin={"auto"}>
              <BiSolidImageAlt
                onClick={
                  () => {
                    alert("add image");
                  }
                  //TODO Add image sender
                }
              />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Enter message here...."
              multiple
              autofocus
              value={message()}
              onInput={(e) => setMessage(e.currentTarget.value)}
            />
            <InputRightElement>
              <IconButton
                aria-label="Send message"
                variant={"ghost"}
                disabled={isSending() || message() === ""}
                icon={isSending() ? <FiLoader /> : <FiSend />}
                onClick={handleSendMessage}
              />
            </InputRightElement>
          </InputGroup>
        </Box>
      </VStack>
    </>
  );
}
