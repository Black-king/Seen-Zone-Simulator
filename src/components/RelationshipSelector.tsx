import type { CSSProperties } from "react";
import { modeList, RelationshipKey } from "../data/relationshipModes";

type Props = {
  value: RelationshipKey;
  onChange: (value: RelationshipKey) => void;
};

export function RelationshipSelector({ value, onChange }: Props) {
  return (
    <div className="relation-grid" role="radiogroup" aria-label="选择关系模式">
      {modeList.map((mode) => (
        <button
          key={mode.key}
          type="button"
          className={`relation-chip ${value === mode.key ? "active" : ""}`}
          style={{ "--chip-accent": mode.accent } as CSSProperties}
          onClick={() => onChange(mode.key)}
          aria-pressed={value === mode.key}
        >
          <span className="chip-emoji">{mode.emoji}</span>
          <span>
            <strong>{mode.label}</strong>
            <small>{mode.subtitle}</small>
          </span>
        </button>
      ))}
    </div>
  );
}
