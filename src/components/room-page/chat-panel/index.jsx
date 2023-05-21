import { useState } from "react";
import { Button } from "../../button";
import { IconSparkle, IconCheck } from "../../icon";

import styles from "./style.module.scss";

export const ChatPanel = () => {
  const [messages, setMessages] = useState([
    {
      content:
        "Hi, I’m ChatGPT, your AI assistant. Ask me anything about your code.",
      author: "ChatGPT",
      from: "ai",
    },
    {
      content: "Thanks I’ll ask you if I need anything later",
      author: "Famous Dino",
      from: "other",
    },
    {
      content: "Let's work on this together!",

      from: "me",
    },
    {
      content:
        "Hi, I’m ChatGPT, your AI assistant. Ask me anything about your code.",
      author: "ChatGPT",
      from: "ai",
    },
    {
      content: "Thanks I’ll ask you if I need anything later",
      author: "Famous Dino",
      from: "other",
    },
    {
      content: "Let's work on this together!",

      from: "me",
    },
    {
      content:
        "Hi, I’m ChatGPT, your AI assistant. Ask me anything about your code.",
      author: "ChatGPT",
      from: "ai",
    },
    {
      content: "Thanks I’ll ask you if I need anything later",
      author: "Famous Dino",
      from: "other",
    },
    {
      content: "Let's work on this together!",

      from: "me",
    },
    {
      content:
        "Hi, I’m ChatGPT, your AI assistant. Ask me anything about your code.",
      author: "ChatGPT",
      from: "ai",
    },
    {
      content: "Thanks I’ll ask you if I need anything later",
      author: "Famous Dino",
      from: "other",
    },
    {
      content: "Let's work on this together!",

      from: "me",
    },
  ]);

  return (
    <div className={styles.chatPanel}>
      <div className={styles.messageContainer}>
        {messages.map((message, index) => (
          <MessageItem key={index} {...message} />
        ))}
      </div>
      <div className={styles.inputBox}>
        <input type="text" placeholder="Help me write a function to..." />
        <div className={styles.sendActions}>
          <Button variant="secondary">
            <IconCheck />
            Send Chat
          </Button>
          <Button>
            <IconSparkle />
            Ask ChatGPT
          </Button>
        </div>
      </div>
    </div>
  );
};

const MessageItem = ({ content, author, from }) => {
  return (
    <div className={`${styles.messageItem} ${styles[from]}`}>
      {author && <p className={styles.author}>{author}</p>}
      <div className={styles.content}>
        {from === "ai" && <IconSparkle />}
        <p className={styles.text}>{content}</p>
      </div>
    </div>
  );
};
