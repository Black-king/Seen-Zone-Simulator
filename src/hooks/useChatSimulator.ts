import { useEffect, useMemo, useRef, useState } from "react";
import { calmLines, defaultUserMessages, systemHints } from "../data/copy";
import { momentLikeLines, presenceLines, randomScenes, sceneHints, voiceLines, RandomScene } from "../data/randomEvents";
import { RelationshipKey, relationshipModes } from "../data/relationshipModes";
import { downloadReportPoster, PosterResult } from "../lib/poster";
import { clamp, formatTime, pick, wait } from "../lib/random";
import { playUISound, UISound } from "../lib/sound";

export type MessageKind = "text" | "typing" | "seen" | "recall" | "hint" | "fake";
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
  const [calmNotice, setCalmNotice] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem("seen-zone-sound");
    return stored ? stored === "on" : true;
  });
  const runRef = useRef(0);

  const deepNight = useMemo(() => isDeepNight(), []);
  const anxiety = clamp(
    mode.baseAnxiety + sendCount * 6 + elapsed * (deepNight ? 1.15 : 0.72),
    0,
    100
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("seen-zone-sound", soundEnabled ? "on" : "off");
    }
  }, [soundEnabled]);

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

  const playSound = (sound: UISound) => {
    if (!soundEnabled) return;
    void playUISound(sound);
  };

  const pushMessage = (message: Omit<ChatMessage, "id" | "at">) => {
    setMessages((list) => [...list, { ...message, id: id(), at: nowLabel() }]);
  };

  const pushSystem = (text: string, kind: MessageKind = "hint") => {
    pushMessage({ kind, side: "system", text });
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

  const runScene = async (runId: number, scene: RandomScene) => {
    const alive = () => runRef.current === runId;
    switch (scene) {
      case "quickTyping": {
        setStatus("typing");
        playSound("typing");
        await wait(420 + Math.random() * 380);
        if (!alive()) return;
        pushSystem(pick(sceneHints.quickTyping));
        setStatus("silence");
        break;
      }
      case "longTyping": {
        setStatus("typing");
        playSound("typing");
        await wait(700 + Math.random() * 500);
        if (!alive()) return;
        pushSystem(pick(sceneHints.longTyping));
        await wait(480);
        if (!alive()) return;
        setCalmNotice("对方正在输入的时间，已经长到像在写论文。");
        setStatus("silence");
        break;
      }
      case "onlineOffline": {
        const online = Math.random() > 0.45;
        pushSystem(pick(online ? presenceLines.online : presenceLines.offline), "seen");
        playSound("presence");
        maybeVibrate(12);
        setStatus("silence");
        break;
      }
      case "momentLike": {
        pushSystem(pick(momentLikeLines));
        playSound("presence");
        setStatus("silence");
        break;
      }
      case "voiceGhost": {
        setStatus("typing");
        playSound("typing");
        pushSystem(pick(voiceLines));
        await wait(700 + Math.random() * 400);
        if (!alive()) return;
        pushSystem("语音转文字失败，失败原因：情绪太多。", "recall");
        playSound("seen");
        setStatus("silence");
        break;
      }
      case "halfRecall": {
        setStatus("recall");
        playSound("recall");
        pushMessage({ kind: "fake", side: "them", text: `${pick(mode.fakeReplies)}……` });
        await wait(420 + Math.random() * 260);
        if (!alive()) return;
        setMessages((list) => list.slice(0, -1));
        pushSystem(pick(mode.recallLines), "recall");
        setStatus("silence");
        break;
      }
      case "delayedExcuse": {
        pushSystem(pick(sceneHints.delayedExcuse));
        playSound("alert");
        await wait(320);
        if (!alive()) return;
        setCalmNotice("消息已进入“稍后再说”队列。");
        setStatus("silence");
        break;
      }
    }
  };

  const runRandomSequence = async (runId: number) => {
    const alive = () => runRef.current === runId;
    const totalScenes = Math.random() > 0.66 ? 2 : 1;
    const scenes = [...randomScenes].sort(() => Math.random() - 0.5).slice(0, totalScenes);

    for (const scene of scenes) {
      if (!alive()) return;
      await wait(250 + Math.random() * 650);
      if (!alive()) return;
      await runScene(runId, scene);
    }
  };

  const simulateAfterSend = async (runId: number, projectedSendCount: number) => {
    const alive = () => runRef.current === runId;

    setStatus("sending");
    playSound("send");
    await wait(480);
    if (!alive()) return;

    setStatus("typing");
    const typingId = addTyping();
    playSound("typing");
    maybeVibrate(18);
    await wait(3000);
    if (!alive()) return;
    removeMessage(typingId);

    setStatus("seen");
    pushSystem(`${personName} ${mode.seenLabel}`, "seen");
    playSound("seen");
    maybeVibrate([20, 40, 20]);
    await wait(850);
    if (!alive()) return;

    setStatus("silence");
    pushSystem(pick([...mode.hints, ...systemHints]));

    const roll = Math.random();
    if (roll > 0.32) {
      await wait(1000 + Math.random() * 1200);
      if (!alive()) return;
      await runRandomSequence(runId);
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
      playSound("calm");
      setCalmNotice(pick(calmLines));
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
    setCalmNotice(null);
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
    calmNotice,
    result,
    shareText,
    copyReport,
    downloadPoster,
    soundEnabled,
    setSoundEnabled,
    send,
    reset
  };
}
