import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Progress,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { EditableComponentProps } from "./EditableCard";

export const IsCompletedCard = ({
  title,
  detail,
  imageData,
  enterEditMode,
}: EditableComponentProps) => {
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
          <Box position="relative">
            <Image objectFit="cover" boxSize="100%" src={imageData} alt="#" />
            <Box
              position="absolute"
              top="0"
              right="0"
              bottom="0"
              left="0"
              backgroundColor="black"
              opacity="0.5"
            />
          </Box>
        </Flex>
        <Stack
          flex={1}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          p={1}
          pt={2}
        >
          <Heading isTruncated fontSize={"2xl"} fontFamily={"body"}>
            {title}
          </Heading>
          <Text
            textAlign={"center"}
            fontSize={"2xs"}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            color={useColorModeValue("gray.700", "gray.400")}
            px={3}
            isTruncated
          >
            {detail}
          </Text>

          <Badge fontSize="1.2em" colorScheme="teal">
            討伐Done！
          </Badge>
        </Stack>
      </Stack>
    </Center>
  );
};

export default IsCompletedCard;
