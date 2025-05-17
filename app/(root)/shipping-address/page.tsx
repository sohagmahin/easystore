import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.action";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ShippingAdressForm from "./shipping-address-form";
import { ShippingAddress } from "@/types";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
  title: "Shipping Address",
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await auth();

  const uesrId = session?.user?.id;

  if (!uesrId) throw new Error("No user ID");

  const user = await getUserById(uesrId);

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAdressForm address={user.address as ShippingAddress} />
    </>
  );
};

export default ShippingAddressPage;
