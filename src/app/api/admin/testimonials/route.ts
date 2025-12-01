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
    const approved = searchParams.get("approved");

    let query = supabase
      .from("testimonials")
      .select("*");

    if (sectionId) {
      query = query.eq("section_id", sectionId);
    }

    if (approved !== null) {
      query = query.eq("approved", approved === "true");
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
    const { section_id, author_name, author_role, company_name, quote, video_url, avatar_url, approved, position } = body;

    if (!section_id || !author_name || !quote) {
      return NextResponse.json(
        { error: "section_id, author_name, and quote are required" },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase
      .from("testimonials") as any)
      .insert({
        section_id,
        author_name,
        author_role: author_role || null,
        company_name: company_name || null,
        quote,
        video_url: video_url || null,
        avatar_url: avatar_url || null,
        approved: approved !== undefined ? approved : false,
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
