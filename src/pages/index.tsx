import type { GetServerSidePropsContext } from "next";

import HomeList from "./HomeList";
import type { taskForDisplay } from "~/types/AllTypes";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import axios from "axios";
import nookies from "nookies";
import { prisma } from "~/server/db";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { HomeTasksAtom } from "~/atoms/atom";

export interface HomeProps {
  tasks: taskForDisplay[];
}

export default function Home({tasks}:HomeProps) {
  const [tasksState,setTasksState] = useAtom(HomeTasksAtom)
  useEffect(() => {
    setTasksState(tasks);
  }, [tasks,setTasksState]);  // tasks が変更されたときにのみ useEffect 内の処理を実行する
  console.log(tasksState,"これが最上位のtasksState")
  
  return (
    <>
      <HomeList tasks={tasksState}></HomeList>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  let tasks:taskForDisplay [] = [];
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = session?.user.userId;
  // クッキーをセットしたほうが良さそう

  try {
    tasks = await prisma.task.findMany({
      where: {
        userId: userId,
      },
      orderBy: { id: "desc" },
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
