import { User } from "@prisma/client";

export function exclude(user: User, keys: string[]) {
  return Object.fromEntries(Object.entries(user).filter(([key]) => !keys.includes(key)));
}
