export type RelationshipKey = "crush" | "ex" | "boss" | "client" | "friend";

export type RelationshipMode = {
  key: RelationshipKey;
  label: string;
  subtitle: string;
  defaultName: string;
  baseAnxiety: number;
  accent: string;
  emoji: string;
  seenLabel: string;
  hints: string[];
  recallLines: string[];
  fakeReplies: string[];
};

export const relationshipModes: Record<RelationshipKey, RelationshipMode> = {
  crush: {
    key: "crush",
    label: "暧昧对象",
    subtitle: "每个标点都像审判。",
    defaultName: "暧昧对象",
    baseAnxiety: 72,
    accent: "#fb7185",
    emoji: "💗",
    seenLabel: "已读，但心跳还没读懂",
    hints: [
      "你开始怀疑上一句话是不是太主动了。",
      "对方沉默的 3 秒，被你脑补成了 300 页小说。",
      "已读，是暧昧期最锋利的标点。",
      "你正在输入“哈哈没事”，但你并不哈哈。"
    ],
    recallLines: [
      "对方撤回了一句：其实我也……",
      "对方撤回了一条足以让你失眠的消息。",
      "内容已被宇宙删除，但焦虑没有。"
    ],
    fakeReplies: ["我觉得", "刚刚", "其实我"]
  },
  ex: {
    key: "ex",
    label: "前任",
    subtitle: "不是聊天，是考古。",
    defaultName: "前任",
    baseAnxiety: 92,
    accent: "#c084fc",
    emoji: "🪦",
    seenLabel: "已读，本身就是清算",
    hints: [
      "不要再分析了，对方真的看见了。",
      "你打开聊天框的样子，像在翻旧账的显微镜。",
      "这不是聊天，这是情绪考古。",
      "你的上一条消息正在被永久悬挂。"
    ],
    recallLines: [
      "对方撤回了一句：最近还好吗。",
      "对方撤回了一条不该出现的怀旧。",
      "你看不到，但你会想一整晚。"
    ],
    fakeReplies: ["最近", "算了", "你还"]
  },
  boss: {
    key: "boss",
    label: "老板",
    subtitle: "已读请假，未读人生。",
    defaultName: "老板",
    baseAnxiety: 84,
    accent: "#f97316",
    emoji: "📎",
    seenLabel: "已读你的请假申请",
    hints: [
      "沉默，通常意味着周一再说。",
      "你开始打开招聘软件，但只是看看。",
      "对方可能在开会，也可能在酝酿一个“方便电话吗”。",
      "你的工位灵魂短暂离线。"
    ],
    recallLines: [
      "老板撤回了一句：方便电话吗？",
      "老板撤回了一条让周末消失的消息。",
      "老板撤回了，但你已经开始加班了。"
    ],
    fakeReplies: ["方便", "这个", "明早"]
  },
  client: {
    key: "client",
    label: "甲方",
    subtitle: "正在输入需求变更。",
    defaultName: "甲方",
    baseAnxiety: 88,
    accent: "#22c55e",
    emoji: "🧾",
    seenLabel: "已读初稿，未读边界感",
    hints: [
      "你听见了需求变更的声音。",
      "对方沉默时，预算也在沉默。",
      "空气里出现了“再高级一点”的味道。",
      "你正在等待一个没有验收标准的回复。"
    ],
    recallLines: [
      "甲方撤回了一句：整体再高级一点。",
      "甲方撤回了一条：我们内部又讨论了一下。",
      "那条被撤回的消息，可能价值三轮改稿。"
    ],
    fakeReplies: ["我们", "整体", "能不能"]
  },
  friend: {
    key: "friend",
    label: "朋友",
    subtitle: "也许睡了，也许没想好。",
    defaultName: "朋友",
    baseAnxiety: 46,
    accent: "#38bdf8",
    emoji: "🫧",
    seenLabel: "已读，友情接受静音测试",
    hints: [
      "对方可能只是睡了，但你已经开始复盘友情。",
      "你决定假装自己也很忙。",
      "朋友圈刷新了，聊天框没有。",
      "沉默不代表结束，但很适合脑补。"
    ],
    recallLines: [
      "朋友撤回了一句：笑死。",
      "朋友撤回了一条你本可以秒回的废话。",
      "内容不重要，重要的是他撤回了。"
    ],
    fakeReplies: ["哈哈", "等等", "我刚"]
  }
};

export const modeList = Object.values(relationshipModes);
