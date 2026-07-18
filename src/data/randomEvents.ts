export type RandomScene =
  | "quickTyping"
  | "longTyping"
  | "onlineOffline"
  | "momentLike"
  | "voiceGhost"
  | "halfRecall"
  | "delayedExcuse";

export const randomScenes: RandomScene[] = [
  "quickTyping",
  "longTyping",
  "onlineOffline",
  "momentLike",
  "voiceGhost",
  "halfRecall",
  "delayedExcuse"
];

export const sceneHints: Record<RandomScene, string[]> = {
  quickTyping: [
    "对方正在输入 0.5 秒，然后把宇宙关掉了。",
    "输入框亮了一下，像希望，也像误触。",
    "对方短暂经过了你的聊天窗口，没有留下回复。"
  ],
  longTyping: [
    "对方正在输入了很久，久到你开始原谅所有错别字。",
    "那串省略号持续了 10 秒，最后什么也没有发生。",
    "你目睹了一场没有结果的文字分娩。"
  ],
  onlineOffline: [
    "对方上线了。对方下线了。你在线崩溃了。",
    "头像亮了一下，又暗了。像命运把灯关了。",
    "对方经过互联网，但没有经过你。"
  ],
  momentLike: [
    "对方点赞了朋友圈，但没有回你消息。证据确凿。",
    "动态有更新，聊天框没有。你开始理解侦探职业。",
    "对方活着，且选择不回复你。"
  ],
  voiceGhost: [
    "对方显示语音转文字中，然后消失。",
    "一条语音差点抵达，最后抵达了你的焦虑。",
    "对方可能说了很多，也可能什么都没说。"
  ],
  halfRecall: [
    "对方撤回了半句话，留下完整的一夜。",
    "你没看到内容，但已经在脑内生成 12 个版本。",
    "撤回的是消息，不是你的脑补。"
  ],
  delayedExcuse: [
    "系统提示：稍后回复，通常约等于来世回复。",
    "对方可能在忙，也可能在研究如何不忙着回复你。",
    "你的消息已加入一个没有排队号的队列。"
  ]
};

export const presenceLines = {
  online: ["对方上线了", "对方短暂出现", "对方的头像亮了一下"],
  offline: ["对方离线了", "对方又消失了", "对方退出了你的精神现场"]
};

export const voiceLines = [
  "语音转文字中……",
  "对方正在录音……",
  "对方正在组织语言……"
];

export const momentLikeLines = [
  "对方点赞了一条朋友圈，但没有回你。",
  "对方更新了动态，聊天框继续静音。",
  "对方在线活跃，唯独你的消息被放生。"
];
