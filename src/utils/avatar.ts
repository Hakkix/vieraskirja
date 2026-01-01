/**
 * Generate a DiceBear avatar URL
 * DiceBear provides free, customizable avatar generation
 * @see https://www.dicebear.com/
 */

export function getAvatarUrl(seed: string, style: AvatarStyle = "adventurer"): string {
  const encodedSeed = encodeURIComponent(seed);
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodedSeed}`;
}

export type AvatarStyle =
  | "adventurer"
  | "adventurer-neutral"
  | "avataaars"
  | "avataaars-neutral"
  | "big-ears"
  | "big-ears-neutral"
  | "big-smile"
  | "bottts"
  | "bottts-neutral"
  | "croodles"
  | "croodles-neutral"
  | "fun-emoji"
  | "icons"
  | "identicon"
  | "initials"
  | "lorelei"
  | "lorelei-neutral"
  | "micah"
  | "miniavs"
  | "notionists"
  | "notionists-neutral"
  | "open-peeps"
  | "personas"
  | "pixel-art"
  | "pixel-art-neutral"
  | "rings"
  | "shapes"
  | "thumbs";

/**
 * Generate a random seed for avatar generation
 */
export function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
