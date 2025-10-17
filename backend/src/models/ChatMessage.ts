import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  roomId: string;
  sender: mongoose.Types.ObjectId;
  message: string;
  messageType: 'text' | 'file' | 'system';
  attachments?: {
    filename: string;
    url: string;
    type: string;
    size: number;
  }[];
  replyTo?: mongoose.Types.ObjectId;
  isPinned: boolean;
  reactions: {
    emoji: string;
    users: mongoose.Types.ObjectId[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    roomId: { type: String, required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    messageType: { 
      type: String, 
      enum: ['text', 'file', 'system'], 
      default: 'text' 
    },
    attachments: [{
      filename: { type: String },
      url: { type: String },
      type: { type: String },
      size: { type: Number }
    }],
    replyTo: { type: Schema.Types.ObjectId, ref: 'ChatMessage' },
    isPinned: { type: Boolean, default: false },
    reactions: [{
      emoji: { type: String },
      users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    }],
  },
  { timestamps: true }
);

chatMessageSchema.index({ roomId: 1, createdAt: -1 });
chatMessageSchema.index({ sender: 1 });
chatMessageSchema.index({ isPinned: 1 });

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);
