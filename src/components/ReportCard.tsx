import type { PosterResult } from "../lib/poster";

type Props = {
  open: boolean;
  onClose: () => void;
  result: PosterResult;
  onCopy: () => Promise<void>;
  onDownloadPoster: () => Promise<void>;
};

function anxietyGrade(value: number) {
  if (value >= 96) return "尊严离线";
  if (value >= 86) return "标点分析师";
  if (value >= 72) return "反复打开";
  if (value >= 52) return "轻微破防";
  return "体面尚存";
}

export function ReportCard({ open, onClose, result, onCopy, onDownloadPoster }: Props) {
  if (!open) return null;

  const handleCopy = async () => {
    await onCopy();
    window.dispatchEvent(new CustomEvent("seen-zone-toast", { detail: "报告文案已复制，可以发给朋友一起破防。" }));
  };

  const handleDownload = async () => {
    await onDownloadPoster();
    window.dispatchEvent(new CustomEvent("seen-zone-toast", { detail: "海报已生成，适合转发但不保证体面。" }));
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="已读不回报告">
      <div className="report-card">
        <button className="icon-button close" type="button" onClick={onClose} aria-label="关闭报告">
          ×
        </button>

        <div className="report-layout">
          <section className="report-copy">
            <div className="report-kicker">READ RECEIPT REPORT</div>
            <h2>已读不回报告</h2>
            <p className="report-subtitle">一份没有医学依据、但非常真实的社交焦虑化验单。</p>
            <div className="report-grade">
              <span>本次等级</span>
              <strong>{anxietyGrade(result.anxiety)}</strong>
            </div>
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
          </section>

          <aside className="poster-preview" aria-label="分享海报预览">
            <div className="poster-mini-card">
              <span>READ RECEIPT</span>
              <h3>已读不回<br />诊断报告</h3>
              <p>对象：{result.personName}</p>
              <div className="poster-score">{result.anxiety}%</div>
              <small>{anxietyGrade(result.anxiety)} · {result.elapsedLabel}</small>
            </div>
            <p>下载为 PNG，可直接发给朋友或放到 README 截图区。</p>
          </aside>
        </div>

        <div className="report-actions">
          <button type="button" className="primary-button" onClick={handleDownload}>下载分享海报</button>
          <button type="button" className="ghost-button" onClick={handleCopy}>复制报告文案</button>
          <button type="button" className="ghost-button" onClick={onClose}>继续被已读</button>
        </div>
      </div>
    </div>
  );
}
