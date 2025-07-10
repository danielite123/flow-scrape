"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflows";
import { auth } from "@clerk/nextjs/server";

export async function UpdateWorkFlow({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) {
  const { userId } = auth();

  if (userId) {
    throw new Error("unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("workflow not found");
  }
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("workflow is not a draft");
  }
}
