type Props = {
  anxiety: number;
  elapsedLabel: string;
  sendCount: number;
  deepNight: boolean;
};

function anxietyLabel(value: number) {
  if (value >= 96) return "破防临界：正在准备发‘哈哈没事’";
  if (value >= 82) return "高危：正在反复解读标点符号";
  if (value >= 58) return "升温：开始频繁打开聊天窗口";
  if (value >= 30) return "轻微：也许对方只是忙";
  return "稳定：你还有完整的体面";
}

export function AnxietyMeter({ anxiety, elapsedLabel, sendCount, deepNight }: Props) {
  return (
    <section className="meter-card" aria-label="焦虑指数">
      <div className="meter-topline">
        <span>焦虑指数</span>
        <strong>{anxiety}%</strong>
      </div>
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${anxiety}%` }} />
      </div>
      <p className="meter-caption">{anxietyLabel(anxiety)}</p>
      <div className="mini-stats">
        <span>
          <b>{elapsedLabel}</b>
          已读时长
        </span>
        <span>
          <b>{sendCount}</b>
          连发消息
        </span>
        <span className={deepNight ? "night active" : "night"}>
          <b>{deepNight ? "ON" : "OFF"}</b>
          深夜加成
        </span>
      </div>
    </section>
  );
}
