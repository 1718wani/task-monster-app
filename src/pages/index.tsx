import type { GetServerSidePropsContext } from "next";

import HomeList from "./HomeList";
import type { taskForDisplay, tasksForHome } from "~/types/AllTypes";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import axios from "axios";
import nookies from "nookies";
import { prisma } from "~/server/db";

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
  const userId = session?.user.userId;

  try {
    tasks = await prisma.task.findMany({
      where: {
        userId: userId,
      },
      include: {
        subTasks: true, // サブタスクも一緒に取得
      },
    });
  } catch (error) {
    console.error("データベースの呼び出しに失敗:", error);
  }

  return {
    props: {
      tasks,
    },
  };
};
