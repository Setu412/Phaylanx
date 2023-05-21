import { Logo } from "./Logo";
import { Button } from "../../button";
import { IconLink, IconQRCode } from "../../icon";
import { ChatGPTUserIcon } from "./chat-gpt-user-icon";

import styles from "./styles.module.scss";
import { useState } from "react";

export const HeaderNav = () => {
  return (
    <header className={styles.header}>
      <Logo />
      <div className={styles.actions}>
        <UserAvatarList
          users={["Monica", "Ross", "Rachel", "Phoebe", "Joey", "Chandler"]}
        />
        <Button variant="secondary">
          <IconQRCode />
          Show QR Code
        </Button>
        <Button>
          <IconLink />
          Copy Link
        </Button>
      </div>
    </header>
  );
};

const UserAvatarList = ({ users = [] }) => {
  const [currentUserToolTip, setCurrentUserToolTip] = useState("");

  return (
    <div className={styles.userAvatarList}>
      {users.map((name, index) => (
        <div
          className={styles.avatarContainer}
          key={index}
          onMouseEnter={() => setCurrentUserToolTip(name)}
          onMouseLeave={() => setCurrentUserToolTip("")}
        >
          <div className={styles.avatar}>{name[0]}</div>
          <span
            className={`${styles.toolTip} ${
              currentUserToolTip === name ? styles.showToolTip : ""
            }`}
          >
            {name}
          </span>
        </div>
      ))}
      <ChatGPTUserAvatar />
    </div>
  );
};

const ChatGPTUserAvatar = () => {
  const [showToolTip, setShowToolTip] = useState(false);

  return (
    <div
      className={styles.avatarContainer}
      onMouseEnter={() => setShowToolTip(true)}
      onMouseLeave={() => setShowToolTip(false)}
    >
      <div className={styles.chatGptUserAvatar}>
        <ChatGPTUserIcon />
        <span
          className={`${styles.toolTip} ${
            showToolTip ? styles.showToolTip : ""
          }`}
        >
          ChatGPT
        </span>
      </div>
    </div>
  );
};