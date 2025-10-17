import mongoose, { Schema, Document } from 'mongoose';

export interface ICollabRoom extends Document {
  ideaId?: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  members: mongoose.Types.ObjectId[];
  admins: mongoose.Types.ObjectId[];
  isActive: boolean;
  settings: {
    allowFileSharing: boolean;
    allowVoiceChat: boolean;
    maxMembers: number;
  };
  pinnedMessages: mongoose.Types.ObjectId[];
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const collabRoomSchema = new Schema<ICollabRoom>(
  {
    ideaId: { type: Schema.Types.ObjectId, ref: 'Idea' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
    settings: {
      allowFileSharing: { type: Boolean, default: true },
      allowVoiceChat: { type: Boolean, default: false },
      maxMembers: { type: Number, default: 10 }
    },
    pinnedMessages: [{ type: Schema.Types.ObjectId, ref: 'ChatMessage' }],
    lastActivity: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

collabRoomSchema.index({ ideaId: 1 }, { unique: true, sparse: true });
collabRoomSchema.index({ projectId: 1 }, { unique: true, sparse: true });
collabRoomSchema.index({ members: 1 });
collabRoomSchema.index({ lastActivity: -1 });

export const CollabRoom = mongoose.model<ICollabRoom>('CollabRoom', collabRoomSchema);
