import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import getCurrentUser from "@/app/actions/getCurrentUser";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { id, title, description, price } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  if (!title || !description || !price ) {
    return NextResponse.json(
      { error: "Title, description, and price are required" },
      { status: 400 }
    );
  }

  try {
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: { title, description, price },
    });

    return NextResponse.json({
      message: "Listing updated successfully",
      updatedListing,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Listing not found or update failed" },
      { status: 400 }
    );
  }
}
