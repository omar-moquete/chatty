import React from "react";
import classes from "./MessageItem.module.scss";
import { Timestamp } from "firebase/firestore";
import { intl } from "../app-config";
import SentIcon from "./UI/SentIcon";
import ReceivedIcon from "./UI/ReceivedIcon";

type Props = {
  sentByUser: boolean;
  username: string | null;
  text: string;
  createdAt: Timestamp;
  imageUrl: string;
};
export const MessageItem: React.FC<Props> = ({
  sentByUser,
  username,
  text,
  createdAt,
  imageUrl,
}) => {
  const sentByUserStyle: string = sentByUser ? classes.sentByUser : "";
  const bouncerStyle: string = sentByUser
    ? classes.bounceFromRight
    : classes.bounceFromLeft;

  return (
    <li className={`${classes.item} ${sentByUserStyle} ${bouncerStyle}`}>
      {imageUrl && <img src={imageUrl} />}
      <div className={classes.usernameAndMessage}>
        {!sentByUser && <span className={classes.username}>{username}</span>}
        <p>{text}</p>

        <div className={classes.timestamp}>
          {sentByUser && createdAt && (
            <>
              <span>{intl.format(createdAt.toDate())}</span>

              <ReceivedIcon />
            </>
          )}

          {sentByUser && !createdAt && <SentIcon />}

          {!sentByUser && createdAt && (
            <div className={classes.timestamp}>
              {" "}
              <span>{intl.format(createdAt.toDate())}</span>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};
