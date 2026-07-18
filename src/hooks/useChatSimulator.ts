import { useEffect, useMemo, useRef, useState } from "react";
import { calmLines, defaultUserMessages, systemHints } from "../data/copy";
import { RelationshipKey, relationshipModes } from "../data/relationshipModes";
import { downloadReportPoster, PosterResult } from "../lib/poster";
import { clamp, formatTime, pick, wait } from "../lib/random";

export type MessageKind = "text" | "typing" | "seen" | "recall" | "hint" | "fake" | "calm";
export type MessageSide = "me" | "them" | "system";

export type ChatMessage = {
  id: string;
  kind: MessageKind;
  side: MessageSide;
  text: string;
  at: string;
};

export type SimulatorStatus = "idle" | "sending" | "typing" | "seen" | "silence" | "recall" | "calm";

const nowLabel = () =>
  new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());

const id = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function isDeepNight() {
  const hour = new Date().getHours();
  return hour >= 23 || hour < 5;
}

export function useChatSimulator() {
  const [relationship, setRelationship] = useState<RelationshipKey>("crush");
  const mode = relationshipModes[relationship];
  const [personName, setPersonName] = useState(mode.defaultName);
  const [draft, setDraft] = useState(pick(defaultUserMessages));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<SimulatorStatus>("idle");
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sendCount, setSendCount] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const runRef = useRef(0);

  const deepNight = useMemo(() => isDeepNight(), []);
  const anxiety = clamp(
    mode.baseAnxiety + sendCount * 6 + elapsed * (deepNight ? 1.15 : 0.72),
    0,
    100
  );

  useEffect(() => {
    setPersonName((current) => {
      const defaults = Object.values(relationshipModes).map((item) => item.defaultName);
      return defaults.includes(current) ? mode.defaultName : current;
    });
  }, [mode]);

  useEffect(() => {
    if (!started) return;
    const tick = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(tick);
  }, [started]);

  const pushMessage = (message: Omit<ChatMessage, "id" | "at">) => {
    setMessages((list) => [...list, { ...message, id: id(), at: nowLabel() }]);
  };

  const addTyping = () => {
    const typingId = `typing-${id()}`;
    setMessages((list) => [
      ...list,
      { id: typingId, kind: "typing", side: "them", text: `${personName} 正在输入`, at: nowLabel() }
    ]);
    return typingId;
  };

  const removeMessage = (messageId: string) => {
    setMessages((list) => list.filter((message) => message.id !== messageId));
  };

  const maybeVibrate = (pattern: number | number[]) => {
    if ("vibrate" in navigator) navigator.vibrate(pattern);
  };

  const simulateAfterSend = async (runId: number, projectedSendCount: number) => {
    const alive = () => runRef.current === runId;

    setStatus("sending");
    await wait(480);
    if (!alive()) return;

    setStatus("typing");
    const typingId = addTyping();
    maybeVibrate(18);
    await wait(3000);
    if (!alive()) return;
    removeMessage(typingId);

    setStatus("seen");
    pushMessage({ kind: "seen", side: "system", text: `${personName} ${mode.seenLabel}` });
    maybeVibrate([20, 40, 20]);
    await wait(850);
    if (!alive()) return;

    setStatus("silence");
    pushMessage({ kind: "hint", side: "system", text: pick([...mode.hints, ...systemHints]) });

    const roll = Math.random();
    if (roll > 0.42) {
      await wait(1400 + Math.random() * 1800);
      if (!alive()) return;
      setStatus("typing");
      const secondTypingId = addTyping();
      await wait(1200 + Math.random() * 1000);
      if (!alive()) return;
      removeMessage(secondTypingId);

      if (Math.random() > 0.52) {
        setStatus("recall");
        pushMessage({ kind: "fake", side: "them", text: `${pick(mode.fakeReplies)}……` });
        await wait(520);
        if (!alive()) return;
        setMessages((list) => list.slice(0, -1));
        pushMessage({ kind: "recall", side: "system", text: pick(mode.recallLines) });
      } else {
        pushMessage({ kind: "hint", side: "system", text: "对方正在输入过，也停止输入过。你被完整地悬置过。" });
      }
      setStatus("silence");
    }

    const projectedAnxiety = clamp(
      mode.baseAnxiety + projectedSendCount * 6 + elapsed * (deepNight ? 1.15 : 0.72),
      0,
      100
    );
    if (projectedAnxiety > 96 || projectedSendCount >= 5) {
      await wait(900);
      if (!alive()) return;
      setStatus("calm");
      pushMessage({ kind: "calm", side: "system", text: pick(calmLines) });
    }
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const nextSendCount = sendCount + 1;
    setStarted(true);
    setSendCount(nextSendCount);
    pushMessage({ kind: "text", side: "me", text });
    setDraft("");
    void simulateAfterSend(++runRef.current, nextSendCount);
  };

  const reset = () => {
    runRef.current += 1;
    setMessages([]);
    setStatus("idle");
    setStarted(false);
    setElapsed(0);
    setSendCount(0);
    setDraft(pick(defaultUserMessages));
    setReportOpen(false);
  };

  const result: PosterResult = {
    personName,
    relation: mode.label,
    elapsedLabel: formatTime(elapsed),
    anxiety: Math.round(anxiety),
    sendCount,
    brainReplay: Math.max(1, Math.round(elapsed * 1.8 + sendCount * 5)),
    dignity: Math.max(0, 100 - Math.round(anxiety)),
    conclusion:
      anxiety > 92
        ? "最终状态：假装无事发生，但截图已经准备好了。"
        : anxiety > 70
          ? "最终状态：开始检查朋友圈，但仍保留体面。"
          : "最终状态：还算稳定，只是轻微破防。"
  };

  const shareText = `【已读不回报告】\n对象：${result.personName}（${result.relation}）\n已读时长：${result.elapsedLabel}\n焦虑指数：${result.anxiety}%\n脑补次数：${result.brainReplay}\n尊严剩余：${result.dignity}%\n${result.conclusion}\n\n来自 Seen Zone Simulator / 已读不回模拟器`;

  const copyReport = async () => {
    await navigator.clipboard?.writeText(shareText);
  };

  const downloadPoster = async () => {
    await downloadReportPoster(result, mode.accent);
  };

  return {
    relationship,
    setRelationship,
    mode,
    personName,
    setPersonName,
    draft,
    setDraft,
    messages,
    status,
    elapsed,
    elapsedLabel: formatTime(elapsed),
    sendCount,
    anxiety: Math.round(anxiety),
    deepNight,
    reportOpen,
    setReportOpen,
    result,
    shareText,
    copyReport,
    downloadPoster,
    send,
    reset
  };
}
