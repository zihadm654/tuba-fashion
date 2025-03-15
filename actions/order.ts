"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmation";

import { prisma } from "@/lib/db";
import { resend } from "@/lib/email";

export async function createOrder(discountCode: string, addressId: string) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Calculate total amount from items as a safety check
    if (discountCode) {
      await prisma.discountCode.findUniqueOrThrow({
        where: {
          code: discountCode,
          stock: {
            gte: 1,
          },
        },
      });
    }
    const cart = await prisma.cart.findUniqueOrThrow({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    const { tax, total, discount, payable } = calculateCosts({ cart });
    // Set expected delivery date (7 days from now)
    // const expectedDeliveryDate = new Date();
    // expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);

    // // Calculate price breakdown
    // const itemsPrice = calculatedTotal;
    // const shippingPrice = 0; // You may want to adjust this
    // const taxPrice = 0; // You may want to adjust this
    // const totalPrice = itemsPrice + shippingPrice + (taxPrice || 0);

    // Create order with items in a transaction
    const order = await prisma.order.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        status: "Processing",
        total,
        tax,
        payable,
        discount,
        shipping: 0,
        address: {
          connect: { id: addressId },
        },
        orderItems: {
          create: cart?.items.map((orderItem) => ({
            count: orderItem.count,
            price: orderItem.product.price,
            discount: orderItem.product.discount,
            product: {
              connect: {
                id: orderItem.productId,
              },
            },
          })),
        },
      },
    });
    const users = await prisma.user.findMany();
    const notifications = await prisma.notification.createMany({
      data: users.map((user) => ({
        userId: user.id,
        content: `Order #${order.number} was created was created with a value of $${payable}`,
      })),
    });

    // Send email notifications to admins
    for (const user of users) {
      if (user.email && user.role === "ADMIN") {
        try {
          await resend.emails.send({
            from: "Tuba Fashion <orders@tubafashion.com>",
            to: user.email,
            subject: "New Order Notification",
            react: OrderConfirmationEmail({
              id: order.id,
              payable: payable.toFixed(2),
              orderNum: order.number.toString(),
            }),
          });
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          // Continue with the order process even if email fails
        }
      }
    }

    // Send confirmation email to the customer
    if (session.user.email) {
      try {
        await resend.emails.send({
          from: "Tuba Fashion <orders@tubafashion.com>",
          to: session.user.email,
          subject: "Your Order Confirmation",
          react: OrderConfirmationEmail({
            id: order.id,
            payable: payable.toFixed(2),
            orderNum: order.number.toString(),
          }),
        });
      } catch (emailError) {
        console.error("Error sending customer email:", emailError);
      }
    }

    revalidatePath("/products");
    revalidatePath("/dashboard/orders");

    return { success: true, data: order };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserOrders() {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        address: true,
        payments: true,
        refund: true,
        orderItems: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: orders };
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: error.message };
  }
}

export async function getOrderById(orderId: string) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    if (!orderId) return { success: false, error: "Order ID is required" };

    const order = await prisma.order.findUniqueOrThrow({
      where: {
        userId,
        id: orderId,
      },
      include: {
        address: true,
        discountCode: true,
        user: true,
        payments: {
          include: {
            provider: true,
          },
        },
        orderItems: {
          include: {
            product: { include: { brand: true, categories: true } },
          },
        },
        refund: true,
      },
    });
    return { success: true, data: order };
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return { success: false, error: error.message };
  }
}

function calculateCosts({ cart }: any) {
  let total = 0,
    discount = 0;

  for (const item of cart?.items) {
    total += item?.count * item?.product?.price;
    discount += item?.count * item?.product?.discount;
  }

  const afterDiscount = total - discount;
  const tax = afterDiscount * 0.09;
  const payable = afterDiscount + tax;

  return {
    total: parseFloat(total.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    afterDiscount: parseFloat(afterDiscount.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    payable: parseFloat(payable.toFixed(2)),
  };
}
