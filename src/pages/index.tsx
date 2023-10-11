import type { GetServerSidePropsContext } from "next";

import HomeList from "./HomeList";
import type { taskForDisplay, tasksForHome } from "~/types/AllTypes";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import axios from "axios";
import nookies from 'nookies'

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
  const token = nookies.get(context)["next-auth.session-token"]
  console.log(token,"呼び出されたtoken")
  console.log(userId,"task全体呼び出しのuserId")

  try {
    const response = await axios.get<taskForDisplay[]>(
      "http://localhost:3000/api/task",
      {
        params: {
          userId: userId,
        },
        headers: { Cookie: `next-auth.session-token=${token}`},
        
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

