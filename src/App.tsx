import type { CSSProperties, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { openingMessages } from "./data/copy";
import { AnxietyMeter } from "./components/AnxietyMeter";
import { MessageBubble } from "./components/MessageBubble";
import { RelationshipSelector } from "./components/RelationshipSelector";
import { ReportCard } from "./components/ReportCard";
import { TypingIndicator } from "./components/TypingIndicator";
import { useChatSimulator } from "./hooks/useChatSimulator";

function Toast() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<string>;
      setMessage(custom.detail);
      window.setTimeout(() => setMessage(""), 2600);
    };
    window.addEventListener("seen-zone-toast", handler);
    return () => window.removeEventListener("seen-zone-toast", handler);
  }, []);

  return <div className={`toast ${message ? "show" : ""}`}>{message}</div>;
}

function App() {
  const simulator = useChatSimulator();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [simulator.messages.length]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    simulator.send();
  };

  return (
    <main className="app-shell" style={{ "--accent": simulator.mode.accent } as CSSProperties}>
      <div className="noise" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      <section className="hero-panel">
        <div className="eyebrow">
          <span className="live-dot" />
          VIBECODING TOY · OPEN SOURCE
        </div>
        <div className="hero-copy">
          <h1>
            Seen Zone
            <span>Simulator</span>
          </h1>
          <p>
            已读不回模拟器：你发送消息，对方正在输入，然后世界归于平静。
          </p>
        </div>
        <div className="manifesto-card">
          <span>今日治疗项目</span>
          <strong>{openingMessages[new Date().getSeconds() % openingMessages.length]}</strong>
        </div>
        <div className="hero-tags">
          <span>社死</span>
          <span>焦虑</span>
          <span>整蛊朋友</span>
          <span>可分享海报</span>
          <span>轻度疗愈</span>
        </div>
      </section>

      <section className="simulator-layout">
        <aside className="control-panel">
          <div className="panel-heading">
            <span>01</span>
            <h2>设置你的沉默对象</h2>
          </div>

          <label className="field-label" htmlFor="person-name">对方名字</label>
          <input
            id="person-name"
            className="text-field"
            value={simulator.personName}
            onChange={(event) => simulator.setPersonName(event.target.value)}
            placeholder="例如：暧昧对象 / 老板 / 甲方"
          />

          <label className="field-label">关系模式</label>
          <RelationshipSelector value={simulator.relationship} onChange={simulator.setRelationship} />

          <AnxietyMeter
            anxiety={simulator.anxiety}
            elapsedLabel={simulator.elapsedLabel}
            sendCount={simulator.sendCount}
            deepNight={simulator.deepNight}
          />

          <div className="control-actions">
            <button className="ghost-button" type="button" onClick={() => simulator.setReportOpen(true)}>
              生成报告
            </button>
            <button className="ghost-button danger" type="button" onClick={simulator.reset}>
              清空体面
            </button>
          </div>
        </aside>

        <section className="phone-frame" aria-label="聊天模拟器">
          <div className="phone-statusbar">
            <span>01:36</span>
            <span>Seen Zone</span>
            <span>97%</span>
          </div>

          <header className="chat-header">
            <div className="avatar" aria-hidden="true">{simulator.mode.emoji}</div>
            <div>
              <strong>{simulator.personName || simulator.mode.defaultName}</strong>
              <small>
                {simulator.status === "typing" ? (
                  <>
                    正在输入 <TypingIndicator />
                  </>
                ) : simulator.status === "seen" ? "已读你的尊严" : "在线，但像离线"}
              </small>
            </div>
            <button className="icon-button" type="button" onClick={() => simulator.setReportOpen(true)} aria-label="打开报告">
              ⌁
            </button>
          </header>

          <div className="chat-body">
            {simulator.messages.length === 0 ? (
              <div className="empty-state">
                <span>未发送</span>
                <h3>先发一句试试。</h3>
                <p>模拟器会认真复现“对方正在输入 3 秒，然后已读不回”的全过程。</p>
              </div>
            ) : (
              simulator.messages.map((message) => <MessageBubble key={message.id} message={message} />)
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="composer" onSubmit={handleSubmit}>
            <input
              value={simulator.draft}
              onChange={(event) => simulator.setDraft(event.target.value)}
              placeholder="输入一句会被已读的话……"
              maxLength={80}
            />
            <button className="send-button" type="submit" disabled={!simulator.draft.trim()}>
              发送
            </button>
          </form>
        </section>
      </section>

      <footer className="site-footer">
        <span>Built for people who overthink read receipts.</span>
        <a href="https://github.com/" target="_blank" rel="noreferrer">Star-ready on GitHub</a>
      </footer>

      <ReportCard
        open={simulator.reportOpen}
        onClose={() => simulator.setReportOpen(false)}
        result={simulator.result}
        onCopy={simulator.copyReport}
        onDownloadPoster={simulator.downloadPoster}
      />
      <Toast />
    </main>
  );
}

export default App;






