"use client";

import { useState } from "react";
import { Icon } from "../Icon";
import { UnitInput } from "./UnitInput";

type Kind = "margin" | "padding";
type Side = "Top" | "Right" | "Bottom" | "Left";
const SIDES: Side[] = ["Top", "Right", "Bottom", "Left"];

interface Props {
  get: (prop: string) => string;
  set: (patch: Record<string, string>) => void;
  placeholderOf: (prop: string) => string;
}

/** Visual box-model editor for margin + padding; each ring can link its four sides. */
export function BoxModel({ get, set, placeholderOf }: Props) {
  const [linked, setLinked] = useState<Record<Kind, boolean>>({ margin: false, padding: false });
  const input = (kind: Kind, side: Side) => {
    const prop = kind + side;
    const onChange = (v: string) => set(linked[kind] ? Object.fromEntries(SIDES.map((s) => [kind + s, v])) : { [prop]: v });
    return (
      <div className="b-bm-input">
        <UnitInput value={get(prop)} onChange={onChange} placeholder={placeholderOf(prop) || "0"} />
      </div>
    );
  };
  const tag = (kind: Kind) => (
    <span className="b-bm-tag">
      {kind}
      <button className={linked[kind] ? "on" : ""} title="Link all sides" onClick={() => setLinked({ ...linked, [kind]: !linked[kind] })}>
        <Icon name="link2" size={11} />
      </button>
    </span>
  );
  return (
    <div className="b-boxmodel">
      <div className="b-bm-margin">
        {tag("margin")}
        <div className="b-bm-top">{input("margin", "Top")}</div>
        <div className="b-bm-mid">
          {input("margin", "Left")}
          <div className="b-bm-padding">
            {tag("padding")}
            <div className="b-bm-top">{input("padding", "Top")}</div>
            <div className="b-bm-mid">
              {input("padding", "Left")}
              <div className="b-bm-core" />
              {input("padding", "Right")}
            </div>
            <div className="b-bm-top">{input("padding", "Bottom")}</div>
          </div>
          {input("margin", "Right")}
        </div>
        <div className="b-bm-top">{input("margin", "Bottom")}</div>
      </div>
    </div>
  );
}
