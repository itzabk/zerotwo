const Stripe = require("stripe");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const stripe = Stripe(process.env.STRIPE_KEY);
const customError = require("../../utils/customError");
const Order = require("../../model/Order");

// @desc Create payment session
// @route POST /cart/stripe/create-checkout-session/
// @access Private
const paymentSession = asyncErrorHandler(async (req, res) => {
  const { userId } = req.query;
  const cart = req.body;
  const { productId } = cart;
  console.log(productId);
  //customer info
  const customer = await stripe.customers.create({
    metadata: {
      userId: userId,
    },
  });
  //cart items
  const line_items = await cart?.ids?.map((ele) => {
    return {
      price_data: {
        // currency: cart?.entities[ele]?.currency,
        currency: "inr",
        product_data: {
          name: cart?.entities[ele]?.productId.pname,
          images: [cart?.entities[ele]?.productId.pimg],
          metadata: {
            id: ele,
          },
        },
        unit_amount: cart?.entities[ele]?.price * 100,
      },
      quantity: cart?.entities[ele]?.quantity,
    };
  });
  //create session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "IN"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "inr",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 150 * 100,
            currency: "inr",
          },
          display_name: "Next day air",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    customer: customer.id,
    success_url: `${process.env.CLIENT_URL}/products/cart/payment-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart/cancel`,
  });
  res.send({ url: session.url });
});

// @desc handle payment type
// @route POST /cart/stripe/payment-event-hook/
// @access Private
const paymentHook = asyncErrorHandler(async (req, res, next) => {
  const payload = req.body;
  const payloadString = JSON.stringify(payload, null, 2);
  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: process.env.ENDPOINT_SECRET,
  });
  let data;
  let eventType;
  // Check if webhook signing is configured.
  let webhookSecret = process.env.ENDPOINT_SECRET;
  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        payloadString,
        header,
        webhookSecret
      );
    } catch (err) {
      const error = new customError(
        400,
        `⚠️  Webhook signature verification failed:  ${err}`
      );
      return next(error);
    }
    // Extract the object from the event.
    data = event.data.object;
    eventType = event.type;
  } else {
    const err = new customError(400, "Webhook Validation Failed");
    return next(err);
  }
  // Handle the checkout.session.completed event
  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then(async (customer) => {
        try {
          const customerData = {
            email: customer?.email,
            userId: customer?.metadata?.userId,
            phone: customer?.phone,
            shipping: data.shipping_details,
            payment_status: data?.payment_status,
            payment_no: data?.payment_intent,
            payment_amt: data?.amount_total,
          };
          if (data.payment_status === "paid") {
            await Order.create({ ...customerData });
          }
        } catch (err) {
          const error = new customError(400, err?.message);
          return next(error);
        }
      })
      .catch((err) => console.log(err?.message));
  }
  return res.status(200).json({ payment: true });
});

module.exports = { paymentSession, paymentHook };
