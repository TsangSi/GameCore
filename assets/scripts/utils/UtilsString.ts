import { AssetType, Type } from '../global/GConst';

export default class UtilsString {
    /**
     * 字符串格式化 例子UtilsString.StringFormat("阿{0}斯{1}达{2}岁{3}的",1,2,5)
     * @param source 字符串
     * @param param 可扩展参数
     * @returns string
     */
    static Format(source: string, ...param) {
        return this.FormatArray(source, param);
    }

    /**
     * 字符串格式化 例子UtilsString.Format("阿{0}斯{1}达{2}岁{3}的",[1,2,5])
     * @param source 字符串
     * @param param 可扩展参数列表
     * @returns string
     */
    public static FormatArray(source: string, param: string[]): string {
        return source.replace(/\{(\d+)\}/gm, (ms, p1) => (typeof param[Number(p1)] === 'undefined' ? ms : param[Number(p1)]));
    }

    // 字符串转奖励列表
    static String2Items(str: string): { id: number, num: number; }[] {
        str = str || '';
        const result: { id: number, num: number }[] = [];
        const strArr = str.split('|');
        for (let index = 0; index < strArr.length; index++) {
            const element = strArr[index];
            const strArrTmp = element.split(':');
            if (strArrTmp.length > 1) {
                result.push({ id: Number(strArrTmp[0]), num: Number(strArrTmp[1]) });
            } else if (strArrTmp.length === 1 && strArrTmp[0].length > 0) {
                result.push({ id: Number(strArrTmp[0]), num: 0 });
            }
        }
        return result;
    }

    /**
     * 根据url获取文件类型
     */
    static getFileTypeByUrl(url: string) {
        const s = url.split('/');
        const last = s[s.length - 1];
        const n = last.split('.');
        const sf = n[1] ? `.${n[1]}` : AssetType.Png;
        return {
            path: url.split(last)[0],
            name: n[0],
            suffix: sf,
        };
    }

    /**
     * 方法用另一个字符串填充当前字符串(如果需要的话，会重复多次)，以便产生的字符串达到给定的长度。从当前字符串的左侧开始填充。
     * @param str 原字符串
     * @param targetLength 当前字符串需要填充到的目标长度。如果这个数值小于当前字符串的长度，则返回当前字符串本身。
     * @param padString 可选，填充字符串。如果字符串太长，使填充后的字符串长度超过了目标长度，则只保留最左侧的部分，其他部分会被截断。此参数的默认值为 " "（U+0020）。
     * @returns 在原字符串开头填充指定的填充字符串直到目标长度所形成的新字符串。
     */
    static padStart(str: number | string, targetLength: number, padString?: string) {
        if (typeof str !== 'string') {
            str = str.toString();
        }
        if (String.prototype.padStart) {
            return str.padStart(targetLength, padString);
        } else {
            padString = padString || '';
            if (typeof padString !== 'string') {
                return str;
            }
            targetLength = Math.floor(targetLength);
            if (str.length >= targetLength) {
                return str;
            }

            const len = targetLength - str.length;
            const n = len / padString.length + ((len % padString.length) > 0 ? 1 : 0);
            let fillstr = '';
            for (let i = 0; i < n; ++i) {
                fillstr += padString;
            }
            if (fillstr.length > len) {
                fillstr = fillstr.slice(len);
            }
            return fillstr + str;
        }
    }

    /**
    * 是否是汉字
    * @param strChs: 被裁剪的字符
    */
    static IsChinese(strChs: string): boolean {
        const myReg = new RegExp('[\\u4E00-\\u9FFF\\.，。！]+$', 'g');
        return myReg.test(strChs);
    }

    /**
     * 裁剪文字显示
     * @param name: 被裁剪的字符串
     * @param len：目标文字长度
     */
    static Clup(name: string, len = 10): string {
        let nick = '';
        let widthLen = 0;
        for (let i = 0; i < name.length; i++) {
            const c = name.charAt(i);
            nick += c;
            if (this.IsChinese(c)) {
                widthLen += 2;
            } else {
                widthLen += 1;
            }
            if (widthLen >= len && i < name.length - 1) {
                nick += '..';
                break;
            }
        }
        return nick;
    }

    /** 生成随机字符串 */
    static RandomStr = () => `_${Math.random().toString(36).substring(2, 9)}`;


    /**
     * 获取文件名
     * @param path
     * @param hasExt 获取的文件名是否带扩展名
     * @returns 不带后缀的文件名
     */
     public static GetFileName(path: string, hasExt?: boolean): string {
        if (hasExt) {
            return path.replace(/(.*\/)*([^.]+)/ig, '$2');
        }
        return path.replace(/(.*\/)*([^.]+).*/ig, '$2');
    }

    /**
     * 目前主要是动画加载用，非通用性接口
     * @param path 路径
     * @param expName 额外名字
     * @returns
     */
     public static ReplaceFileNameForAnim(path: string, expName: string): string {
        const findex = path.lastIndexOf('/');
        const newPath = path.substring(0, findex + 1);

        const paths: string[] = path.split('/');
        const len = paths.length;
        const ids = paths[len - 2];
        const newName = paths[len - 3] + ids.substring(7, ids.length) + expName;

        return newPath + newName;
    }
}
