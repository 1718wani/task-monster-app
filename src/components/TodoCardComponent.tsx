import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { TodoProps } from "~/types/TodoProps";
import { useRouter } from "next/router";

export default function TodoCardComponent({
  id,
  title,
  detail,
  isCompleted,
  imageData,
}: TodoProps) {
  const router = useRouter();
  const clickHandler = async (q: string) => {
    await router.push(q);
  };
  return (
    <Center py={6}>
      <Stack
        borderWidth="1px"
        borderRadius="lg"
        w={{ sm: "100%", md: "540px" }}
        height={{ sm: "476px", md: "20rem" }}
        direction={{ base: "column", md: "row" }}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        padding={4}
      >
        <Flex flex={1} bg="blue.200">
          <Image
            objectFit="cover"
            boxSize="100%"
            src={imageData as string}
            alt="#"
          />
        </Flex>
        <Stack
          flex={1}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={1}
          pt={2}
        >
          <Heading fontSize={"2xl"} fontFamily={"body"}>
            {title}
          </Heading>
          <Text
            textAlign={"center"}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            color={useColorModeValue("gray.700", "gray.400")}
            px={3}
          >
            {detail}
            {isCompleted}
          </Text>
          {isCompleted ? 
          <Badge fontSize='1.2em' colorScheme='green'>討伐Done！</Badge> :
          <Badge fontSize='1.2em'>not yet！</Badge>}

          <Stack
            width={"100%"}
            mt={"2rem"}
            direction={"row"}
            padding={2}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Button
              flex={1}
              fontSize={"sm"}
              rounded={"full"}
              _focus={{
                bg: "gray.200",
              }}
              onClick={() => clickHandler(`/edittask/${id}`)}
            >
              編集する
            </Button>
            <Button
              flex={1}
              fontSize={"sm"}
              rounded={"full"}
              bg={"red.400"}
              color={"white"}
              boxShadow={
                "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
              }
              _hover={{
                bg: "red.500",
              }}
              _focus={{
                bg: "red.500",
              }}
              onClick={() =>
                clickHandler(
                  `/createsubtask/${id}?title=${title}&imageurl=${imageData}`
                )
              }
            >
              対戦する
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Center>
  );
}
