/* eslint-disable max-len */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

/** 语言包接口 */
interface PhrasesFace { [key: string]: string | {[key1: string]: string} }

/** 插值信息接口 */
interface interpolationFace {
    prefix: string,
    suffix: string,
}

/** 语言包可选参数列表 */
export interface PolyglotOptionsFace {
    /** 语言包 */
    phrases: PhrasesFace,
    allowMissing?: boolean,
    /** 插值信息 */
    interpolation?: interpolationFace,
    locale?: string,
    _?: string,
    warn?: (message: string) => void,
}
const root = window;

const replace = String.prototype.replace;

function warn(message:any) {
    if (root.console && root.console.warn) root.console.warn(`WARNING:${message}`);
}

function clone<T>(source?: T): T {
    const ret: T = {} as T;
    for (const prop in source) {
        ret[prop] = source[prop];
    }
    return ret;
}
// const delimiter = '||||';
const dollarRegex = /\$/g;
const defaultTokenRegex = /%\{(.*?)\}/g;
const dollarBillsYall = '$$$$';
function interpolate(phrase: unknown, tokenRegex: RegExp, options?:PolyglotOptionsFace) {
    for (const arg in options) {
        if (arg !== '_' && options.hasOwnProperty(arg)) {
            // Ensure replacement value is escaped to prevent special $-prefixed
            // regex replace tokens. the "$$$$" is needed because each "$" needs to
            // be escaped with "$" itself, and we need two in the resulting output.
            let replacement = options[arg];
            if (typeof replacement === 'string') {
                replacement = replacement.replace(dollarRegex, dollarBillsYall);
            }
            const interpolationRegex = tokenRegex || defaultTokenRegex;
            // We create a new `RegExp` each time instead of using a more-efficient
            // string replace so that the same argument can be replaced multiple times
            // in the same phrase.
            // phrase = replace.call(phrase, new RegExp(`%\\{${arg}\\}`, 'g'), replacement);
            phrase = replace.call(phrase, interpolationRegex, (expression: string, argument: string) => {
                if (options[argument] == null) {
                    return expression;
                }
                return options[argument] as string;
            });
        }
    }
    return phrase;
}

export class Polyglot {
    /** 语言包 */
    private phrases: PhrasesFace;
    /** 当前语言缩写标识 */
    private currentLocale: string;
    /** 是否所有不转换 */
    private allowMissing: boolean;
    /** 替换字符串正则表达式 */
    private tokenRegex: RegExp;
    /** 警告打印方法 */
    private warn: (message: string) => void;
    /** 版本 */
    private static VERSION = '1.0.0';
    public constructor(options: PolyglotOptionsFace) {
        options = options || {} as PolyglotOptionsFace;
        this.phrases = {};
        this.extend(options.phrases || {});
        this.currentLocale = options.locale || 'en';
        this.allowMissing = !!options.allowMissing;
        this.tokenRegex = this.constructTokenRegex(options.interpolation);
        this.warn = options.warn || warn;
    }

    private extend(morePhrases?: PhrasesFace, prefix?: string) {
        let phrase: string | PhrasesFace;
        for (let key in morePhrases) {
            if (morePhrases.hasOwnProperty(key)) {
                phrase = morePhrases[key];
                if (prefix) key = `${prefix}.${key}`;
                if (typeof phrase === 'object') {
                    this.extend(phrase, key);
                } else {
                    this.phrases[key] = phrase;
                }
            }
        }
    }

    private locale(newLocale?:any) {
        if (newLocale) this.currentLocale = newLocale;
        return this.currentLocale;
    }

    private unset(morePhrases?: PhrasesFace, prefix?: string) {
        let phrase: string | PhrasesFace;
        if (typeof morePhrases === 'string') {
            delete this.phrases[morePhrases];
        } else {
            for (let key in morePhrases) {
                if (morePhrases.hasOwnProperty(key)) {
                    phrase = morePhrases[key];
                    if (prefix) key = `${prefix}.${key}`;
                    if (typeof phrase === 'object') {
                        this.unset(phrase, key);
                    } else {
                        delete this.phrases[key];
                    }
                }
            }
        }
    }

    private clear() {
        this.phrases = {};
    }

    private replace(newPhrases?: PhrasesFace) {
        this.clear();
        this.extend(newPhrases);
    }

    public t(key?: string, options?: PolyglotOptionsFace): string {
        let phrase;
        let result: unknown;
        options = options || {} as PolyglotOptionsFace;
        // allow number as a pluralization shortcut
        if (typeof this.phrases[key] === 'string') {
            phrase = this.phrases[key];
        } else if (typeof options._ === 'string') {
            phrase = options._;
        } else if (this.allowMissing) {
            phrase = key;
        } else {
            this.warn(`Missing translation for key: "${key}"`);
            result = key;
        }
        if (typeof phrase === 'string') {
            options = clone(options);
            result = interpolate(phrase, this.tokenRegex, options);
        }
        return result as string;
    }
    private constructTokenRegex(opts: interpolationFace) {
        const prefix = (opts && opts.prefix) || '%{';
        const suffix = (opts && opts.suffix) || '}';
        return new RegExp(`${decodeURI(prefix)}(.*?)${decodeURI(suffix)}`, 'g');
    }

    private has(key?:any) {
        return key in this.phrases;
    }
}
