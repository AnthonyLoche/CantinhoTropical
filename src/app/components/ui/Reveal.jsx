"use client";

import { useReveal } from "../../../hooks/useReveal";

export default function Reveal({ children }) {
  const ref = useReveal();
  return <div ref={ref} className="reveal">{children}</div>;
}