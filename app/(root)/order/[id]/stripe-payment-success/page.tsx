import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/cart.actions";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const SuccessPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  const { id } = await props.params;

  const { payment_intent: paymentIntendId } = await props.searchParams;

  // Fetch order
  const order = await getOrderById(id);

  if (!order) notFound();

  //   Retrieve payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntendId);

  // Check if payment is successfull
  const isSuccess = paymentIntent.status === "succeeded";

  if (!isSuccess) return redirect(`/order/${id}`);

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="h1-bold">Thanks for your purchase</h1>
        <div>We are processing your order.</div>
        <Button asChild>
          <Link href={`/order/${id}`}> View Order</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
