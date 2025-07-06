import { NextResponse } from "next/server";

interface TrelloCard {
  name: string;
  desc: string;
  idList: string;
  pos: "top" | "bottom";
}

export async function POST(request: Request) {
  try {
    const { title, answers, clientInfo } = await request.json();

    // Format description for Trello card
    const description = `
# Project Brief

## Client Information
- Name: ${clientInfo.name}
- Email: ${clientInfo.email}
- Company: ${clientInfo.company}

## Project Details
${Object.entries(answers)
  .map(([question, answer]) => `### ${question}\n${answer}`)
  .join("\n\n")}

Created: ${new Date().toISOString()}
    `.trim();

    const card: TrelloCard = {
      name: title,
      desc: description,
      idList: process.env.TRELLO_LIST_ID!,
      pos: "top",
    };

    // Send to Trello API
    const response = await fetch(
      `https://api.trello.com/1/cards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create Trello card");
    }

    const trelloCard = await response.json();

    return NextResponse.json({ cardUrl: trelloCard.shortUrl });
  } catch (error) {
    console.error("Error creating Trello card:", error);
    return NextResponse.json(
      { error: "Failed to create Trello card" },
      { status: 500 },
    );
  }
}
