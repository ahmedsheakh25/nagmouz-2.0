import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const { title, answers, clientInfo } = await request.json();

    // Create a PDF document
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    // Collect PDF data chunks
    doc.on("data", (chunk) => buffers.push(chunk));

    // Add content to PDF
    doc.fontSize(24).text("Project Brief", { align: "center" });
    doc.moveDown();
    doc.fontSize(18).text(title);
    doc.moveDown();

    // Client Information
    doc.fontSize(14).text("Client Information");
    doc.fontSize(12);
    doc.text(`Name: ${clientInfo.name}`);
    doc.text(`Email: ${clientInfo.email}`);
    doc.text(`Company: ${clientInfo.company}`);
    doc.moveDown();

    // Project Answers
    doc.fontSize(14).text("Project Details");
    doc.fontSize(12);
    Object.entries(answers).forEach(([question, answer]) => {
      doc.text(question);
      doc.text(answer as string);
      doc.moveDown();
    });

    // Finalize PDF
    doc.end();

    // Convert to Buffer
    const pdfBuffer = Buffer.concat(buffers);

    // Upload to Supabase Storage
    const timestamp = Date.now();
    const fileName = `briefs/${timestamp}-${title.toLowerCase().replace(/\s+/g, "-")}.pdf`;

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        cacheControl: "3600",
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("documents").getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
