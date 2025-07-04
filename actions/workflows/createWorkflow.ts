"use server";

import { z } from "zod";
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from "@/schema/workflow";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflows";
import { redirect } from "next/navigation";

export async function CreateWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);

  if (!success) {
    throw new Error(
      "Invalid form data. Please check your input and try again."
    );
  }

  const { userId } = auth();

  if (!userId) {
    throw new Error(
      "User not authenticated. Please log in to create a workflow."
    );
  }

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: "TODO",
      ...data,
    },
  });

  if (!result) {
    throw new Error("Failed to create workflow. Please try again later.");
  }

  redirect(`/workflow/editor/${result.id}`);
}
