"use client";

import { useEffect, useRef } from "react";

/**
 * Renders whatever embed snippet Hospitable gives you for a property's
 * direct-booking widget (usually an <iframe> or a <div> + <script> pair).
 *
 * We can't just dangerouslySetInnerHTML the code, because browsers do not
 * execute <script> tags that are inserted that way. Instead we parse the
 * snippet, rebuild any <script> tags as real script elements, and append
 * everything to the DOM so it runs like it would on a normal HTML page.
 */
export default function HospitableEmbed({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";
    if (!code || !code.trim()) return;

    const template = document.createElement("template");
    template.innerHTML = code.trim();
    const fragment = template.content;

    fragment.querySelectorAll("script").forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.text = oldScript.textContent || "";
      oldScript.replaceWith(newScript);
    });

    container.appendChild(fragment);
  }, [code]);

  if (!code || !code.trim()) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-sand-100 p-8 text-center text-sm text-ink-500">
        Direct booking isn&apos;t connected for this property yet. Paste this
        property&apos;s Hospitable direct-booking embed code in the admin
        panel to enable live booking here.
      </div>
    );
  }

  // No fixed min-height here: a real Hospitable widget (iframe/script) sets
  // its own height once it loads, and a simple fallback link (see the admin
  // panel's Hospitable field) is only a couple lines tall. Forcing a fixed
  // minimum here left a tall empty box under short content like a link.
  return <div ref={containerRef} className="hospitable-embed" />;
}
