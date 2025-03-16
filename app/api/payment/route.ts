import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { CartItem } from "@/utils/cart";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, shippingDetails } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty cart items" },
        { status: 400 },
      );
    }

    // Validate shipping details
    if (
      !shippingDetails ||
      !shippingDetails.address ||
      !shippingDetails.phone
    ) {
      return NextResponse.json(
        { error: "Shipping details are required" },
        { status: 400 },
      );
    }

    // Calculate total amount from items
    const total_amount = items.reduce((acc: number, item: CartItem) => {
      const itemPrice = item.price * (1 - (item.discount || 0) / 100);
      return acc + itemPrice * item.quantity;
    }, 0);

    // Generate a more unique transaction ID
    const refId = `TF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create payment log with properly structured data
    // await prisma.payment.create({
    //   data: {
    //     userId: session.user.id!,
    //     refId: refId,
    //     payable: total_amount,
    //     status: "PENDING",
    //     customerName: session?.user?.name || "Customer",
    //     customerEmail: session?.user?.email || "customer@example.com",
    //     customerPhone: shippingDetails.phone,
    //     shippingAddress: {
    //       fullName:
    //         shippingDetails.fullName || session?.user?.name || "Customer",
    //       address: shippingDetails.address,
    //       city: shippingDetails.city || "Unknown",
    //       postalCode: shippingDetails.postcode || "Unknown",
    //       country: shippingDetails.country || "Bangladesh",
    //       phone: shippingDetails.phone,
    //     },
    //     items: items.map((item: CartItem) => ({
    //       id: item.id,
    //       title: item.title,
    //       price: item.price * (1 - (item.discount || 0) / 100),
    //       quantity: item.quantity,
    //       color: item.color || null,
    //       size: item.size || null,
    //       image: item.image || "",
    //     })),
    //   },
    // });

    // Rest of your payment gateway integration code
    const init_url = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

    const formData = new FormData();
    formData.append("store_id", env.STORE_ID);
    formData.append("store_passwd", env.STORE_PASSWORD);
    formData.append("total_amount", total_amount.toString());
    formData.append("currency", "BDT");
    formData.append("tran_id", refId);

    // Use absolute URLs for callbacks
    const baseUrl = env.NEXT_PUBLIC_APP_URL;
    formData.append("success_url", `${baseUrl}/api/success?id=${refId}`);
    formData.append("fail_url", `${baseUrl}/api/fail?id=${refId}`);
    formData.append("cancel_url", `${baseUrl}/api/cancel?id=${refId}`);
    formData.append("ipn_url", `${baseUrl}/api/ipn?id=${refId}`);

    // Customer info
    formData.append("cus_name", session?.user?.name || "Customer");
    formData.append(
      "cus_email",
      session?.user?.email || "customer@example.com",
    );
    formData.append("cus_add1", shippingDetails.address);
    formData.append("cus_add2", shippingDetails.address2 || "");
    formData.append("cus_city", shippingDetails.city || "Unknown");
    formData.append("cus_state", shippingDetails.state || "Unknown");
    formData.append("cus_postcode", shippingDetails.postcode || "Unknown");
    formData.append("cus_country", shippingDetails.country || "Bangladesh");
    formData.append("cus_phone", shippingDetails.phone);
    formData.append("cus_fax", shippingDetails.phone);
    formData.append("shipping_method", "NO");

    // Shipping info
    formData.append(
      "ship_name",
      shippingDetails.fullName || session?.user?.name || "Customer",
    );
    formData.append("ship_add1", shippingDetails.address);
    formData.append("ship_add2", shippingDetails.address2 || "");
    formData.append("ship_city", shippingDetails.city || "Unknown");
    formData.append("ship_state", shippingDetails.state || "Unknown");
    formData.append("ship_country", shippingDetails.country || "Bangladesh");
    formData.append("ship_postcode", shippingDetails.postcode || "Unknown");

    // Product details
    formData.append(
      "product_name",
      items.map((item: any) => item.title).join(", "),
    );
    formData.append("product_category", "Mixed");
    formData.append("product_profile", "general");
    formData.append("product_amount", total_amount.toString());

    // Make request to payment gateway
    const requestOptions = { method: "POST", body: formData };
    const SSLRes = await fetch(init_url, requestOptions);
    const SSLResJSON = await SSLRes.json();

    if (!SSLResJSON.status || SSLResJSON.status === "FAILED") {
      // Update payment log to FAILED status
      await prisma.payment.update({
        where: { refId: refId },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        { error: SSLResJSON.failedreason || "Payment initialization failed" },
        { status: 400 },
      );
    }

    // Process the gateways from SSL Commerz response
    const gateways = SSLResJSON.desc || [];
    const processedGateways = gateways.map((gateway: any) => ({
      name: gateway.name || "",
      type: gateway.type || "",
      logo: gateway.logo || "",
      gw: gateway.gw || "",
      r_flag: gateway.r_flag || "0",
      redirectGatewayURL: gateway.redirectGatewayURL || "",
    }));

    return NextResponse.json({
      data: {
        status: SSLResJSON.status,
        desc: processedGateways,
        transactionId: refId,
      },
    });
  } catch (e: any) {
    console.error("Payment initialization error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
