"use server";

import { prisma } from "@/db/prisma";
import { z } from "zod";
import { insertCommentSchema } from "../validators";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// Get all comments for a product
export async function getComment({ productId }: { productId: string }) {
  const data = await prisma.comment.findMany({
    where: {
      productId: productId,
    },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return { data };
}

export async function createComment(data: z.infer<typeof insertCommentSchema>) {
  try {
    const session = await auth();

    const comment = insertCommentSchema.parse({
      ...data,
      userId: session ? session?.user?.id : undefined,
    });

    const product = await prisma.product.findFirst({
      where: { id: comment.productId },
    });

    if (!product) throw new Error("Product not found");

    await prisma.$transaction(async (tx) => {
      await tx.comment.create({ data: comment });

      //   Get number of comments
      const numComments = await tx.comment.count({
        where: { productId: comment.productId },
      });

      //   update the numComments in product table
      await tx.product.update({
        where: { id: comment.productId },
        data: {
          numComments,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Comments has been added!",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
