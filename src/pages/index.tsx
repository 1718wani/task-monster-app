import type { GetServerSidePropsContext } from "next";

import HomeList from "./HomeList";
import type { taskForDisplay, tasksForHome } from "~/types/AllTypes";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import axios from "axios";

export default function Home(props: tasksForHome) {
  return (
    <>
      <HomeList tasks={props.tasks}></HomeList>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let tasks: taskForDisplay[] = [];
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = session?.user.userId
  console.log(userId,"これがtask全体呼び出しのuserId")

  try {
    const response = await axios.get<taskForDisplay[]>(
      "http://localhost:3000/api/task",
      {
        params: {
          userId: userId,
        },
        
      }
    );
    tasks = response.data;
    console.log(tasks,"これが全体を呼び出すときのGetserversideのtasks")
   
  } catch (error) {
    console.error("APIの呼び出しに失敗:", error);
  }

  return {
    props: {
      tasks,
    },
  };
};

