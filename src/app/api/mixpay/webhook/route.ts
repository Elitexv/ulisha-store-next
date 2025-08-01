/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id, status, sign } = body;

  const isValid = verifySignature(body, process.env.MIXPAY_APP_ID!);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (status === "PAID") {
    // TODO: Update your order status in DB
    console.log(`Order ${order_id} was paid.`);
  }

  return NextResponse.json({ success: true });
}

function verifySignature(data: any, appSecret: string) {
  const keys = Object.keys(data)
    .sort()
    .filter((k) => k !== "sign");
  const signStr = keys.map((k) => `${k}=${data[k]}`).join("&") + appSecret;
  const hash = crypto.createHash("md5").update(signStr).digest("hex");
  return hash === data.sign;
}
