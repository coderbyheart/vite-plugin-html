import { expand } from 'dotenv-expand'
import dotenv from 'dotenv'
import { join, dirname } from 'pathe'
import { existsSync, readFileSync, statSync, readdir } from 'fs-extra'

export function loadEnv(
  mode: string,
  envDir: string,
  prefix = '',
): Record<string, string> {
  if (mode === 'local') {
    throw new Error(
      `"local" cannot be used as a mode name because it conflicts with ` +
        `the .local postfix for .env files.`,
    )
  }

  const env: Record<string, string> = {}
  const envFiles = [
    /** mode local file */ `.env.${mode}.local`,
    /** mode file */ `.env.${mode}`,
    /** local file */ `.env.local`,
    /** default file */ `.env`,
  ]

  for (const file of envFiles) {
    const path = lookupFile(envDir, [file], true)
    if (path) {
      const parsed = dotenv.parse(readFileSync(path), {
        debug: !!process.env.DEBUG || undefined,
      })

      // let environment variables use each other
      expand({
        parsed,
        // prevent process.env mutation
        ignoreProcessEnv: true,
      })

      // only keys that start with prefix are exposed to client
      for (const [key, value] of Object.entries(parsed)) {
        if (key.startsWith(prefix) && env[key] === undefined) {
          env[key] = value
        } else if (key === 'NODE_ENV') {
          // NODE_ENV override in .env file
          process.env.VITE_USER_NODE_ENV = value
        }
      }
    }
  }

  return env
}

export function lookupFile(
  dir: string,
  formats: string[],
  pathOnly = false,
): string | undefined {
  for (const format of formats) {
    const fullPath = join(dir, format)
    if (existsSync(fullPath) && statSync(fullPath).isFile()) {
      return pathOnly ? fullPath : readFileSync(fullPath, 'utf-8')
    }
  }
  const parentDir = dirname(dir)
  if (parentDir !== dir) {
    return lookupFile(parentDir, formats, pathOnly)
  }
}

export function cleanUrl(url: string): string {
  const queryRE = /\?.*$/s
  const hashRE = /#.*$/s
  return url.replace(hashRE, '').replace(queryRE, '')
}

export async function isDirEmpty(dir: string) {
  return readdir(dir).then((files) => {
    return files.length === 0
  })
}
