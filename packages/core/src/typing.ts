import type { Options as EJSOptions } from 'ejs'
import type { Options as MinifyOptions } from 'html-minifier-terser'

export type Entry = string | Record<string, string>

export interface InjectOptions {
  /**
   *  @description Data injected into the html template
   */
  data?: Record<string, any>

  /**
   * @description esj options configuration
   */
  ejsOptions?: EJSOptions
}

export interface PageOption {
  filename: string
  template: string
  entry?: string
  injectOptions?: InjectOptions
}

export type Pages = PageOption[]

export interface UserOptions {
  /**
   * @description Page options
   */
  pages?: Pages

  /**
   * @description Minimize options
   */
  minify?: MinifyOptions | boolean

  /**
   * page entry
   */
  entry?: string

  /**
   * template path
   */
  template?: string

  /**
   * @description inject options
   */
  inject?: InjectOptions
}
