import { createAvatar } from '@dicebear/core';
import { 
  botttsNeutral, 
  pixelArtNeutral, 
  identicon, 
  avataaars, 
  personas,
  adventurer,
  adventurerNeutral,
  bigEars,
  bigEarsNeutral,
  bigSmile,
  croodles,
  croodlesNeutral,
  funEmoji,
  icons,
  initials,
  lorelei,
  loreleiNeutral,
  micah,
  miniavs,
  openPeeps,
  shapes,
  thumbs
} from '@dicebear/collection';

export type AvatarStyle = 'botttsNeutral' | 'pixelArtNeutral' | 'identicon' | 'avataaars' | 'personas' | 'adventurer' | 'adventurerNeutral' | 'bigEars' | 'bigEarsNeutral' | 'bigSmile' | 'croodles' | 'croodlesNeutral' | 'funEmoji' | 'icons' | 'initials' | 'lorelei' | 'loreleiNeutral' | 'micah' | 'miniavs' | 'openPeeps' | 'shapes' | 'thumbs';

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
  },
  adventurer: {
    name: 'AdventureAce',
    emoji: '🗺️',
    description: 'Bold adventurer spirit',
    style: adventurer
  },
  adventurerNeutral: {
    name: 'NeutralNomad',
    emoji: '🧭',
    description: 'Calm explorer vibes',
    style: adventurerNeutral
  },
  bigEars: {
    name: 'EarBender',
    emoji: '👂',
    description: 'Big ears, big dreams',
    style: bigEars
  },
  bigEarsNeutral: {
    name: 'NeutralEars',
    emoji: '👂',
    description: 'Subtle ear power',
    style: bigEarsNeutral
  },
  bigSmile: {
    name: 'SmileMaster',
    emoji: '😊',
    description: 'Always smiling bright',
    style: bigSmile
  },
  croodles: {
    name: 'DoodleDude',
    emoji: '✏️',
    description: 'Hand-drawn charm',
    style: croodles
  },
  croodlesNeutral: {
    name: 'NeutralDoodle',
    emoji: '✏️',
    description: 'Simple drawn style',
    style: croodlesNeutral
  },
  funEmoji: {
    name: 'EmojiExpress',
    emoji: '😄',
    description: 'Fun emoji vibes',
    style: funEmoji
  },
  icons: {
    name: 'IconMaster',
    emoji: '🎯',
    description: 'Clean icon design',
    style: icons
  },
  initials: {
    name: 'InitialInsight',
    emoji: '🔤',
    description: 'Letter-based design',
    style: initials
  },
  lorelei: {
    name: 'LoreleiLux',
    emoji: '✨',
    description: 'Elegant and refined',
    style: lorelei
  },
  loreleiNeutral: {
    name: 'NeutralLux',
    emoji: '✨',
    description: 'Subtle elegance',
    style: loreleiNeutral
  },
  micah: {
    name: 'MicahMagic',
    emoji: '🎨',
    description: 'Artistic expression',
    style: micah
  },
  miniavs: {
    name: 'MiniMaster',
    emoji: '🔍',
    description: 'Tiny but mighty',
    style: miniavs
  },
  openPeeps: {
    name: 'PeepPower',
    emoji: '👥',
    description: 'Open source people',
    style: openPeeps
  },
  shapes: {
    name: 'ShapeShifter',
    emoji: '🔷',
    description: 'Geometric beauty',
    style: shapes
  },
  thumbs: {
    name: 'ThumbUp',
    emoji: '👍',
    description: 'Thumbs up energy',
    style: thumbs
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
