import { isAbsolute, resolve } from 'path'
export const ensureAbsolute = (path: string, root: string) =>
  path ? (isAbsolute(path) ? path : resolve(root, path)) : root
