import React, { useEffect, useState, useRef, SyntheticEvent } from "react";
import classes from "./ChatRoom.module.scss";
import { MessageItem } from "./MessageItem";
import {
  addDoc,
  collection,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../api-config";
import { MessageData, NewMessage } from "../types";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { getAuth } from "firebase/auth";
import EmojiPicker, {
  Theme,
  EmojiClickData,
  EmojiStyle,
} from "emoji-picker-react";
import EmojiIcon from "./UI/EmojiIcon";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

const ChatRoom: React.FC = () => {
  const [user] = useAuthState(auth);
  const [messagesLoaded, setMessagesLoaded] = useState<boolean>(false);
  const uListRef = useRef<HTMLUListElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(true);

  const messagesRef = query(
    collection(firestore, "/messages"),
    orderBy("createdAt", "asc")
  );

  const [snapshot] = useCollection(messagesRef);

  const [messagesState, setMessagesState] = useState<MessageData[]>([]);

  const messages: MessageData[] = [];

  snapshot?.forEach((docRef) => {
    messages.push({ uid: docRef.id, ...docRef.data() });
  });

  const scrollToBottom = (behavior: ScrollBehavior = "auto"): void => {
    if (!uListRef.current) return;
    const uList: HTMLUListElement = uListRef.current;
    const distanceFromTop: number = uList.scrollHeight;

    uList.scroll({
      top: distanceFromTop,
      behavior,
    });
  };

  const sendMessageHandler = async (): Promise<void> => {
    if (messageInputRef.current === null) return;
    if (!user) return;
    const text = messageInputRef.current.value;
    if (text === "") return;

    const newMessage: NewMessage = {
      authorUsername: user.displayName || null,
      createdAt: serverTimestamp(),
      imageUrl: user.photoURL || null,
      text,
      userId: user.uid,
    };
    messageInputRef.current.value = "";
    setShowEmojiPicker(false);
    await addDoc(collection(firestore, "/messages"), newMessage);
  };

  const onEmojiSelection = (
    emojiData: EmojiClickData,
    event: MouseEvent
  ): void => {
    if (messageInputRef.current === null) return;
    messageInputRef.current.value += emojiData.emoji;
    messageInputRef.current.focus();
  };

  // Handle on enter
  useEffect(() => {
    const callback = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      sendMessageHandler();
    };

    document.addEventListener("keyup", callback);

    return () => {
      document.removeEventListener("keyup", callback);
    };
  }, []);

  // Update UI with new messages
  useEffect(() => {
    setMessagesState(messages);
    !messagesLoaded && messages.length > 0 && setMessagesLoaded(true);
  }, [snapshot]);

  // scroll to bottom after messages is set.
  useEffect(() => {
    // Scroll to bottom on initial messages load (behavior: "auto")
    messagesLoaded && scrollToBottom();
  }, [messagesLoaded]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages]);

  return (
    <div className={classes.chatRoom}>
      <ul ref={uListRef}>
        {user &&
          messagesState &&
          messagesState.map((message) => {
            return (
              <MessageItem
                key={message.uid}
                sentByUser={message.userId === user.uid ? true : false}
                username={message.authorUsername}
                text={message.text}
                createdAt={message.createdAt}
                imageUrl={message.imageUrl}
              />
            );
          })}
      </ul>

      <div className={classes.inputWrapper}>
        <button
          className={classes.icon}
          onClick={() => {
            setShowEmojiPicker((ls) => !ls);
          }}
        >
          <EmojiIcon />
        </button>
        <input
          type="text"
          placeholder="Start typing..."
          ref={messageInputRef}
        />

        <button className={classes.icon} onClick={sendMessageHandler}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>

        <div className={classes.emojiPicker}>
          {showEmojiPicker && (
            <EmojiPicker
              width="100%"
              height="100%"
              lazyLoadEmojis={true}
              autoFocusSearch={false}
              theme={Theme.DARK}
              onEmojiClick={onEmojiSelection}
              emojiStyle={EmojiStyle.NATIVE}
              emojiVersion="5.0"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;