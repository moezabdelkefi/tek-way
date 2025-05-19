import nodemailer from "nodemailer";
import admin from "firebase-admin";
import * as XLSX from "xlsx";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { subject, message, price } = req.body;

  // Validate required fields (email removed)
  if (!subject || !message || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Step 1: Save order to Firestore
    const newOrder = {
      Date: admin.firestore.FieldValue.serverTimestamp(),
      Subject: subject,
      Message: message,
      Price: price,
    };

    await db.collection("orders").add(newOrder);
    console.log("Order saved to Firestore:", newOrder);

    // Step 2: Fetch all orders and generate Excel
    const ordersSnapshot = await db.collection("orders").get();
    const orders = ordersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Auto-size columns
    if (orders.length > 0) {
      worksheet["!cols"] = Object.keys(orders[0]).map((key) => ({
        wch: Math.max(
          key.length,
          ...orders.map((row) => (row[key] ? row[key].toString().length : 0))
        ),
      }));
    }

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // Step 3: Format the message for the email
    const formattedMessage = message
      .split("\n")
      .map((line) => `<p>${line}</p>`)
      .join("");

    // Step 4: Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "redarcindark@gmail.com",
        pass: "crhg lcuq onht sgzf",
      },
    });

    const mailOptions = {
      from: "redarcindark@gmail.com",
      to: "redarcindark@gmail.com",
      subject: `New Order: ${subject}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Subject:</strong> ${subject}</p>
        ${formattedMessage}
        <p><strong>Price:</strong> ${price}</p>
        <p>See attached Excel file for all orders.</p>
      `,
      attachments: [
        {
          filename: `orders_${new Date().toISOString().split("T")[0]}.xlsx`,
          content: excelBuffer,
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      message: "Order processed successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
