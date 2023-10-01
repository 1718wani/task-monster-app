import {
  Avatar,
  Divider,
  HStack,
  Heading,
  Progress,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { taskForDisplay, tasksForHome } from "~/types/AllTypes";

export const OngoingBattleComponents = () => {
    
    const [cookies, setCookie, removeCookie] = useCookies(["userId"]);
    const [tasks, setTasks] = useState<taskForDisplay[]>([]);
    console.log(cookies, "これがクッキー"); 
    const userId = cookies.userId as string;
    console.log(userId, "これがuserId");

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

    // テスト
    

  return (
    <>
    <Heading size="md" px={4} pt={2} pb={1}>
        Ongoing Battle
    </Heading>
      
      {tasks.map((task) => (
        <>
          <Divider pt={2} />
          <HStack pt={2} pb={1} px={4}>
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
        </>
      ))}
    </>
  );
};

