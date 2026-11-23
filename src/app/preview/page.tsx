import type { Metadata } from "next";
import Preview from "@/builder/preview/Preview";

export const metadata: Metadata = {
  title: "Preview · Custom Theme Builder",
};

export default function PreviewPage() {
  return <Preview />;
}
