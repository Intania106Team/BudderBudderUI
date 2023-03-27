import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@hope-ui/solid";
import { FaSolidCheck } from "solid-icons/fa";
import "../styles/icon.css";
import { createEffect, createSignal } from "solid-js";
import axios from "axios";
import { CONFIG } from "../config";
import { useAppContext } from "../context/context";

export default function LoginPage() {
  const [state, { setUser, setPage }] = useAppContext();
  const [studentIDInput, setStudentIDInput] = createSignal("");
  const [passwordInput, setPasswordInput] = createSignal("");
  const isIDPassed = () => /^65[0-9]{6}21$/.test(studentIDInput());
  const isPasswordPassed = () => /^\w{4}$/.test(passwordInput());
  const [isLoginFailed, setLoginFailed] = createSignal(false);
  const [isServerFailed, setServerFailed] = createSignal(false);

  createEffect(() => {
    console.debug("Student ID:", studentIDInput(), isIDPassed());
    console.debug("Password:", passwordInput(), isPasswordPassed());
  });
  return (
    <>
      <Center h="100vh">
        <Box>
          <Center padding={"5vw"} minW={"50vw"}>
            <VStack spacing={"$3"}>
              <Heading level={1} size={"2xl"}>
                Welcome To BuddyBudder
              </Heading>
              <Heading level={2} size={"xl"}>
                Login
              </Heading>
              <Box>
                <form>
                  <Center minW={"50vw"} maxW={"80%"}>
                    <VStack spacing={"$3"}>
                      <InputGroup>
                        <Input
                          placeholder="Student ID"
                          autocomplete="intania106-id"
                          value={studentIDInput()}
                          onInput={(e) => {
                            setStudentIDInput(e.currentTarget.value);
                            setLoginFailed(false);
                            setServerFailed(false);
                          }}
                        />
                        <InputRightElement pointerEvents="none">
                          <FaSolidCheck
                            class="icon"
                            color="green"
                            visibility={isIDPassed() ? "visible" : "hidden"}
                          />
                        </InputRightElement>
                      </InputGroup>

                      <InputGroup>
                        <Input
                          placeholder="PIN"
                          autocomplete="intania106-buddy-pin"
                          type="password"
                          value={passwordInput()}
                          onInput={(e) => {
                            setPasswordInput(e.currentTarget.value);
                            setLoginFailed(false);
                            setServerFailed(false);
                          }}
                        />
                        <InputRightElement pointerEvents="none">
                          <FaSolidCheck
                            class="icon"
                            color="green"
                            visibility={
                              isPasswordPassed() ? "visible" : "hidden"
                            }
                          />
                        </InputRightElement>
                      </InputGroup>
                      <Alert
                        display={isLoginFailed() ? "block" : "none"}
                        status="danger"
                      >
                        <AlertIcon mr="$2_5" />
                        Your login credential isn't correct
                      </Alert>
                      <Alert
                        display={isServerFailed() ? "block" : "none"}
                        status="warning"
                      >
                        <AlertIcon mr="$2_5" />
                        There was an error processing your request
                      </Alert>
                      <Button
                        disabled={!(isIDPassed() && isPasswordPassed())}
                        transitionDuration={"800ms"}
                        onClick={() => {
                          console.debug("User Logging in");
                          axios
                            .post(`${CONFIG.backend_url}/users/auth`, {
                              studentId: studentIDInput(),
                              pin: passwordInput(),
                            })
                            .then((res) => {
                              if (res.data.code > 0)
                                return setLoginFailed(true);
                              if (res.data.code < 0)
                                return setServerFailed(true);
                              setUser(res.data.data);
                              setPage("profiles");
                            })
                            .catch((err) => {
                              console.error(err);
                              setServerFailed(true);
                            });
                        }}
                        size={"md"}
                      >
                        Let's go!
                      </Button>
                    </VStack>
                  </Center>
                </form>
              </Box>
            </VStack>
          </Center>
        </Box>
      </Center>
    </>
  );
}
