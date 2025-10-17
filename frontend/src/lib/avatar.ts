import { createAvatar } from '@dicebear/core';
import { 
  botttsNeutral, 
  pixelArtNeutral, 
  identicon, 
  avataaars, 
  personas 
} from '@dicebear/collection';

export type AvatarStyle = 'botttsNeutral' | 'pixelArtNeutral' | 'identicon' | 'avataaars' | 'personas';

export const AVATAR_STYLES = {
  botttsNeutral: {
    name: 'ChaosBot',
    emoji: '🤖',
    description: 'Futuristic robot vibes',
    style: botttsNeutral
  },
  pixelArtNeutral: {
    name: 'ByteBeing',
    emoji: '👾',
    description: 'Retro gaming pixel art',
    style: pixelArtNeutral
  },
  identicon: {
    name: 'CodeCore',
    emoji: '💾',
    description: 'Geometric code patterns',
    style: identicon
  },
  avataaars: {
    name: 'NeonNode',
    emoji: '🔮',
    description: 'Glowing neon energy',
    style: avataaars
  },
  personas: {
    name: 'MysticMesh',
    emoji: '🌌',
    description: 'Cosmic ring patterns',
    style: personas
  }
} as const;

export function generateAvatar(
  style: AvatarStyle, 
  seed: string, 
  size: number = 64
): string {
  const avatarStyle = AVATAR_STYLES[style];
  const avatar = createAvatar(avatarStyle.style, {
    seed,
    size,
    backgroundColor: ['transparent'],
    radius: 50
  });
  
  return avatar.toString();
}

export function generateAvatarDataUrl(
  style: AvatarStyle, 
  seed: string, 
  size: number = 64
): string {
  const avatarStyle = AVATAR_STYLES[style];
  const avatar = createAvatar(avatarStyle.style, {
    seed,
    size,
    backgroundColor: ['transparent'],
    radius: 50
  });
  
  return avatar.toDataUri();
}

export function getRandomSeed(baseSeed: string): string {
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSeed}-${randomSuffix}`;
}

export function getAvatarStyleInfo(style: AvatarStyle) {
  return AVATAR_STYLES[style];
}
