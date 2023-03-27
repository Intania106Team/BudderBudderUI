import { Box, HStack, VStack } from "@hope-ui/solid";
import { FiLoader } from "solid-icons/fi";
import { VsError } from "solid-icons/vs";

export function ChatBox(props: any) {
  return (
    <HStack
      spacing={"$2"}
      justifyContent={"end"}
      marginRight={props.send ? "$2" : "auto"}
      marginTop={"$2"}
      maxW={"60%"}
      marginBottom={"$2"}
      marginLeft={props.send ? "auto" : "$2"}
    >
      <VStack
        spacing={"$2"}
        bgColor={props.send ? "$primary6" : "$primary8"}
        padding={"8px 20px"}
        width={"$full"}
        borderRadius={"$lg"}
      >
        {props.children}
      </VStack>
      {props.isSending ? <FiLoader size={8} /> : undefined}
      {props.isFailed ? <VsError size={8} color="red" /> : undefined}
    </HStack>
  );
}
