type Props = {
  open: boolean;
  onClose: () => void;
  result: {
    personName: string;
    relation: string;
    elapsedLabel: string;
    anxiety: number;
    sendCount: number;
    brainReplay: number;
    dignity: number;
    conclusion: string;
  };
  onCopy: () => Promise<void>;
};

export function ReportCard({ open, onClose, result, onCopy }: Props) {
  if (!open) return null;

  const handleCopy = async () => {
    await onCopy();
    window.dispatchEvent(new CustomEvent("seen-zone-toast", { detail: "报告已复制，准备让朋友一起破防。" }));
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="已读不回报告">
      <div className="report-card">
        <button className="icon-button close" type="button" onClick={onClose} aria-label="关闭报告">
          ×
        </button>
        <div className="report-kicker">READ RECEIPT REPORT</div>
        <h2>已读不回报告</h2>
        <p className="report-subtitle">一份没有医学依据、但非常真实的社交焦虑化验单。</p>
        <div className="report-grid">
          <span>对象</span>
          <strong>{result.personName} / {result.relation}</strong>
          <span>已读时长</span>
          <strong>{result.elapsedLabel}</strong>
          <span>焦虑指数</span>
          <strong>{result.anxiety}%</strong>
          <span>脑补次数</span>
          <strong>{result.brainReplay}</strong>
          <span>尊严剩余</span>
          <strong>{result.dignity}%</strong>
          <span>连发消息</span>
          <strong>{result.sendCount}</strong>
        </div>
        <p className="report-conclusion">{result.conclusion}</p>
        <div className="report-actions">
          <button type="button" className="primary-button" onClick={handleCopy}>复制报告</button>
          <button type="button" className="ghost-button" onClick={onClose}>继续被已读</button>
        </div>
      </div>
    </div>
  );
}
