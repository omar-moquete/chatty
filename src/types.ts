import { DocumentData, FieldValue, Timestamp } from "firebase/firestore";

export type MessageData = {
  uid: string;
} & DocumentData;

export type NewMessage = {
  authorUsername: string | null;
  createdAt: FieldValue;
  imageUrl: string | null;
  text: string;
  userId: string;
};
