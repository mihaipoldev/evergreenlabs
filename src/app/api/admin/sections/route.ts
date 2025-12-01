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
    const pageId = searchParams.get("page_id");

    let query = supabase
      .from("sections")
      .select("*");

    if (pageId) {
      query = query.eq("page_id", pageId);
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
    const { page_id, type, title, subtitle, content, position, visible } = body;

    if (!page_id || !type) {
      return NextResponse.json(
        { error: "page_id and type are required" },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase
      .from("sections") as any)
      .insert({
        page_id,
        type,
        title: title || null,
        subtitle: subtitle || null,
        content: content || null,
        position: position ?? 0,
        visible: visible !== undefined ? visible : true,
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
