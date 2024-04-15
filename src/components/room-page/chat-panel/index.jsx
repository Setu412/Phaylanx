import { useState, useEffect, useRef } from "react";
import { Button } from "../../button";
import { IconSparkle, IconCheck, IconCopy } from "../../icon";
import { ref, onValue, push } from "firebase/database";
import { getGPTResponse } from "./chatgptSetup";

import styles from "./style.module.scss";

const getIsMobileViewport = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return width <= 1156;
};

export const ChatPanel = ({
  database,
  id,
  date,
  username,
  codeContent,
  language,
}) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState();
  const [chatGPTResponse, setChatGPTResponse] = useState();
  const isMobileViewport = getIsMobileViewport();
  const messagesEndRef = useRef(null);

  const onType = (ev) => {
    setInputValue(ev.target.value);
  };

  const onClickSendToChat = () => {
    if (inputValue === "") {
      return;
    }

    // Try to update if there is text there. If it doesn't work, replace
    const message = { message: inputValue, username };
    push(ref(database, date + "/" + id + "/messages/"), message);
    setInputValue("");
  };

  const onClickSendToChatGPT = async () => {
    if (!inputValue.trim()) {
      return; // Don't send empty messages.
    }
  
    try {
      // Get response from GPT-3 based on user input.
      const response = await getGPTResponse(inputValue, codeContent, language);
      console.log(response);
      const messageText = response.output;
  
      // Push the user's question to Firebase.
      push(ref(database, date + "/" + id + "/messages/"), {
        message: inputValue,
        username,
      });
  
      // Push GPT-3's response to Firebase.
      push(ref(database, date + "/" + id + "/messages/"), {
        message: response.output,
        username: "ChatGPT",
        from: "ai",
      });
      
      // Clear the input box.
      setInputValue("");
    } catch (error) {
      console.error("Error sending message to ChatGPT:", error);

    }
  };

  // This sets the initial listener for the database code
  useEffect(() => {
    const databaseCodePath = ref(database, date + "/" + id + "/messages/");

    // attach listener to the database path
    onValue(databaseCodePath, (snapshot) => {
      const data = snapshot.val();

      let messages = [];
      snapshot.forEach((snap) => {
        const messageContent = snap.val().message;
        const messageAuthor = snap.val().username;

        if (username == messageAuthor) {
          messages.push({ content: messageContent, from: "me" });
        } else if (messageAuthor == "ChatGPT") {
          messages.push({
            content: messageContent,
            author: messageAuthor,
            from: "ai",
          });
        } else {
          messages.push({
            content: messageContent,
            author: messageAuthor,
            from: "other",
          });
        }
      });

      setMessages(messages);
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.metaKey) {
        onClickSendToChatGPT();
      } else {
        onClickSendToChat();
      }
    }
  };

  return (
    <div className={styles.chatPanel}>
      <div className={styles.messageContainer}>
        {messages.length > 0 &&
          messages.map((message, index) => (
            <MessageItem key={index} {...message} />
          ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputBox}>
        <input
          type="text"
          value={inputValue}
          placeholder="Help me write a function to..."
          onChange={onType}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.sendActions}>
          <Button variant="secondary" onClick={onClickSendToChat}>
            <IconCheck />
            {!isMobileViewport && "Send Chat"}
          </Button>
          <Button onClick={onClickSendToChatGPT}>
            <IconSparkle />
            {!isMobileViewport && "Ask ChatGPT"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const MessageItem = ({ content, author, from }) => {
  const onClickCopy = () => navigator.clipboard.writeText(content);

  return (
    <div className={`${styles.messageItem} ${styles[from]}`}>
      {author && <p className={styles.author}>{author}</p>}
      <div className={styles.content}>
        {from === "ai" && <IconSparkle />}
        <p className={styles.text}>{content}</p>
      </div>
      {from === "ai" && (
        <Button variant="tetriary" onClick={onClickCopy}>
          <IconCopy />
          Copy
        </Button>
      )}
    </div>
  );
};
