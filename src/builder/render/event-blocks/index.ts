import type { ReactNode } from "react";
import type { EventSource } from "../../eventData/types";
import type { EventBlockProps } from "./types";
import { SpeakersBlock } from "./SpeakersBlock";
import { SponsorsBlock } from "./SponsorsBlock";
import { TicketsBlock } from "./TicketsBlock";
import { SessionsBlock } from "./SessionsBlock";

export type { EventBlockProps };

export const EVENT_BLOCKS: Record<EventSource, (b: EventBlockProps) => ReactNode> = {
  speakers: SpeakersBlock,
  sponsors: SponsorsBlock,
  tickets: TicketsBlock,
  sessions: SessionsBlock,
};
