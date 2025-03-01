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

    // Calculate total amount from items
    const total_amount = items.reduce((acc: number, item: CartItem) => {
      const itemPrice = item.price * (1 - (item.discountPercentage || 0) / 100);
      return acc + itemPrice * item.quantity;
    }, 0);

    const tran_id = Math.floor(100000 + Math.random() * 900000).toString();

    // Create payment log
    await prisma.paymentLog.create({
      data: {
        userId: session.user.id!,
        transactionId: tran_id,
        amount: total_amount,
        status: "PENDING",
        customerName: session?.user?.name!,
        customerEmail: session?.user?.email!,
        customerPhone: shippingDetails.phone,
        shippingAddress: shippingDetails.address,
        items: items,
      },
    });

    const init_url = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

    const formData = new FormData();
    formData.append("store_id", env.STORE_ID);
    formData.append("store_passwd", env.STORE_PASSWORD);
    formData.append("total_amount", total_amount);
    formData.append("currency", "BDT");
    formData.append("tran_id", `${tran_id}`);
    formData.append(
      "success_url",
      `${env.NEXT_PUBLIC_APP_URL}/api/success?id=${tran_id}`,
    );
    formData.append(
      "fail_url",
      `${env.NEXT_PUBLIC_APP_URL}/api/fail?id=${tran_id}`,
    );
    formData.append(
      "cancel_url",
      `${env.NEXT_PUBLIC_APP_URL}/api/cancel?id=${tran_id}`,
    );
    formData.append(
      "ipn_url",
      `${env.NEXT_PUBLIC_APP_URL}/api/ipn?id=${tran_id}`,
    );

    // Set default customer info for testing
    formData.append("cus_name", session?.user?.name!);
    formData.append("cus_email", session?.user?.email!);
    formData.append("cus_add1", shippingDetails.address);
    formData.append("cus_add2", "Test Address 2");
    formData.append("cus_city", shippingDetails.city);
    formData.append("cus_state", "Test State");
    formData.append("cus_postcode", shippingDetails.postcode);
    formData.append("cus_country", "Bangladesh");
    formData.append("cus_phone", shippingDetails.phone);
    formData.append("cus_fax", shippingDetails.phone);
    formData.append("shipping_method", "NO");

    // Set default shipping info
    formData.append("ship_name", session?.user?.name!);
    formData.append("ship_add1", shippingDetails.address);
    formData.append("ship_add2", "Test Address 2");
    formData.append("ship_city", shippingDetails.city);
    formData.append("ship_state", "Test State");
    formData.append("ship_country", "Bangladesh");
    formData.append("ship_postcode", shippingDetails.postcode);

    // Add product details
    formData.append(
      "product_name",
      items.map((item: any) => item.title).join(", "),
    );
    formData.append("product_category", "Mixed");
    formData.append("product_profile", "general");
    formData.append("product_amount", total_amount);

    const requestOptions = { method: "POST", body: formData };
    let SSLRes = await fetch(init_url, requestOptions);
    let SSLResJSON = await SSLRes.json();

    if (!SSLResJSON.status || SSLResJSON.status === "FAILED") {
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
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
