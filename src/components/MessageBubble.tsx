import { ChatMessage } from "../hooks/useChatSimulator";
import { TypingIndicator } from "./TypingIndicator";

type Props = {
  message: ChatMessage;
};

export function MessageBubble({ message }: Props) {
  if (message.kind === "typing") {
    return (
      <div className="message-row them pop-in">
        <div className="bubble typing-bubble">
          <TypingIndicator />
        </div>
      </div>
    );
  }

  if (message.side === "system") {
    return (
      <div className={`system-line ${message.kind}`}>
        <span>{message.text}</span>
      </div>
    );
  }

  return (
    <div className={`message-row ${message.side} pop-in`}>
      <div className={`bubble ${message.kind}`}>
        <p>{message.text}</p>
        <time>{message.at}</time>
      </div>
    </div>
  );
}
