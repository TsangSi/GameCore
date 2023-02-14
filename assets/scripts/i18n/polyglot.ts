/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

//     (c) 2012-2016 Airbnb, Inc.
//
//     polyglot.js may be freely distributed under the terms of the BSD
//     license. For all licensing information, details, and documention:
//     http://airbnb.github.com/polyglot.js
//
//
// Polyglot.js is an I18n helper library written in JavaScript, made to
// work both in the browser and in Node. It provides a simple solution for
// interpolation and pluralization, based off of Airbnb's
// experience adding I18n functionality to its Backbone.js and Node apps.
//
// Polylglot is agnostic to your translation backend. It doesn't perform any
// translation; it simply gives you a way to manage translated phrases from
// your client- or server-side JavaScript application.
//

const root = window;
const replace = String.prototype.replace;
const delimeter = '||||';

const pluralTypes :Record<string, any> = {
    chinese (n?:any) { return 0; },
    german (n?:any) { return n !== 1 ? 1 : 0; },
    french (n?:any) { return n > 1 ? 1 : 0; },
    russian (n?:any) { return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2; },
    czech (n?:any) { return n === 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2; },
    polish (n?:any) { return n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2; },
    icelandic (n?:any) { return n % 10 !== 1 || n % 100 === 11 ? 1 : 0; },
};

// Mapping from pluralization group to individual locales.
const pluralTypeToLanguages = {
    chinese: ['fa', 'id', 'ja', 'ko', 'lo', 'ms', 'th', 'tr', 'zh'],
    german: ['da', 'de', 'en', 'es', 'fi', 'el', 'he', 'hu', 'it', 'nl', 'no', 'pt', 'sv'],
    french: ['fr', 'tl', 'pt-br'],
    russian: ['hr', 'ru'],
    czech: ['cs', 'sk'],
    polish: ['pl'],
    icelandic: ['is'],
};

const trimRe = /^\s+|\s+$/g;
function trim (str:string) {
    return str.replace(trimRe, '');
}

function warn (message:any) {
    if (root.console && root.console.warn) root.console.warn(`WARNING:${message}`);
}

function clone (source?:any) {
    const ret: Record<string, unknown> = {};
    for (const prop in source) {
        ret[prop] = source[prop];
    }
    return ret;
}

const dollarRegex = /\$/g;
const dollarBillsYall = '$$$$';
function interpolate (phrase?: unknown, options?:any) {
    for (const arg in options) {
        if (arg !== '_' && options.hasOwnProperty(arg)) {
            // Ensure replacement value is escaped to prevent special $-prefixed
            // regex replace tokens. the "$$$$" is needed because each "$" needs to
            // be escaped with "$" itself, and we need two in the resulting output.
            let replacement = options[arg];
            if (typeof replacement === 'string') {
                replacement = options[arg].replace(dollarRegex, dollarBillsYall);
            }
            // We create a new `RegExp` each time instead of using a more-efficient
            // string replace so that the same argument can be replaced multiple times
            // in the same phrase.
            phrase = replace.call(phrase, new RegExp(`%\\{${arg}\\}`, 'g'), replacement);
        }
    }
    return phrase;
}

function choosePluralForm (text?:any, locale?:any, count?:any) {
    let ret: string;
    let texts; let chosenText;
    if (count != null && text) {
        texts = text.split(delimeter);
        chosenText = texts[pluralTypeIndex(locale, count)] || texts[0];
        ret = trim(chosenText);
    } else {
        ret = text;
    }
    return ret;
}

function langToTypeMap (mapping?:any) {
    let type; let langs; let l; const ret: Record<string, string> = {};
    for (type in mapping) {
        if (mapping.hasOwnProperty(type)) {
            langs = mapping[type];
            for (l in langs) {
                ret[langs[l]] = type;
            }
        }
    }
    return ret;
}

function pluralTypeName (locale?:any) : string {
    const langToPluralType = langToTypeMap(pluralTypeToLanguages);
    return langToPluralType[locale] || langToPluralType.en;
}

function pluralTypeIndex (locale?:any, count?:any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return pluralTypes[pluralTypeName(locale)](count);
}

export class Polyglot {
  phrases: any;
  currentLocale: string;
  allowMissing: boolean;
  warn: any;
  static VERSION = '1.0.0'
  constructor (options: any) {
      options = options || {};
      this.phrases = {};
      this.extend(options.phrases || {});
      this.currentLocale = options.locale || 'en';
      this.allowMissing = !!options.allowMissing;
      this.warn = options.warn || warn;
  }

  extend (morePhrases?:any, prefix?:any) {
      let phrase;

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

  locale (newLocale?:any) {
      if (newLocale) this.currentLocale = newLocale;
      return this.currentLocale;
  }

  unset (morePhrases?:any, prefix?:any) {
      let phrase;

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

  clear () {
      this.phrases = {};
  }

  replace (newPhrases?:any) {
      this.clear();
      this.extend(newPhrases);
  }

  t (key?:any, options?:any) {
      let phrase;
      let result: unknown;
      options = options == null ? {} : options;
      // allow number as a pluralization shortcut
      if (typeof options === 'number') {
          options = { smart_count: options };
      }
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
          result = choosePluralForm(phrase, this.currentLocale, options.smart_count);
          result = interpolate(result, options);
      }
      return result;
  }

  has (key?:any) {
      return key in this.phrases;
  }
}
