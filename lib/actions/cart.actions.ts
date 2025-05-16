"use server";

import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject } from "../utils";
import { cartItemSchema } from "../validators";

export async function AddItemToCart(data: CartItem) {
  // check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  // get session and user ID
  const session = await auth();
  const userId = session?.user?.id;

  // get cart
  const cart = await getMyCart();

  // Parse and validate item
  const item = cartItemSchema.parse(data);

  // Find product in database
  const product = await prisma.product.findFirst({
    where: { id: item.productId },
  });

  // TESTING
  console.log({
    "Sessions cart ID ": sessionCartId,
    "User ID": userId,
    "Item Requested": item,
    "Product Found": product,
  });

  return {
    success: true,
    message: "Item added to cart",
  };
}

export async function getMyCart() {
  // check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
