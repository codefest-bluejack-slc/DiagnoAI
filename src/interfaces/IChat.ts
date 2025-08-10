export interface IMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface IChatState {
  messages: IMessage[];
  inputValue: string;
  isTyping: boolean;
}

export interface IChatProps {
  onNavigateHome: () => void;
}
