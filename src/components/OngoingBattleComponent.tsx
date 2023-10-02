import {
  Avatar,
  Divider,
  HStack,
  Heading,
  Progress,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  Portal,
  Box,
  Tooltip,
  MenuButton,
  Menu,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { taskForDisplay, tasksForHome } from "~/types/AllTypes";
import HoverClapMenu from "./ui/Menu/HoverClapMenu";
import { Toaster } from "react-hot-toast";
import {
  RegisterationFailureNotification,
  SendReactionNotification,
} from "~/notifications/notifications";

export const OngoingBattleComponents = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["userId"]);
  const [tasks, setTasks] = useState<taskForDisplay[]>([]);
  console.log(cookies, "これがクッキー");
  const userId = cookies.userId as string;
  console.log(userId, "これがuserId");

  const sendComment = () => {
    SendReactionNotification();
  };

  useEffect(() => {
    // APIからデータを非同期でフェッチします。
    const fetchData = async () => {
      try {
        const response = await axios.get<taskForDisplay[]>(
          "http://localhost:3000/api/task",
          {
            params: {
              getIsOngoing: "true",
              userId: userId,
            },
          }
        );

        setTasks(response.data);
      } catch (error) {
        console.error("APIからデータの取得に失敗しました:", error);
      }
    };

    void fetchData().catch((error) => {
      console.error("APIからデータの取得に失敗しました:", error);
    });
  }, []);

  return (
    <>
      <Heading size="md" px={4} pt={2} pb={1}>
        Ongoing Battle
      </Heading>

      {tasks.map((task) => (
        <>
          <Divider pt={2} />

          <Menu placement="right">
            <Tooltip label="コメントを送る" aria-label="A tooltip">
              <MenuButton
                as={Button}
                w={"full"}
                h={"full"}
                background={"white"}
              >
                <HStack pt={2} pb={1} px={4} cursor="pointer">
                  <Avatar size={"md"} src={task.imageData ?? undefined} />

                  <Stack width={"full"}>
                    <Heading size="xs">{task.title}</Heading>
                    <Progress
                      width={"full"}
                      colorScheme={"teal"}
                      size="sm"
                      value={80}
                      isAnimated
                      hasStripe
                      shadow="dark-lg"
                      rounded="lg"
                    />
                  </Stack>
                </HStack>
              </MenuButton>
            </Tooltip>
            <MenuList onClick={sendComment}>
              <MenuItem>ナイスファイト！👏</MenuItem>
              <MenuItem>わたしも頑張ります！💪</MenuItem>
              <MenuItem>一緒にがんばりましょう🤝</MenuItem>
            </MenuList>
          </Menu>
        </>
      ))}
    </>
  );
};
