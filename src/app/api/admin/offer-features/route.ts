import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get("section_id");

    let query = supabase
      .from("offer_features")
      .select("*");

    if (sectionId) {
      query = query.eq("section_id", sectionId);
    }

    const { data, error } = await query.order("position", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { section_id, title, subtitle, description, icon, position } = body;

    if (!section_id || !title) {
      return NextResponse.json(
        { error: "section_id and title are required" },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase
      .from("offer_features") as any)
      .insert({
        section_id,
        title,
        subtitle: subtitle || null,
        description: description || null,
        icon: icon || null,
        position: position ?? 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
