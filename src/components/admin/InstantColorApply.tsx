"use client";

import Script from "next/script";

export function InstantColorApply() {
  // Script that runs before React hydrates, using cookies and sessionStorage as fallback
  const scriptContent = `
    (function() {
      // Check if color was already applied by middleware or AdminColorStyle
      if (document.getElementById('primary-color-inline') || 
          document.getElementById('primary-color-blocking') || 
          document.getElementById('primary-color-script')) {
        return; // Already applied
      }
      
      // Try to get color from cookie first (fastest, available immediately)
      let savedColor = null;
      try {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith('primary-color-hsl=')) {
            const cookieValue = cookie.substring('primary-color-hsl='.length);
            try {
              savedColor = decodeURIComponent(cookieValue);
              // Validate format (should be "H S% L%" format)
              if (!/^\\d+\\s+\\d+%\\s+\\d+%$/.test(savedColor)) {
                savedColor = null; // Invalid format, ignore
              }
            } catch (e) {
              // decodeURIComponent failed, cookie might be malformed
              savedColor = null;
            }
            break;
          }
        }
      } catch (e) {
        // Cookie parsing failed
      }
      
      // Fallback to sessionStorage if no cookie
      if (!savedColor) {
        try {
          savedColor = sessionStorage.getItem('primary-color-hsl');
          // Validate format (should be "H S% L%" format)
          if (savedColor && !/^\\d+\\s+\\d+%\\s+\\d+%$/.test(savedColor)) {
            savedColor = null; // Invalid format, ignore
          }
        } catch (e) {
          // sessionStorage not available
        }
      }
      
      if (savedColor) {
        try {
          const root = document.documentElement;
          root.style.setProperty('--primary', savedColor, 'important');
          
          // Also apply to html element directly
          var html = document.getElementsByTagName('html')[0];
          if (html) {
            html.style.setProperty('--primary', savedColor, 'important');
          }
          
          // Inject style tag at the very beginning of head with maximum specificity
          var style = document.createElement('style');
          style.id = 'primary-color-session';
          style.textContent = ':root,:root *,html,html *,body,body *,.preset-admin,.preset-admin *{--primary:' + savedColor + '!important;}';
          
          // Insert immediately - this must be first in head
          if (document.head) {
            if (document.head.firstChild) {
              document.head.insertBefore(style, document.head.firstChild);
            } else {
              document.head.appendChild(style);
            }
          }
        } catch (e) {
          // Error applying color, ignore
        }
      }
    })();
  `;

  return (
    <Script
      id="instant-color-apply"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  );
}
