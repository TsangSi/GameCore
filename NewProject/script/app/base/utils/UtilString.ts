import { Config } from '../../../game/base/config/Config';
import { ConfigConst } from '../../../game/base/config/ConfigConst';
import { ConfigIndexer } from '../../../game/base/config/indexer/ConfigIndexer';
import { UtilGame } from '../../../game/base/utils/UtilGame';
import UtilItem from '../../../game/base/utils/UtilItem';
import { UtilArray } from './UtilArray';
import { UtilColor } from './UtilColor';

/*
 * @Author: hwx
 * @Date: 2022-03-29 11:20:17
 * @FilePath: \SanGuo2.4\assets\script\app\base\utils\UtilString.ts
 * @Description: 字符串工具类
 */
interface CheckResult {
    value: boolean,
    msg: string;
}

/**
 * 字符串工具类
 */
export class UtilString {
    /**
     * 检查用户名是否合法
     * @param str 用户名字符串
     * @returns 检查结果：value & msg
     */
    // public static CheckUserName(str: string): CheckResult {
    //     const ret = {} as CheckResult;
    //     const re: RegExp = /^[a-zA-Z\d]\w{2,10}[a-zA-Z\d]$/;
    //     if (re.test(str)) {
    //         ret.value = true;
    //         ret.msg = '';
    //     } else {
    //         ret.value = false;
    //         ret.msg = '用戶名不合法';
    //     }
    //     return ret;
    // }

    // /**
    //  * 检查用户密码是否合法
    //  * @param str 用户密码
    //  * @returns 检查结果：value & msg
    //  */
    // public static CheckUserPassword(str: string): CheckResult {
    //     const ret = {} as CheckResult;
    //     const b: RegExp = /^[a-zA-Z\d]\w{2,10}[a-zA-Z\d]$/;
    //     if (b.test(str)) {
    //         if (str.length > 5 && str.length < 21) {
    //             ret.value = true;
    //             ret.msg = '';
    //         } else {
    //             ret.value = false;
    //             ret.msg = '密码长度不合法';
    //         }
    //     } else {
    //         ret.value = false;
    //         ret.msg = '密码字符不合法';
    //     }
    //     return ret;
    // }

    // /**
    //  * 检查手机号码是否合法
    //  * @param str 手机号码
    //  * @returns 检查结果：value & msg
    //  */
    // public static CheckPhone(str: string): CheckResult {
    //     const ret = {} as CheckResult;
    //     const re: RegExp = /^1([3|5|6|7|8|9])\d{9}$/;
    //     if (re.test(str)) {
    //         ret.value = true;
    //         ret.msg = '';
    //     } else {
    //         ret.value = false;
    //         ret.msg = '手机号不合法';
    //     }
    //     return ret;
    // }

    // /**
    //  * 检查邮箱是否合法
    //  * @param str 邮箱
    //  * @returns 检查结果：value & msg
    //  */
    // public static CheckMail(str: string): CheckResult {
    //     const ret = {} as CheckResult;
    //     // 验证Mail的正则表达式,^[a-zA-Z0-9_-]:开头必须为字母,下划线,数字。
    //     const re: RegExp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    //     if (re.test(str)) {
    //         ret.value = true;
    //         ret.msg = '';
    //     } else {
    //         ret.value = false;
    //         ret.msg = '邮箱地址不合法';
    //     }
    //     return ret;
    // }

    /**
     * 字符串格式化参数
     * @param str 字符串
     * @param args 参数
     * @returns 格式化后的字符串
     * @example StringUtil.FormatArgs("参数{0}参数{1}参数{2}", 1, 2, 5)
     */
    public static FormatArgs(str: string, ...args: unknown[]): string {
        return this.FormatArray(str, args);
    }

    /**
     * 字符串格式化数组
     * @param str 字符串
     * @param arr 数组
     * @returns 格式化后的字符串
     * @example StringUtil.FormatArray("参数{0}参数{1}参数{2}", [1, 2, 5])
     */
    public static FormatArray(str: string, arr: unknown[]): string {
        if (str && arr && arr.length > 0) {
            return str.replace(/\{(\d+)\}/gm, (sub: string, idx: number) => String(arr[idx] !== undefined && arr[idx] !== null ? arr[idx] : sub));
        }
        return str;
    }

    /**
     * 替换字符串
     * @param str
     * @param strSearch
     * @param strReplace
     */
    public static replaceAll(str: string, strSearch: string, strReplace: string): string {
        while (str.indexOf(strSearch) >= 0) {
            str = str.replace(strSearch, strReplace);
        }
        return str;
    }

    /**
     * 判断是否以指定字符串开头
     * @param str 字符串
     * @param part 开头的字符串
     * @returns 是/否
     */
    public static StartWith(str: string, part: string): boolean {
        return str.slice(0, part.length) === part;
    }

    /**
     * 判断是否以指定字符串结尾
     * @param str 字符串
     * @param part 结尾的字符串
     * @returns 是/否
     */
    public static EndWith(str: string, part: string): boolean {
        return str.slice(part.length) === part;
    }

    /**
     * 获取UUID
     * @returns 字符串
     */
    public static GetUUID(): string {
        const time = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
            const random = Math.floor((time + Math.random() * 16) % 16);
            return (char === 'x' ? random : random & 0x3 | 0x8).toString(16).toUpperCase();
        });
        return uuid;
    }

    /**
     * 获取字节数（含中文）
     * @param str 字符串
     */
    public static GetByte(str: string): number {
        let byte = 0;
        let code: number;
        for (let i = 0; i < str.length; i++) {
            code = str.charCodeAt(i);
            if (code <= 0x007f) {
                byte += 1; // 字符代码在000000 – 00007F之间的，用一个字节编码
            } else if (code <= 0x07ff) {
                byte += 2; // 000080 – 0007FF之间的字符用两个字节
            } else if (code <= 0xffff) {
                byte += 3; // 000800 – 00D7FF 和 00E000 – 00FFFF之间的用三个字节，注: Unicode在范围 D800-DFFF 中不存在任何字符
            } else {
                byte += 4; // 010000 – 10FFFF之间的用4个字节
            }
        }
        return byte;
    }

    /**
     * 判断一个字符串是否包含中文
     * @param str
     * @returns 是/否
     */
    public static IsChinese(str: string): boolean {
        const reg = /^.*[\u4E00-\u9FA5]+.*$/;
        return reg.test(str);
    }

    /**
     * 判断一共字符串中是否包含英文
     */
    public static IsEnglish(str: string): boolean {
        const reg = /[a-z]/i;
        return reg.test(str);
    }

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
     * 获取文件后缀
     * @param path
     * @param hasDot 获取的扩展名是否带点
     * @returns '' or 后缀 or .后缀
     */
    public static GetFileExt(path: string, hasDot?: boolean): string {
        const startIdx = path.lastIndexOf('.');
        if (startIdx === -1) { return ''; }

        const offset = hasDot ? 0 : 1; // 是否带点的后缀
        return path.substring(startIdx + offset);
    }

    /**
     * 获取没有后缀的路径
     * @param path
     * @returns 处理后的路径
     */
    public static GetFilePathNoSuffix(path: string): string {
        const endIdx = path.lastIndexOf('.');
        if (endIdx === -1) { return path; }

        return path.substring(0, endIdx);
    }

    /**
     * 返回限定长度的字符串
     * @param str 原始字符串
     * @param len 长度
     * @returns
     */
    public static GetLimitStr(str: string, len: number): string {
        let title = '';
        if (str.length > len) {
            title = `${str.slice(0, len)}...`;
        } else {
            title = str;
        }
        return title;
    }

    // 复制到系统剪切板
    /** 借助html的文本域组件实现复制到粘贴板 */
    public static webCopyString(str: string, cb?: (v: boolean) => void): boolean {
        const input = `${str}`;
        const el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        // el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt'; // Prevent zooming on iOS
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const selection = getSelection()!;
        let originalRange = null;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;

        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {
            //
        }
        document.body.removeChild(el);
        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }
        // eslint-disable-next-line no-unused-expressions
        cb && cb(success);
        if (success) {
            console.log('复制成功');
        } else {
            console.log('复制失败');
        }
        return success;
    }

    /** 实现文字转换为包含富文本图片的内容 */
    public static textToImageSrc(text: string): string {
        const match = text.match(/#([0-9]+)#/g);
        let result = text;
        if (!match) return text;
        for (let i = 0; i < match.length; i++) {
            const char = match[i];
            if (this.charIsEmoji(char)) {
                const ar = this.transformTextToRichTextImg(char);
                result = result.replace(char, ar);
            }
        }
        return result;

        return text.replace(/#([0-9]+)#/g, (sub: string, idx: number) => `<img src='${sub.substring(1, sub.length - 1)}' />`);
    }

    public static charIsEmoji(cstr: string): boolean {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_Emoji);
        const id = Number(cstr.slice(1, cstr.length - 1));
        const emojiCfg: Cfg_Emoji = indexer.getValueByKey(id);
        return !!emojiCfg;
    }

    private static transformTextToRichTextImg(str: string): string {
        const richTxt = `<img src='${str.slice(1, str.length - 1)}' />`;
        // const richTxt = `${str.slice(1, str.length - 1)}`;
        return richTxt;
    }

    /**
     * 字符串转单个字数组
     * @param str 内容 =》 "字符串转单个字数组"
     * @returns 返回=》 ['字','符','串','转','单','个','字','数','组']
     */
    public static StringToArray(str: string): string[] {
        if (!str) return [];
        const arr: string[] = [];
        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);
            arr.push(char);
        }
        return arr;
    }

    /** 字符串替换
     * @[12423235] -> @[玩家名称]
    */
    public static replaceAtInfo(str: string, str1: string): string {
        const reg = /@[[0-9]+]/g;
        return str.replace(reg, str1);
    }

    /**
     * 字符串转换数组  aa:bb|cc:dd:xx
     * @param str aa:bb|cc:dd:xx
     * @returns
     */
    public static SplitToArray(str: string): any[][] {
        if (!str) return [];
        const arr: any[][] = [];
        const s = str.split('|');
        for (let i = 0; i < s.length; i++) {
            const a = s[i].split(':');
            arr.push(a);
        }
        return arr;
    }

    public static parseLog(data: ZhaoMuLog, isShowUnderLine: boolean = false, outline: boolean = true, showServer: boolean = false, showItemDesc: boolean = false): string {
        let str: string = data.LogString;
        let names = '';
        // 超链接 用户名
        let cnames = '';
        // 跨服用户名
        let knames = '';
        // 展示item
        let items = '';
        // 展示超链接item
        let citems = '';
        // 技能
        const skills = '';
        // 宠物
        const pets = '';
        // 宠物信息
        const petsinfo = '';
        const petsinfo1 = '';

        const justNum = '';
        if (data.Users && data.Users.length) {
            for (let index = 0; index < data.Users.length; index++) {
                const name = `${UtilGame.ShowNick(data.Users[index].AreaId, data.Users[index].Nick, showServer)}`;
                const nameId = data.Users[index].UserId;
                if (str.indexOf('{name') !== -1) {
                    const regexp = `{name${index}}`;
                    names += `${name},`;
                    str = str.replace(new RegExp(regexp, 'g'), name);
                }
                if (str.indexOf('{cname') !== -1) {
                    const regexp2 = `{cname${index}}`;
                    const cname = `<u><color=${UtilColor.GreenD} click='|121,${nameId}|'>${name}</c></u>`;
                    cnames += `${cname},`;
                    str = str.replace(new RegExp(regexp2, 'g'), cname);
                }
                if (str.indexOf('{kname') !== -1) {
                    const regexp3 = `{kname${index}}`;
                    const kname = data.Users[index].Nick;
                    str = str.replace(new RegExp(regexp3, 'g'), kname);
                    knames += `${kname},`;
                }
            }
        }

        // 伤害等其他纯数值数值
        if (data.Params && data.Params.length) {
            for (let i = 0; i < data.Params.length; i++) {
                if (str.indexOf(`{${i}}`) !== -1) {
                    const regexpa = `{${i}}`;
                    str = str.replace(regexpa, `${data.Params[i]}`);
                }
            }
        }

        // 物品
        if (data.Items && data.Items.length) {
            for (let index = 0; index < data.Items.length; index++) {
                if (index >= 10) {
                    str += '...';
                    break;
                }
                let itemIId = 1;
                const itemId = '';
                const itemData = data.Items[index];
                if (itemData && itemData.ItemId) {
                    itemIId = itemData.ItemId ? itemData.ItemId : 1;
                    // itemId = itemData.Id ? itemData.Id : `${itemData.ItemId}_${new Date().getTime()}`;
                    // // 缓存一下道具信息
                    // this.equipData[itemId] = itemData;
                } else {
                    itemIId = data.Items[index].ItemId;
                }

                const num = data.Items[index].ItemNum;
                const itemCfg: Cfg_Item = Config.Get(Config.Type.Cfg_Item).getValueByKey(itemIId);// Config.I.GetCfgItem(itemIId);
                let item_name = '';
                let Quality = 1;
                if (!itemCfg) {
                    cc.warn('找不到配置', itemIId);
                } else {
                    if (showItemDesc) {
                        item_name = `【${itemCfg.Name}】`;
                    } else {
                        item_name = `${itemCfg.Name}`;
                    }
                    Quality = itemCfg.Quality;
                }
                // if (FuncType.PetEquip == itemCfg.ObjType) {
                //     item_name = PetEqM.I.getMakeName(itemData, item_name);
                // }
                const a = UtilItem.GetItemQualityColor(Quality, true); // BgItem.getLNamecolor(Quality);

                const num_S = num > 1 ? `x${num}` : '';
                if (str.indexOf('{item') !== -1) {
                    const regexp = `{item${index}}`;
                    let item = '';
                    if (Quality === 7) {
                        // item = `<u><color=${a}>${BgItem.getRainBowStr(item_name + num_S)}</c></u>`;
                        item = `<color=${a}>彩色字体-${item_name}</c>`;
                    } else {
                        item = `<color=${a}>${item_name}${num_S}</c>`;
                    }
                    items += `${item},`;
                    str = str.replace(new RegExp(regexp, 'g'), item);
                }
                if (str.indexOf('{citem') !== -1) {
                    const regexp2 = `{citem${index}}`;
                    let citem = '';
                    if (Quality === 7) {
                        if (isShowUnderLine) {
                            citem = `<u><color=${a} click='|19,${itemIId},${num},${itemId}|'>彩色字体-${item_name}</c></u>`;
                        } else {
                            citem = `<color=${a} click='|19,${itemIId},${num},${itemId}|'>彩色字体-${item_name}</c>`;
                        }
                    } else if (isShowUnderLine) {
                        citem = `<u><color=${a} click='|19,${itemIId},${num},${itemId}|'>${item_name}${num_S}</c></u>`;
                    } else {
                        citem = `<color=${a} click='|19,${itemIId},${num},${itemId}|'>${item_name}${num_S}</c>`;
                    }

                    citems += `${citem},`;
                    str = str.replace(new RegExp(regexp2, 'g'), citem);
                }
            }
        }
        // 宠物
        // if (data.Pet && data.Pet.length) {
        //     for (let index = 0; index < data.Pet.length; index++) {
        //         const pet_id = data.Pet[index].Id ? data.Pet[index].Id : 1;
        //         const cfg_Pet = Config.I.Cfg_Pet2_D[pet_id];
        //         const pet_name = cfg_Pet.Name;
        //         const a = Utils.I.getNamecolor(cfg_Pet.Quality);
        //         const pet = `<color=${a}>${pet_name}</c>`;
        //         pets += `${pet},`;
        //     }
        // }
        // 展示宠物
        // if (data.PetInfo && data.PetInfo.length) {
        //     for (let index = 0; index < data.PetInfo.length; index++) {
        //         const pet_D = data.PetInfo[index].Pet2;
        //         const pet_id = pet_D.IId ? pet_D.IId : 1;
        //         const cfg_Pet = Config.I.Cfg_Pet2_D[pet_id];
        //         const pet_name = cfg_Pet.Name;
        //         str = str.replace(new RegExp('{pet2}', 'g'), JSON.stringify(pet_D));
        //         const a = Utils.I.getNamecolor(cfg_Pet.Quality);
        //         let pet = '';
        //         if (str.indexOf('{petsinfo1}') != -1) {
        //             pet = `<u><color=${a} click='|21123|'>${pet_name}</c></u>`;
        //             petsinfo1 += `${pet},`;
        //         } else {
        //             pet = `<u><color=${a} click='|11012|'>${pet_name}</c></u>`;
        //             petsinfo += `${pet},`;
        //         }
        //     }
        // }
        // 宠物七彩技能
        // if (data.Skill && data.Skill.length) {
        //     for (let index = 0; index < data.Skill.length; index++) {
        // eslint-disable-next-line max-len
        //         const skill = `<color=#c0eefb click='|401,${data.Skill[index]},${7}|'>${BgItem.getRainBowStr(`7级${Config.I.getSkillInfoById(data.Skill[index]).SkillName}`)}</c>`;
        //         skills += `${skill},`;
        //     }
        // }
        // 关卡
        // if (data.Stage && data.Stage.length) {
        //     for (let index = 0; index < data.Stage.length; index++) {
        //         const regexp2 = `{stage${index}}`;
        //         const stage = GKM.I.getStage(Number(data.Stage[index]));
        //         str = str.replace(new RegExp(regexp2, 'g'), `<color=#07aaee>${Utils.I.StringFormat('第{0}关', stage.SS)}</c>`);
        //     }
        // }
        // 参数
        // const s = /\{{names}\}/g;
        str = names && str.indexOf('{names}') !== -1 ? str.replace(/\{names\}/g, names.substr(0, names.length - 1)) : str;
        str = cnames && str.indexOf('{cnames}') !== -1 ? str.replace(/\{cnames\}/g, cnames.substr(0, cnames.length - 1)) : str;
        str = knames && str.indexOf('{knames}') !== -1 ? str.replace(/\{knames\}/g, knames.substr(0, knames.length - 1)) : str;
        str = items && str.indexOf('{items}') !== -1 ? str.replace(/\{items\}/g, items.substr(0, items.length - 1)) : str;
        str = citems && str.indexOf('{citems}') !== -1 ? str.replace(/\{citems\}/g, citems.substr(0, citems.length - 1)) : str;
        // str = pets && str.indexOf('{pets}') != -1 ? str.replace(/\{pets}\}/g, pets.substr(0, pets.length - 1)) : str;
        // str = petsinfo && str.indexOf('{petsinfo}') != -1 ? str.replace(/\{petsinfo}\}/g, petsinfo.substr(0, petsinfo.length - 1)) : str;
        // str = (petsinfo0 && str.indexOf('{petsinfo0}') != -1) ? str.replace(/\{petsinfo0}\}/g, petsinfo0.substr(0, petsinfo0.length)) : str;
        // str = petsinfo1 && str.indexOf('{petsinfo1}') != -1 ? str.replace(/\{petsinfo1\}/g, petsinfo1.substr(0, petsinfo1.length - 1)) : str;
        // str = skills && str.indexOf('{skills}') != -1 ? str.replace(/\{skills\}/g, skills.substr(0, skills.length - 1)) : str;
        // str = data.P && data.P.length > 0 ? Utils.I.StringFormatArray(str, data.P) : str;

        // str = `<color=${UtilColor.NorV}>${str}</color>`;
        if (outline) {
            str = `<outline color =#0000007B width=1><color=${UtilColor.NorV}>${str}</color></outline>`;
        } else {
            str = `<color=${UtilColor.NorV}>${str}</color>`;
        }
        return str;
    }

    public static unionColor(msg: string): string {
        return `<color=${UtilColor.NorV}>${msg}</color>`;
    }

    public static StringToNumberArray(str: string): number[] {
        const arr = str.split('|');
        return UtilArray.StringArrayToNumberArray(arr);
    }

    /**
     * 路径下文件名替换
     * @param path 全路径
     * @param newName 新名字
     * @returns
     */
    public static ReplaceFileNameFromPath(path: string, newName: string): string {
        const findex: number = path.lastIndexOf('/');
        const newPath = path.substring(0, findex);
        const index: number = path.lastIndexOf('.');
        let suffix: string = '';
        if (index >= 0) {
            // 说明path里包含后缀
            suffix = path.substring(index, path.length);
        }
        // newName 里不应含有后缀，若有，去掉
        let outName: string = newName;
        const oindex: number = newName.lastIndexOf('.');
        if (oindex >= 0) {
            outName = newName.substring(0, oindex);
        }
        return `${newPath}/${outName}${suffix}`;
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
