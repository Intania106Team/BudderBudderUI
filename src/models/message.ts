export interface MessageDto {
  text?: string;
  image?: string;
  sender: string;
  reciever: string;
  timestamp: Date;
  messageId?: string;
  isSending?: boolean;
  tid?: string;
  isFailed?: boolean;
}
