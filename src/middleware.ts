import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Set pathname in headers for layout to use
  supabaseResponse.headers.set("x-pathname", pathname);

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!user) {
      // Redirect to login if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // For admin pages, inject color style tag into HTML response
    if (pathname !== "/admin/login") {
      try {
        // Get user settings with active theme
        const { data: settings } = await (supabase
          .from("user_settings") as any)
          .select("active_theme_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (settings?.active_theme_id) {
          // Get theme with primary color
          const { data: theme } = await (supabase
            .from("user_themes") as any)
            .select("primary_color_id")
            .eq("id", settings.active_theme_id)
            .single();

          if (theme?.primary_color_id) {
            // Get color details
            const { data: color } = await (supabase
              .from("user_colors") as any)
              .select("hsl_h, hsl_s, hsl_l, hex")
              .eq("id", theme.primary_color_id)
              .single();

            if (color) {
              const primaryValue = `${color.hsl_h} ${color.hsl_s}% ${color.hsl_l}%`;
              
              // Set cookie for instant access on next page load
              // Note: Next.js cookies.set() automatically encodes the value
              try {
                const expires = new Date();
                expires.setFullYear(expires.getFullYear() + 1);
                supabaseResponse.cookies.set('primary-color-hsl', primaryValue, {
                  expires: expires,
                  path: '/',
                  sameSite: 'lax',
                });
              } catch {
                // Silently ignore cookie setting errors - non-critical
              }
              
              // Inject style tag AND blocking script as the ABSOLUTE FIRST thing in head
              // This must come before ANY other tags (meta, link, style, etc.)
              // Blocking script that runs IMMEDIATELY when HTML starts parsing
              // This applies color to documentElement synchronously, before ANY CSS loads
              const blockingScript = `<script>!function(){var d=document,r=d.documentElement;if(r){r.style.setProperty('--primary','${primaryValue}','important');}var s=d.createElement('style');s.id='primary-color-blocking';s.textContent=':root,:root *,html,html *,body,body *{--primary:${primaryValue}!important;}';if(d.head){d.head.insertBefore(s,d.head.firstChild);}else{var a=0;function c(){a++;if(d.head){d.head.insertBefore(s,d.head.firstChild);}else if(a<100){c();}}c();}try{var e=new Date();e.setFullYear(e.getFullYear()+1);document.cookie='primary-color-hsl='+encodeURIComponent('${primaryValue}')+'; expires='+e.toUTCString()+'; path=/; SameSite=Lax';}catch(x){}}();</script>`;
              const styleTag = `<style id="primary-color-inline">:root,:root *,html,html *,body,body *{--primary:${primaryValue}!important;}</style>`;
              const injection = blockingScript + styleTag;

              let buffer = "";
              let headInjected = false;

              const stream = new TransformStream({
                transform(chunk, controller) {
                  const text = new TextDecoder().decode(chunk);
                  buffer += text;
                  
                  if (!headInjected) {
                    // CRITICAL: Inject as the ABSOLUTE FIRST thing after <head>
                    const headMatch = buffer.match(/<head[^>]*>/i);
                    if (headMatch) {
                      const headIndex = buffer.indexOf(headMatch[0]);
                      const afterHead = headIndex + headMatch[0].length;
                      // Inject blocking script + style tag immediately after <head>
                      buffer = buffer.slice(0, afterHead) + injection + buffer.slice(afterHead);
                      headInjected = true;
                    }
                    // Fallback: inject before ANY other tag
                    else {
                      const anyTagMatch = buffer.match(/<[^/!][^>]*>/i);
                      if (anyTagMatch && !anyTagMatch[0].match(/^<html|^<head|^<body/i)) {
                        const matchIndex = buffer.indexOf(anyTagMatch[0]);
                        buffer = buffer.slice(0, matchIndex) + injection + buffer.slice(matchIndex);
                        headInjected = true;
                      }
                    }
                  }
                  
                  // Flush buffer if we've injected or buffer is getting large
                  if (headInjected || buffer.length > 8192) {
                    controller.enqueue(new TextEncoder().encode(buffer));
                    buffer = "";
                  }
                },
                flush(controller) {
                  if (buffer) {
                    // Last chance: inject if we haven't yet
                    if (!headInjected) {
                      if (/<head[^>]*>/i.test(buffer)) {
                        buffer = buffer.replace(/(<head[^>]*>)/i, `$1${injection}`);
                      } else if (/<html[^>]*>/i.test(buffer)) {
                        // If head doesn't exist, try to inject after html tag
                        buffer = buffer.replace(/(<html[^>]*>)/i, `$1${injection}`);
                      }
                    }
                    controller.enqueue(new TextEncoder().encode(buffer));
                  }
                },
              });

              return new NextResponse(stream.readable, {
                headers: supabaseResponse.headers,
                status: supabaseResponse.status,
              });
            }
          }
        }
      } catch {
        // Silently ignore middleware injection errors
      }
    }
  }

  // Redirect authenticated users away from login page
  if (pathname === "/login") {
    if (user) {
      // Redirect to admin dashboard if already authenticated
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

