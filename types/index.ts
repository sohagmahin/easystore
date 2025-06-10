import { z } from "zod";
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  ShippingAddressSchema,
  insertOrderSchema,
  insertOrderitemSchema,
  paymentResultSchema,
  insertReviewSchema,
  insertCommentSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderitemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItem: OrderItem[];
  user: { name: string; email: string };
  paymentResult: PaymentResult;
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};

export type Comment = z.infer<typeof insertCommentSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};
