import { instantiate, Node, Prefab } from 'cc';
import { ResManager } from '../../common/ResManager';
import { PrefabName } from '../../global/GConst';
import UtilsTimeout from '../../utils/UtilsTimeout';
import { UIType } from '../UIConfig';
import UIManager from '../UIManager';
import MsgToast1 from './MsgToast1';

export enum Speed {
    // 毫秒
    slow = 3000,
    normal = 450,
    fast = 300,
}

export interface FlyWordsInfo {
    content: string,
    len?: number,
}

export default class MsgToast {
    // 待执行数组
    public msgList: Array<FlyWordsInfo> = [];

    // 当前飘字的父节点
    curFlyP: Node = null;
    template: Node = null;

    public static defaultColor = '#fef4df';

    private static instance: MsgToast = null;
    private stop = false;
    public static I(): MsgToast {
        if (!MsgToast.instance) {
            MsgToast.instance = new MsgToast();
            MsgToast.instance.init();
        }
        return MsgToast.instance;
    }

    init() {
        UtilsTimeout.I.setInterval(() => {
            this.doit();
        }, 60);
    }
    /**
     * 飘字逻辑
     * @param content 显示字体
     * @param speedTmp 飘字速度（秒），默认2秒
     * @param delay 延迟（秒），默认0
     * @param color 颜色，默认白色"#fef4df"
     */
    public static Show(content: string, speedTmp: Speed = Speed.normal, delay = 0, color: string = MsgToast.defaultColor) {
        // 仙玉不足时候的劫持 弹出统一提示
        // if (Config.I.inited) {
        //     let xianyu = Config.I.Cfg_Item_Data[Number(Config.I.Cfg_WestExp_Data[1].QuickCost.split(':')[0])].Name;
        //     if (content.indexOf(xianyu + '不足') > -1) {
        //         if(MsgBox.I) MsgBox.I.colse();
        //         UIUtils.RechargeMsgBox(xianyu);
        //         return;
        //     } else if (content.indexOf('货币不足') > -1) {//消息是服务端返回的 只能在这里劫持
        //         UIUtils.RechargeMsgBox('货币');
        //         return;
        //     }
        // }

        MsgToast.I().cacheFlyInfo(content, color);
    }

    public static ShowRaw(content: string) {
        MsgToast.I().cacheFlyInfo(content, '');
    }

    public static ShowItem(content: string, length = 0) {
        MsgToast.I().cacheFlyInfo(content, '', length);
    }

    public static ShowNotEnough(content) {
        MsgToast.Show(content, Speed.normal); // 白色默认
    }
    public static ShowWarn(content) {
        const color = '#f61a10';
        MsgToast.Show(content, Speed.normal, 0, color); // 红色报错
    }

    public static ShowWithColor(content: string, speedTmp: Speed = Speed.normal, delay = 0) {
        MsgToast.Show(content, speedTmp, delay);
    }

    public static setStop(b: boolean) {
        MsgToast.I().stop = b;
    }
    // 存储飘字
    cacheFlyInfo(contentT: string, colorT?: string, lenT?: number) {
        if (colorT && colorT !== '') {
            contentT = `<color=${colorT}><b>${contentT}</b></c>`;
        }
        const tInfo: FlyWordsInfo = {
            content: contentT,
            len: lenT,
        };
        if (this.msgList.length > 20) {
            this.msgList.shift();
        }
        this.msgList.push(tInfo);
    }
    doit() {
        if (this.stop) return;

        if (!this.curFlyP) {
            this.curFlyP = new Node();
            UIManager.I.addTo(this.curFlyP, UIType.Tips);
        }
        if (this.msgList.length > 0) {
            // let tNode = FlyPool.I.get();
            // if (!tNode) return null;
            if (!this.template) {
                ResManager.I.load(PrefabName.MsgToast, Prefab, (err, prefab: Prefab) => {
                    if (this.template) {
                        prefab.destroy();
                        return;
                    }
                    this.template = instantiate(prefab);
                    this.addShow();
                }, this);
            } else {
                this.addShow();
            }
        }
    }

    addShow() {
        const tNode = instantiate(this.template);
        const tInfo = this.msgList.shift();

        tNode.getComponent(MsgToast1).setInfo(tInfo.content);
        this.curFlyP.addChild(tNode);
        this.correctPos();
    }

    // 矫正 每一个显示的 y 坐标
    correctPos() {
        for (let j = 0; j < this.curFlyP.children.length; j++) {
            const _t = this.curFlyP.children[j];
            _t.getComponent(MsgToast1).setAimY((this.curFlyP.children.length - j + 1) * 50);
        }
    }

    /**
     * 暂停飘字
     */
    public static MsgStop() {
        //
    }
    /**
     * 开始飘字
     */
    public static MsgStart() {
        //
    }

    /**
     * 后端提示信息
     * @param msgId
     * @param speedTmp
     * @param delay
     */
    public static ShowMsgS(msgId: number, speedTmp: Speed = Speed.normal, delay = 0) {
        // MsgToast.Show(Config.I.getMsgS(msgId), speedTmp, delay, MsgToast.defaultColor);
    }
    /**
     * 前端提示信息
     * @param msgId
     * @param speedTmp
     * @param delay
     */
    public static ShowMsgC(msgId: number, speedTmp: Speed = Speed.normal, delay = 0) {
        // MsgToast.Show(Config.I.getMsgC(msgId), speedTmp, delay, MsgToast.defaultColor);
    }
    /**
     * 提示信息
     * @param type 0后端,1前端
     * @param msgId
     */
    public static ShowMsg(type: number, msgId: number) {
        if (type === 1) {
            MsgToast.ShowMsgC(msgId);
        } else {
            MsgToast.ShowMsgS(msgId);
        }
    }

    /**
     * 显示道具吐司
     */
    public static ShowItems(itemInfo: string) {
        const iArray = itemInfo.split('|');
        let speed: Speed = Speed.normal;
        if (iArray.length > 10) {
            speed = Speed.fast;
        }

        let i = 0;
        iArray.forEach((iStr) => {
            const iInfo = iStr.split(':');
            // let name = Config.I.GetCfgItem(parseInt(iInfo[0])).Name;
            const name = '道具吐司';
            // let quality = Config.I.GetCfgItem(parseInt(iInfo[0])).Quality;
            // let color = Utils.I.getNamecolor(quality);
            // <color=#00ff00 > Rich < /c><color=#0fffff>Text</color >
            const msg = `${name}-------x${iInfo[1]}`;
            MsgToast.Show(msg, speed, i * 0.05);
            i++;
        });
    }
}

// example
// MsgToast.Show("测试的答复", Speed.normal);
// MsgToast.ShowItems("1:2|2:3|3:4|4:2|4:2|4:2|4:2|106:2|4:2|1165:2|1165:2|4:2|4:2|4:2|1165:2|4:2|2:3|106:4");
