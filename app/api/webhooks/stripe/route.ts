import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/order.actions";

export async function POST(req: NextRequest) {
  console.log("inside stripe web hooks");
  // Build the webhook event
  const event = await Stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  console.log("events");
  console.log(event);

  // Check for successful payment
  if (event.type === "charge.succeeded") {
    const { object } = event.data;
    console.log("inside chartge.succeeded");
    // Update order status
    await updateOrderToPaid({
      orderId: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: "COMPLETED",
        email_address: object.billing_details.email!,
        pricePaid: (object.amount / 100).toFixed(),
      },
    });

    console.log("inside -> updateOrderToPaid");
    return NextResponse.json({
      message: "updateOrderToPaid was successful",
    });
  }

  return NextResponse.json({
    message: "event is not charge.succeeded",
  });
}

// Testing
export async function GET(req: NextRequest, res: NextResponse) {
  return NextResponse.json({
    message: "Hello stripe",
  });
}
