import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "~/server/db";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
  ) {
  const session = await getSession({ req });
  console.log(session)
  const { method } = req;
  switch (method) {
      case 'GET':
        if (!session || !session.user?.email) {
            return res.status(401).json({ error: "Not authenticated" });
          }
        
          const user = await prisma.user.findUnique({
            where: { email: session.user?.email }
          });
          
          if (!user) {
            return res.status(404).json({ error: "User not found" });
            
          }
        
          console.log(user,"これがAPI呼び出し時のuser情報")
          return res.status(200).json(user);

        }
  

};
