/*
 * @Author: zs
 * @Date: 2022-06-28 22:02:12
 * @FilePath: \SanGuo2.4-zengsi\assets\script\app\engine\resmd5\CCResMD5.ts
 * @Description:
 *
 */
export class CCResMD5 {
    private static _i: CCResMD5;
    public static get I(): CCResMD5 {
        if (!this._i) {
            this._i = new CCResMD5();
        }
        return this._i;
    }
    public static ResUrl: string = '';
    public static ResPaths: string[] = null;
    private resHash: { [key: string]: string } = cc.js.createMap(true);
    public LoadResHashFile(url: string, version: string | undefined, callback: () => void): void {
        if (version) {
            url = `${url}/resmd5_${version}.json`;
            this._LoadResHashFile(url, callback);
        } else {
            callback();
        }
    }
    private _LoadResHashFile(path: string, callback: () => void) {
        cc.assetManager.loadRemote<cc.JsonAsset>(path, (err, data) => {
            if (err) {
                setTimeout(() => {
                    this._LoadResHashFile(path, callback);
                }, 100);
            } else {
                this.resHash = data.json as { [key: string]: string };
                callback();
            }
        });
    }

    public static GetKey(path: string): string {
        let AA; let BB; let CC; let DD; let a; let b; let c; let d;
        const S11 = 7;
        const S12 = 12;
        const S13 = 17;
        const S14 = 22;
        const S21 = 5;
        const S22 = 9;
        const S23 = 14;
        const S24 = 20;
        const S31 = 4;
        const S32 = 11;

        const S33 = 16;
        const S34 = 23;
        const S41 = 6;
        const S42 = 10;
        const S43 = 15;
        const S44 = 21;
        path = this.md5_Utf8Encode(path);
        const x = this.md5_ConvertToWordArray(path);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;
        for (let k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = this.md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = this.md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = this.md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = this.md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = this.md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = this.md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = this.md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = this.md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = this.md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = this.md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = this.md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = this.md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = this.md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = this.md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = this.md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = this.md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = this.md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = this.md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = this.md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = this.md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = this.md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = this.md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = this.md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = this.md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = this.md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = this.md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = this.md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = this.md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = this.md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = this.md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = this.md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = this.md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = this.md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = this.md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = this.md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = this.md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = this.md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = this.md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = this.md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = this.md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = this.md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = this.md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = this.md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = this.md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = this.md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = this.md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = this.md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = this.md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = this.md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = this.md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = this.md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = this.md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = this.md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = this.md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = this.md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = this.md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = this.md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = this.md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = this.md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = this.md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = this.md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = this.md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = this.md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = this.md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = this.md5_AddUnsigned(a, AA);
            b = this.md5_AddUnsigned(b, BB);
            c = this.md5_AddUnsigned(c, CC);
            d = this.md5_AddUnsigned(d, DD);
        }
        return (this.md5_WordToHex(b) + this.md5_WordToHex(c)).toLowerCase();
        // return (this.md5_WordToHex(a) + this.md5_WordToHex(b) + this.md5_WordToHex(c) + this.md5_WordToHex(d)).toLowerCase();
    }

    public static GetHashUrl(url: string): string {
        if (url.indexOf('http') < 0) {
            return url;
        }
        const path = url.replace(`${this.ResUrl}/`, '');
        const key = this.GetKey(path);
        const hash = this.getHash(key);
        if (hash) {
            const urls = url.split('.');
            urls[urls.length - 2] = `${urls[urls.length - 2]}_${hash}`;
            url = urls.join('.');
            const ut = this.getResURLT2(url);
            if (ut) {
                url = url.replace(`${CCResMD5.ResPaths[0]}`, ut);
            }

            return url;
        }
        return url;
    }

    /** 远程资源url,多域名 * */
    public static getResURLT2(url: string): string {
        if (!CCResMD5.ResPaths) {
            return null;
        }
        let ut = CCResMD5.ResPaths[0] || '';
        if (!url || url.length === 0) return null;

        const mm = CCResMD5.GetKey(url);
        const aa = mm.substr(mm.length - 4, 4);
        const n = parseInt(aa, 16) % 5;
        ut = CCResMD5.ResPaths[n];
        return ut;
    }

    private static getHash(key: string) {
        return CCResMD5._i.resHash[key];
    }

    private static md5_RotateLeft(lValue: number, iShiftBits: number) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    private static md5_AddUnsigned(lX: number, lY: number) {
        const lX8 = lX & 0x80000000;
        const lY8 = lY & 0x80000000;
        const lX4 = lX & 0x40000000;
        const lY4 = lY & 0x40000000;
        const lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
            } else {
                return lResult ^ 0x40000000 ^ lX8 ^ lY8;
            }
        } else {
            return lResult ^ lX8 ^ lY8;
        }
    }

    private static md5_F(x: number, y: number, z: number) {
        return (x & y) | (~x & z);
    }

    private static md5_G(x: number, y: number, z: number) {
        return (x & z) | (y & ~z);
    }

    private static md5_H(x: number, y: number, z: number) {
        return x ^ y ^ z;
    }

    private static md5_I(x: number, y: number, z: number) {
        return y ^ (x | ~z);
    }

    private static md5_FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
        a = this.md5_AddUnsigned(a, this.md5_AddUnsigned(this.md5_AddUnsigned(this.md5_F(b, c, d), x), ac));
        return this.md5_AddUnsigned(this.md5_RotateLeft(a, s), b);
    }

    private static md5_GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
        a = this.md5_AddUnsigned(a, this.md5_AddUnsigned(this.md5_AddUnsigned(this.md5_G(b, c, d), x), ac));
        return this.md5_AddUnsigned(this.md5_RotateLeft(a, s), b);
    }

    private static md5_HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
        a = this.md5_AddUnsigned(a, this.md5_AddUnsigned(this.md5_AddUnsigned(this.md5_H(b, c, d), x), ac));
        return this.md5_AddUnsigned(this.md5_RotateLeft(a, s), b);
    }

    private static md5_II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
        a = this.md5_AddUnsigned(a, this.md5_AddUnsigned(this.md5_AddUnsigned(this.md5_I(b, c, d), x), ac));
        return this.md5_AddUnsigned(this.md5_RotateLeft(a, s), b);
    }

    private static md5_ConvertToWordArray(path: string) {
        let lWordCount: number;
        const lMessageLength = path.length;
        const lNumberOfWords_temp1 = lMessageLength + 8;
        const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        const lWordArray: number[] = Array(lNumberOfWords - 1);
        let lBytePosition = 0;
        let lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] |= path.charCodeAt(lByteCount) << lBytePosition;
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] |= 0x80 << lBytePosition;
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }

    private static md5_WordToHex(lValue: number) {
        let WordToHexValue = '';
        let WordToHexValue_temp = '';

        let lByte: number;
        for (let lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = `0${lByte.toString(16)}`;
            WordToHexValue += WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }

    private static md5_Utf8Encode(path: string) {
        path = path.replace(/\r\n/g, '\n');
        let utftext = '';
        for (let n = 0; n < path.length; n++) {
            const c = path.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
}
