import {
  Avatar,
  Divider,
  HStack,
  Heading,
  Progress,
  Stack,
  Button,
  Tooltip,
  MenuButton,
  Menu,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import type { taskForDisplay } from "~/types/AllTypes";
import { SendReactionNotification } from "~/notifications/notifications";
import Pusher from "pusher-js";
import { useSession } from "next-auth/react";
import CustomProgressBar from "./ui/ProgressBar/CustomeProgressBar";

export const OngoingBattleComponents = () => {
  const [tasks, setTasks] = useState<taskForDisplay[]>([]);
  const { data: session } = useSession();
  const userId = session?.user.userId;
  console.log(userId, "userId in OngoingBattleComponent");

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
        console.log(
          response.data,
          "OngoingBattleComponentのtasksを取得しました"
        );
      } catch (error) {
        console.error("APIからデータの取得に失敗しました:", error);
      }
    };

    void fetchData().catch((error) => {
      console.error("APIからデータの取得に失敗しました:", error);
    });
  }, []);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
    if (!key || !cluster) {
      console.log("key or cluster is not defined");
      return;
    }
    // Pusherのセットアップ
    const pusher = new Pusher(key, {
      cluster: cluster,
    });
    console.log(pusher, "これがpusher");

    return () => {
      // コンポーネントのアンマウント時にPusher接続をクローズ
      pusher.disconnect();
    };
  }, []);

  const sendComment = async (receiverUserId: string, reaction: string) => {
    try {
      const response = await axios.post("/api/trigger-notification", {
        senderUserId: userId,
        receiverUserId: receiverUserId,
        reaction: reaction,
      });
      console.log(response.data); // "Notification triggered"と表示されるはず
    } catch (error) {
      console.error(error);
    }

    SendReactionNotification(receiverUserId, reaction);
  };

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

                    <CustomProgressBar w={"full"} size="sm" value={40} />
                  </Stack>
                </HStack>
              </MenuButton>
            </Tooltip>
            <MenuList>
              <MenuItem
                onClick={async () => await sendComment(task.userId, "👏")}
              >
                ナイスファイト！👏
              </MenuItem>
              <MenuItem
                onClick={async () => await sendComment(task.userId, "💪")}
              >
                わたしも頑張ります！💪
              </MenuItem>
              <MenuItem
                onClick={async () => await sendComment(task.userId, "🤝")}
              >
                一緒にがんばりましょう🤝
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      ))}
    </>
  );
};
