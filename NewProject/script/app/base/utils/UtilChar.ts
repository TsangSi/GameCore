/* eslint-disable */
export class UtilChar {
    /** 是否是表情字体 */
    public static isEmojiCharacter(substring: string): string {
        // if (!GmCfg.I.os_IOS_Native) return substring;
        if (substring) {
            let ass = false;
            for (let i = 0; i < substring.length; i++) {
                const hs = substring.charCodeAt(i);
                if (hs >= 0xd800 && hs <= 0xdbff) {
                    if (substring.length > 1) {
                        var ls = substring.charCodeAt(i + 1);
                        const uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                        if (isNaN(uc)) {
                            ass = true;
                        }
                        if (uc >= 0x1d000 && uc <= 0x1f77f) {
                            ass = true;
                        }
                    }
                } else if (substring.length > 1) {
                    var ls = substring.charCodeAt(i + 1);
                    if (ls === 0x20e3) {
                        ass = true;
                    }
                } else if (hs >= 0x2100 && hs <= 0x27ff) {
                    ass = true;
                } else if (hs >= 0x2B05 && hs <= 0x2b07) {
                    ass = true;
                } else if (hs >= 0x2934 && hs <= 0x2935) {
                    ass = true;
                } else if (hs >= 0x3297 && hs <= 0x3299) {
                    ass = true;
                } else if (hs === 0xa9 || hs === 0xae || hs === 0x303d || hs === 0x3030
                    || hs === 0x2b55 || hs === 0x2b1c || hs === 0x2b1b
                    || hs === 0x2b50) {
                    ass = true;
                }
                if (ass) {
                    const ddaaa = substring.replace(substring.substring(i), '$');
                    return ddaaa;
                }
            }
        }
        return substring;
    }
}
