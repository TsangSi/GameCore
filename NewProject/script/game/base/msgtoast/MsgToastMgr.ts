import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilString } from '../../../app/base/utils/UtilString';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { Config } from '../config/Config';
import { ConfigIndexer } from '../config/indexer/ConfigIndexer';
import { LayerMgr } from '../main/LayerMgr';

export enum Speed {
    // 毫秒
    slow = 3000,
    normal = 450,
    fast = 300,
}

interface MsgToastComponent extends cc.Component {
    /** 设置信息开始飘字 */
    setInfo: (str: string) => void
    /** 设置目标y */
    setAimY: (aimY: number) => void
}

export interface FlyWordsInfo {
    content: string,
}

export default class MsgToastMgr {
    // 待执行数组
    public msgList: FlyWordsInfo[] = [];

    // 当前飘字的父节点
    private curFlyP: cc.Node = null;
    // private template: cc.Node = null;

    private static instance: MsgToastMgr = null;
    private _stop = false;
    public set stop(b: boolean) {
        this._stop = b;
    }
    /** 暂时不需要外部用I，有需要再申明为公有 */
    private static get I(): MsgToastMgr {
        if (!this.instance) {
            this.instance = new this();
            this.instance.init();
        }
        return this.instance;
    }

    private init() {
        setInterval(() => {
            // eslint-disable-next-line no-void
            this.doit();
        }, 60);
    }
    /**
     * 飘字逻辑
     * @param content 显示字体
     * @param color 颜色，默认白色"#fef4df"
     */
    public static Show(content: string, color: string = UtilColor.WhiteD): void {
        if (content.length <= 0 || content === null || content === undefined) {
            return;
        }
        this.I.cacheFlyInfo(content, color);
    }

    // 需要前端拦截不做飘字提示的错误码
    private static readonly FilterErrCode: number[] = [9, 58, 68, 6104];
    public static ShowErrTips(tag: number, ...args: any[]): void {
        if (this.FilterErrCode.indexOf(tag) < 0) {
            const msg = MsgToastMgr.GetErrTipsStr(tag, ...args);
            if (msg) {
                this.Show(msg);
            } else {
                this.Show(`错误码：${tag}`);
            }
        } else {
            console.log('错误码', tag);
        }
    }

    /** 获取后端错误提示文本 */
    public static GetErrTipsStr(tagOrId: number, ...args: any[]): string {
        const msg: string = this.cfgErr.getValueByKey(tagOrId, 'MSG');
        if (msg) {
            if (args.length > 0) {
                return UtilString.FormatArray(msg, args);
            } else {
                return msg;
            }
        }
        return '';
    }

    // 存储飘字
    private cacheFlyInfo(contentT: string, colorT?: string) {
        if (colorT && colorT !== '') {
            contentT = `<color=${colorT}><b>${contentT}</b></c>`;
        }
        const tInfo: FlyWordsInfo = {
            content: contentT,
        };
        if (this.msgList.length > 20) {
            this.msgList.shift();
        }
        this.msgList.push(tInfo);
    }
    private doit() {
        if (this.stop) return;

        if (!this.curFlyP) {
            this.curFlyP = new cc.Node();
            LayerMgr.I.addToLayer(GameLayerEnum.POP_LAYER, this.curFlyP);
        }
        if (this.msgList.length > 0) {
            this.addShow();
        }
    }

    private addShow() {
        const tInfo = this.msgList.shift();
        ResMgr.I.showPrefab(UI_PATH_ENUM.MsgToast, this.curFlyP, (e, tNode) => {
            if (!e) {
                const msgtoast = tNode.getComponent('MsgToast') as MsgToastComponent;
                if (msgtoast) {
                    msgtoast.setInfo(tInfo.content);
                }
                this.correctPos();
            }
        });
    }

    // 矫正 每一个显示的 y 坐标
    private correctPos() {
        for (let j = 0; j < this.curFlyP.children.length; j++) {
            const _t = this.curFlyP.children[j];
            const msgtoast = _t?.getComponent('MsgToast') as MsgToastComponent;
            if (msgtoast) {
                msgtoast.setAimY((this.curFlyP.children.length - j + 1) * 50);
            }
        }
    }

    /**
     * 显示配置表的提示信息
     * @param type 0后端,1前端
     * @param msgId
     */
    public static ShowMsg(type: number, msgId: number): void {
        if (type === 1) {
            MsgToastMgr.Show(this.GetMsgC(msgId), UtilColor.WhiteD);
        } else {
            MsgToastMgr.Show(this.GetErrTipsStr(msgId), UtilColor.WhiteD);
        }
    }

    /**
     * 显示道具吐司
     */
    public static ShowItems(itemInfo: string): void {
        const iArray = itemInfo.split('|');
        iArray.forEach((iStr, i) => {
            const iInfo = iStr.split(':');
            const name = '道具吐司';
            const msg = `${name}-------x${iInfo[1]}`;
            MsgToastMgr.Show(msg, UtilColor.WhiteD);
        });
    }
    private static _cfgMsgC: ConfigIndexer;
    private static get cfgMsgC(): ConfigIndexer {
        if (!this._cfgMsgC) {
            this._cfgMsgC = Config.Get(Config.Type.Cfg_ClientMsg);
        }
        return this._cfgMsgC;
    }

    private static _cfgErr: ConfigIndexer;
    private static get cfgErr(): ConfigIndexer {
        if (!this._cfgErr) {
            this._cfgErr = Config.Get(Config.Type.Cfg_Err);
        }
        return this._cfgErr;
    }

    /**
     * 根据id获取前端提示表的提示内容
     * @param id 前端提示表的id
     * @param args 可变传参
     * @returns
     */
    public static GetMsgC(id: number, ...args: any[]): string {
        const cfg = this.cfgMsgC.getValueByKey(id, { ActId: 0, MSG: '' });
        if (cfg) {
            if (cfg.ActId) {
                // args[0] = this.cfgActive.getValueByKey(cfg.ActId, 'OpenTimeDesc');
            }
            return UtilString.FormatArray(cfg.MSG, args);
        }
        return '';
    }
}

// example
// MsgToastMgr.Show("测试的答复", Speed.normal);
// MsgToastMgr.ShowItems("1:2|2:3|3:4|4:2|4:2|4:2|4:2|106:2|4:2|1165:2|1165:2|4:2|4:2|4:2|1165:2|4:2|2:3|106:4");
