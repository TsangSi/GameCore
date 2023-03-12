/* eslint-disable max-len */
/*
 * @Author: hwx
 * @Date: 2022-04-11 17:57:32
 * @FilePath: \SanGuo\assets\script\game\base\utils\UtilGame.ts
 * @Description: 游戏工具类，业务逻辑相关的可以再此添加
 */
import { AudioMgr } from '../../../app/base/manager/AudioMgr';
import AudioPath from '../../../app/base/manager/AudioPath';
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import { BundleType } from '../../../app/core/res/BundleMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { FuncId } from '../../const/FuncConst';
import { BTN_CLICK_SCALE } from '../../const/GameConst';
import ModelMgr from '../../manager/ModelMgr';
import LabelTextScroll from '../components/LabelTextScroll';
import UtilFunOpen from './UtilFunOpen';
import UtilItem from './UtilItem';

export interface ClickOptionalParam {
    /** 不连续点击 */
    unRepeat?: boolean,
    /** 不连续时间 */
    time?: number,
    /** 自定义数据 */
    customData?: unknown;
    /** 点击音效路径 */
    soundPath?: string;
    /** 点击音效包名 */
    soundBundle?: BundleType;
    /** 点击音效是否远程 */
    soundIsRemote?: boolean;
    /** 点击缩放大小，仅非Button、Toggle节点生效 */
    scale?: number;
    /** 缩放目标，默认自己 */
    scaleTarget?: cc.Node;
    /** 是否向下穿透，仅非Button、Toggle节点生效 */
    swallow?: boolean;
}

/** 昵称显示信息 */
export enum NickShowType {
    /** 仅显示昵称 */
    Nick,
    /** 区服和昵称 */
    ArenaNick,
    /** 官职区服昵称 */
    OfficialArenaNick,
    /** 官职昵称 */
    OfficialNick,
}
export interface INickInfoConfig {
    /** 昵称 */
    name: string,
    /** 区服信息 */
    arenaId?: number,
    /** 官职信息 */
    official?: number,
    /** 显示类型 */
    showType: NickShowType,
    /** 是否是自己 如果为自己时需要判断功能开启 */
    isSelf?: boolean,
    /** 颜色 */
    isDark?: boolean,
}

/** 点击回调 */
type ClickCallback = (target?: cc.Node, customData?: unknown) => void;

export class UtilGame {
    /**
     * 节点点击，统一处理点击事件，
     * 如果节点有Button、Toggle组件，
     * 将使用编辑器设置的按钮属性，
     * 不推荐在编辑器中添加按钮点击事件，
     * 如有必要需自己处理。
     * */
    public static Click(node: cc.Node, callback: ClickCallback, target: unknown, optional?: ClickOptionalParam): void;
    public static Click(node: cc.Node, path: string, callback: ClickCallback, target: unknown, optional?: ClickOptionalParam): void;
    public static Click(node: cc.Node, ...args: unknown[]): void {
        const refNode = UtilCocos.FindNode(node, args[0]);
        if (refNode && refNode.isValid) {
            const hasPath = typeof args[0] === 'string';
            const callback = (hasPath ? args[1] : args[0]) as (...arg) => void;
            const target = hasPath ? args[2] : args[1];
            const optional = (hasPath ? args[3] : args[2]) as ClickOptionalParam;
            const customData = optional ? optional.customData : undefined;
            const unRepeat: boolean = optional && optional.unRepeat;
            let time: number = 500;
            if (optional) {
                time = optional.time;
            }
            const scaleTarget = optional && optional.scaleTarget ? optional.scaleTarget : refNode;

            refNode.targetOff(target);

            const comp = refNode.getComponent(cc.Button) || refNode.getComponent(cc.Toggle);
            if (comp) {
                refNode.on(cc.Node.EventType.TOUCH_START, () => {
                    if (!comp.interactable || !comp.enabledInHierarchy) { return; }
                    if (optional && optional.soundPath) {
                        AudioMgr.I.playEffect(optional.soundPath, { bundle: optional.soundBundle, isRemote: optional.soundIsRemote });
                    }
                }, target);
                refNode.on('click', (_, data) => {
                    AudioMgr.I.playEffect(AudioPath.clickEff, { isRemote: true });
                    let param = customData;
                    if (param === undefined || param === null) {
                        param = data;
                    }

                    if (unRepeat) {
                        const nowTime = UtilTime.NowSec();
                        // eslint-disable-next-line dot-notation
                        if (refNode['ClickTime'] && nowTime - refNode['ClickTime'] <= time) { return; }
                        // eslint-disable-next-line dot-notation
                        refNode['ClickTime'] = nowTime;
                    }

                    callback.call(target, refNode, param);
                }, target);
            } else {
                // 获取原始缩放值
                let rawScale: cc.Vec3 = UtilCocos.GetAttr(scaleTarget, 'rawScale');
                if (!rawScale) {
                    // 记录原始缩放值
                    const scaleX = scaleTarget.scaleX;
                    const scaleY = scaleTarget.scaleY;
                    const scaleZ = scaleTarget.scaleZ;
                    // rawScale = scaleTarget.scale.clone();
                    rawScale = cc.v3(scaleX, scaleY, scaleZ);
                    UtilCocos.SetAttr(scaleTarget, { rawScale });
                }
                let swallow = false; // 是否向下传播
                if (optional && typeof optional.swallow === 'boolean') {
                    swallow = optional.swallow;
                }

                refNode.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
                    AudioMgr.I.playEffect(AudioPath.clickEff, { isRemote: true });
                    // if (optional && optional.soundPath) {
                    //     AudioMgr.I.playEffect(optional.soundPath, { bundle: optional.soundBundle, isRemote: optional.soundIsRemote });
                    // }
                    // 计算实际点击缩放值
                    const scale = optional && optional.scale || BTN_CLICK_SCALE;
                    const scaleX = scaleTarget.scaleX * scale;
                    const scaleY = scaleTarget.scaleY * scale;
                    const scaleZ = scaleTarget.scaleZ * scale;

                    // scaleTarget.scaleX = scaleX < 1 ? 1.1 : scale;
                    // scaleTarget.scaleY = scaleY < 1 ? 1.1 : scale;

                    scaleTarget.setScale(scaleX, scaleY, scaleZ);

                    // scaleTarget.transition = cc.Button.Transition.SCALE;
                    // scaleTarget.duration = 0.1;
                    // scaleTarget.zoomScale = clickScale;

                    // event.preventSwallow = swallow;
                    // event.propagationStopped = !swallow;
                    if (!swallow) {
                        event.stopPropagation();
                    }
                }, target);

                refNode.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
                    scaleTarget.setScale(rawScale.x, rawScale.y, rawScale.z);
                    if (unRepeat) {
                        const nowTime = new Date().getTime();
                        // eslint-disable-next-line dot-notation
                        if (refNode['ClickTime'] && nowTime - refNode['ClickTime'] <= time) { return; }
                        // eslint-disable-next-line dot-notation
                        refNode['ClickTime'] = nowTime;
                    }

                    callback.call(target, refNode, customData);
                    // event.preventSwallow = swallow;
                    // event.propagationStopped = !swallow;
                    if (!swallow) {
                        event.stopPropagation();
                    }
                }, target);

                refNode.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
                    scaleTarget.setScale(rawScale.x, rawScale.y);
                    // event.preventSwallow = swallow;
                    // event.propagationStopped = !swallow;
                    if (!swallow) {
                        event.stopPropagation();
                    }
                }, target);
            }
        }
    }

    /** 设置头像图标 */
    public static SetHeadIcon(sprite: cc.Sprite, iconName: string): void;
    public static SetHeadIcon(node: cc.Node, iconName: string): void;
    public static SetHeadIcon(node: cc.Node, path: string, iconName: string): void;
    public static SetHeadIcon(...args: unknown[]): void {
        if (args[0] instanceof cc.Sprite) {
            const sprite = args[0];
            const iconName = args[1] as string;
            UtilCocos.LoadSpriteFrameRemote(sprite, `i/m/roleHead/${iconName}`);
        } else {
            const node = args[0] as cc.Node;
            const sprite: cc.Sprite = UtilCocos.GetComponent(cc.Sprite, node, args[1]);
            if (sprite && sprite.isValid) {
                const hasPath = typeof args[1] === 'string';
                const iconName = (hasPath ? args[2] : args[1]) as string;
                UtilCocos.LoadSpriteFrameRemote(sprite, `i/m/roleHead/${iconName}`);
            }
        }
    }

    /**
     * 获取精灵九宫格矩形
     * @param path 图片路径，如：xxx/name@9[0_0_0_0].png
     * @returns 对应9宫格图片spriteFrame[insetTop, insetBottom, insetLeft, insetRight]
     */
    public static GetSpriteScale9Rect(path: string): number[] {
        // 判断是否是9宫格图片
        const startIdx = path.indexOf('@9[');
        if (startIdx === -1) { return [0, 0, 0, 0]; }

        // 解析9宫格参数
        const endIdx = path.indexOf(']', startIdx);
        const temp = path.substring(startIdx + 3, endIdx);
        const arr = temp.split('_');
        // 对应9宫格图片spriteFrame[insetTop, insetBottom, insetLeft, insetRight]
        return [Number(arr[0]), Number(arr[1]), Number(arr[2]), Number(arr[3])];
    }

    /**
     * 解析GM字符串
     * @param str
     * @returns [cmd, data]
     */
    public static ParseGMStr(str: string): [string, string] {
        const arr = str.split('@');
        const cmd = arr[0];
        let data = '';
        for (let i = 1; i < arr.length; i++) {
            const param = arr[i];
            data += data ? `@${param}` : param;
        }
        return [cmd, data];
    }

    /**
     * 处理玩家等级字段，返回转生等级、重数、等级 1010001
     * 玩家的等级字段，后四位为等级，中间两位为重数，前两位为转数
     * 这是幻1的做法，有可能被废弃
     * @param level
     * @returns Array<number>
     */
    public static LevelToLong(level: number): Array<number> {
        const r = Math.floor(level / 1000000);
        const b = Math.floor((level - r * 1000000) / 10000);
        const l = Math.floor(level % 10000);
        return [r, b, l];
    }

    /**
     * 获取等级字符串
     * @param level
     * @returns string
     */
    public static GetLevelStr(level: number): string {
        const [r, b, l] = UtilGame.LevelToLong(level);
        if (r > 0 || b > 0) return `${r}${i18n.jie}${b}${i18n.lv}`;
        return `${l}${i18n.lv}`;
    }

    /** 由vip等级得到Svip及或vip几 */
    public static GetVipNL(lv: number): { N: string, L: number; } {
        /** 名称和等级 */
        const d: { N: string, L: number; } = { N: '', L: 0 };
        if (lv > 10) {
            d.N = i18n.tt(Lang.open_svip);
            d.L = lv - 10;
        } else {
            d.N = i18n.tt(Lang.open_vip);
            d.L = lv;
        }
        return d;
    }

    /** Vip转换为SVip */
    public static VipToName(lv: number): string {
        return lv > 10 ? `${i18n.tt(Lang.svip_title)}${lv - 10}` : `${i18n.tt(Lang.vip_title)}${lv}`;
    }

    /**
     * 根据Key获取IntAttr
     * @param intAttrs
     * @param key IntAttr K
     * @returns T | IntAttr | IntAttr1 | null
     */
    public static GetIntAttrByKey<T extends { K: number }>(intAttrs: T[], key: number): T | null {
        for (let i = 0, len = intAttrs.length; i < len; i++) {
            const intAttr = intAttrs[i];
            if (intAttr.K === key) {
                return intAttr;
            }
        }
        return null;
    }

    /**
     * 格式化玩家昵称
     * @param areaId 显示区服id
     * @param Nick 昵称
     * @returns
     */
    public static FormatNick(nickInfo: INickInfoConfig, rich?: boolean): string {
        if (nickInfo === null) return '';
        switch (nickInfo.showType) {
            case NickShowType.Nick:
                return rich ? `<color=${UtilColor.WhiteD}>${nickInfo.name}</c>` : nickInfo.name;
            case NickShowType.ArenaNick:
                return rich ? `<color=${UtilColor.WhiteD}>${UtilGame.ShowNick(nickInfo.arenaId, nickInfo.name)}</c>` : `${UtilGame.ShowNick(nickInfo.arenaId, nickInfo.name)}`;
            case NickShowType.OfficialNick: {
                const officialLv = nickInfo.official ?? 1;
                const isSelf = nickInfo.isSelf ?? true;
                const isDark = nickInfo.isDark ?? true;
                const officialName = this.OfficialInfo(officialLv, isSelf, isDark, rich);
                return rich
                    ? `<color=${UtilColor.WhiteD}>${officialName}${nickInfo.name}</c>`
                    : `${officialName}${nickInfo.name}`;
            }
            case NickShowType.OfficialArenaNick: {
                const officialLv = nickInfo.official ?? 1;
                const isSelf = nickInfo.isSelf ?? true;
                const isDark = nickInfo.isDark ?? true;
                const officialName = this.OfficialInfo(officialLv, isSelf, isDark, rich);
                return rich
                    ? `<color=${UtilColor.WhiteD}>${officialName}${UtilGame.ShowNick(nickInfo.arenaId, nickInfo.name)}</c>`
                    : `${officialName}${UtilGame.ShowNick(nickInfo.arenaId, nickInfo.name)}`;
            }
            default:
                return '';
        }
    }

    /** 由于版署或策划未定的原因，S1.玩家名字 需要暂变更为去掉S1. 但是后面可能会变更为其他格式的名字，这里统一接口 */
    public static ShowNick(AreaId: number, name: string, showServer: boolean = true): string {
        if (showServer) {
            return `S${AreaId}.${name}`;
        } else {
            return name; // `S${AreaId}.${name}`;
        }
    }

    private static OfficialInfo(OfficialLv: number, isSelf: boolean, isDark: boolean, rich: boolean): string {
        if (isSelf) {
            if (UtilFunOpen.isOpen(FuncId.RoleArmyOfficial)) {
                const officialInfo = ModelMgr.I.RoleOfficeModel.getOfficialInfo();
                const color = UtilItem.GetItemQualityColor(officialInfo.conf.Quality, isDark);
                return rich ? `<color=${color}>【${officialInfo.name1}】</c>` : `【${officialInfo.name1}】`;
            } else {
                return '';
            }
        } else {
            const officialInfo = ModelMgr.I.RoleOfficeModel.getOfficialInfo(OfficialLv);
            const color = UtilItem.GetItemQualityColor(officialInfo.conf.Quality, isDark);
            return rich ? `<color=${color}>【${officialInfo.name1}】</c>` : `【${officialInfo.name1}】`;
        }
    }

    /**
     * 数字转文字如：1转一
     * @param i
     * @returns
     */
    public static num2char(num: number): string {
        let ret = '';
        const char = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        const numStr = num.toString();
        for (let i = 0; i < numStr.length; i++) {
            const n = numStr.charAt(i);
            ret += char[n];
        }
        return ret;
    }

    public static LabelScrollSet(lab: cc.Label, str?: string, isColorFull: boolean = false, isColorLight: boolean = false): void {
        if (!lab || !lab.node) return;
        const text = lab.getComponent(LabelTextScroll);
        if (text) {
            if (typeof str === 'string') {
                text.setText(str);
            }
            text.setColorFull(isColorFull, isColorLight);
        }
    }
}
