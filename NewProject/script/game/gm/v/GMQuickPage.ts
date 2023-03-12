import { EventClient } from '../../../app/base/event/EventClient';
import { StorageMgr } from '../../../app/base/manager/StorageMgr';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import { Config } from '../../base/config/Config';
import { ConfigItemIndexer } from '../../base/config/indexer/ConfigItemIndexer';
import GameApp from '../../base/GameApp';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { UtilGame } from '../../base/utils/UtilGame';
import { WinTabPage } from '../../com/win/WinTabPage';
import { E } from '../../const/EventName';
import ControllerMgr from '../../manager/ControllerMgr';
import ModelMgr from '../../manager/ModelMgr';
import NetMgr from '../../manager/NetMgr';
import SceneMap from '../../map/SceneMap';
import { BagMgr } from '../../module/bag/BagMgr';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { LayerMgr } from '../../base/main/LayerMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class GMQuickPage extends WinTabPage {
    @property(cc.EditBox)
    private EditAddItemKey: cc.EditBox = null;

    @property(cc.EditBox)
    private EditAddItemCount: cc.EditBox = null;

    @property(cc.Node)
    private NdAddItemButton: cc.Node = null;

    @property(cc.Node)
    private NdOpenUITime: cc.Node = null;
    @property(cc.Node)
    private NdPrintNetMsg: cc.Node = null;

    /** 一键增加军衔所需官印 1-20阶 */
    @property(cc.Node)
    private NdArmyBtn: cc.Node = null;
    /** 一键增加货币 2  3  4 */
    @property(cc.Node)
    private NdAddCoin234: cc.Node = null;

    @property(cc.Node)
    private NdFullBagButton: cc.Node = null;

    @property(cc.Node)
    private NdClearBagButton: cc.Node = null;

    @property(cc.Node)
    private BtnChangeEntity: cc.Node = null;
    @property(cc.Node)
    private BtnChangeMap: cc.Node = null;
    @property(cc.EditBox)
    private EditMap: cc.EditBox = null;

    @property(cc.Node)
    private BtnChangeMemory: cc.Node = null;
    @property(cc.EditBox)
    private EditMemory: cc.EditBox = null;

    /** 测试战力变化 */
    @property(cc.Node)
    private BtnFvUp: cc.Node = null;

    /** 打造装备 */
    @property(cc.Node)
    private btnBuildEquip: cc.Node = null;

    @property(cc.Toggle)
    private TogItemMode: cc.Toggle = null;

    @property(cc.Label)
    private labTime: cc.Label = null;

    // 世家系统GM按钮
    @property(cc.Node)
    private BtnBossStart: cc.Node = null;
    @property(cc.Node)
    private BtnBossEnd: cc.Node = null;
    @property(cc.Node)
    private BtnChiefStart: cc.Node = null;

    // 华容道
    @property(cc.Node)
    private BtnHrdStart: cc.Node = null;

    // 战报
    @property(cc.Node)
    private BtnSpine: cc.Node = null;
    @property(cc.Node)
    private BtnAnim: cc.Node = null;
    @property(cc.Node)
    private BtnSpine22: cc.Node = null;
    @property(cc.Node)
    private BtnAnim22: cc.Node = null;
    @property(cc.Node)
    private BtnFps: cc.Node = null;
    @property(cc.Node)
    private BtnAstc: cc.Node = null;

    @property(cc.Node)
    private btnTestNotch: cc.Node = null;

    protected start(): void {
        super.start();
        /** 军衔所需的官印加满 */
        UtilGame.Click(this.BtnBossStart, () => {
            const [cmd, data] = UtilGame.ParseGMStr('争霸S@bossStart');
            ControllerMgr.I.GMController.reqC2SGm(cmd, data);
        }, this);

        UtilGame.Click(this.BtnBossEnd, () => {
            const [cmd, data] = UtilGame.ParseGMStr('争霸S@bossEnd');
            ControllerMgr.I.GMController.reqC2SGm(cmd, data);
        }, this);
        UtilGame.Click(this.BtnChiefStart, () => {
            const [cmd, data] = UtilGame.ParseGMStr('争霸S@leaderEnd');
            ControllerMgr.I.GMController.reqC2SGm(cmd, data);
        }, this);

        UtilGame.Click(this.BtnHrdStart, () => {
            const timestamp = UtilTime.NowMSec();
            const date1 = new Date(timestamp + 60 * 1000);
            const date2 = new Date(timestamp + 600 * 1000);
            const h1 = date1.getHours() < 10 ? `0${date1.getHours()}` : date1.getHours();
            const m1 = date1.getMinutes() < 10 ? `0${date1.getMinutes()}` : date1.getMinutes();
            const h2 = date2.getHours() < 10 ? `0${date2.getHours()}` : date2.getHours();
            const m2 = date2.getMinutes() < 10 ? `0${date2.getMinutes()}` : date2.getMinutes();
            const [cmd, data] = UtilGame.ParseGMStr(`resetActiveTime@2001@${h1}:${m1}-${h2}:${m2}`);
            ControllerMgr.I.GMController.reqC2SGm(cmd, data);
        }, this);

        UtilGame.Click(this.NdArmyBtn, () => {
            for (let i = 1; i <= 20; i++) {
                this.addItem(`${i}阶官印`);
            }
        }, this);

        /** 货币加满1个亿 2 3 4  */
        UtilGame.Click(this.NdAddCoin234, () => {
            this.addItem('2', '100000000');
            this.addItem('3', '100000000');
            this.addItem('4', '100000000');
        }, this);
        /** 打印所有打开UI时间 */
        UtilGame.Click(this.NdOpenUITime, () => {
            const map = ModelMgr.I.GmModel.getAllPageTime();
            console.log(map);
        }, this);

        UtilGame.Click(this.NdAddItemButton, () => {
            this.addItem();
        }, this);

        UtilGame.Click(this.NdFullBagButton, () => this.fullBag(), this);
        UtilGame.Click(this.NdClearBagButton, () => { ControllerMgr.I.GMController.reqC2SGm('cleanbag'); }, this);

        UtilGame.Click(this.TogItemMode.node, () => { StorageMgr.I.setValue('DebugItemMode', this.TogItemMode.isChecked); }, this);

        UtilGame.Click(this.NdPrintNetMsg, () => {
            NetMgr.I.Debug = !NetMgr.I.Debug;
            if (NetMgr.I.Debug) {
                this.NdPrintNetMsg.getChildByName('Label').getComponent(cc.Label).string = '协议-当前开着';
            } else {
                this.NdPrintNetMsg.getChildByName('Label').getComponent(cc.Label).string = '协议-已经关了';
            }
        }, this);

        UtilGame.Click(this.BtnChangeEntity, () => {
            SceneMap.I.testChangeRole();
        }, this);

        UtilGame.Click(this.BtnChangeMap, () => {
            const mapId = this.EditMap.string;
            SceneMap.I.testEnterMap(+mapId);
        }, this);

        UtilGame.Click(this.BtnChangeMemory, () => {
            const memory = +this.EditMemory.string;
            ResMgr.I.maxMemory = memory;
        }, this);

        /** 测试战力变化按钮 点2下 */
        UtilGame.Click(this.BtnFvUp, this.onFvUp, this);

        UtilGame.Click(this.btnBuildEquip, () => {
            for (let i = 1; i <= 10; i++) {
                this.addItem(`${200200 + i}`, '100');
                this.addItem(`${200300 + i}`, '100');
            }
            this.addItem(`200002`, '100');
        }, this);

        UtilGame.Click(this.BtnSpine, () => {
            this.loadBattle(0);
        }, this);

        UtilGame.Click(this.BtnAnim, () => {
            this.loadBattle(1);
        }, this);

        UtilGame.Click(this.BtnSpine22, () => {
            ControllerMgr.I.GMController.testSpine();
        }, this);

        UtilGame.Click(this.BtnAnim22, () => {
            ControllerMgr.I.GMController.testAnim();
        }, this);

        UtilGame.Click(this.BtnFps, () => {
            ControllerMgr.I.GMController.showFps();
        }, this);

        UtilGame.Click(this.BtnAstc, () => {
            const isAstc = ResMgr.I.gmAstc;
            ResMgr.I.gmAstc = !isAstc;
        }, this);

        UtilGame.Click(this.btnTestNotch, () => {
            if (LayerMgr.I.notchHeight <= 0) {
                LayerMgr.I.notchHeight = 70;
            }
            if (LayerMgr.I.bottomHeight <= 0) {
                LayerMgr.I.bottomHeight = 70;
            }
        }, this);

        const debugItemMode: boolean = StorageMgr.I.getValue('DebugItemMode', false);
        this.TogItemMode.isChecked = debugItemMode;
        const designSize = cc.view.getDesignResolutionSize();
        const winSize = cc.view.getFrameSize();
        // eslint-disable-next-line max-len
        this.labTime.string = `窗口大小：${Math.floor(winSize.width)}x${Math.floor(winSize.height)} \n 设计分辨率：${Math.floor(designSize.width)}x${Math.floor(designSize.height)} \n 开服天数:${UtilFunOpen.serverDays} \n 当前时间:${UtilTime.FormatToDate(UtilTime.NowSec() * 1000)}`;
        this.schedule(() => {
            const designSize = cc.view.getDesignResolutionSize();
            const winSize = cc.view.getFrameSize();
            // eslint-disable-next-line max-len
            this.labTime.string = `窗口大小：${Math.floor(winSize.width)}x${Math.floor(winSize.height)} \n 设计分辨率：${Math.floor(designSize.width)}x${Math.floor(designSize.height)} \n 开服天数:${UtilFunOpen.serverDays} \n 当前时间:${UtilTime.FormatToDate(UtilTime.NowSec() * 1000)}`;
        }, 1);
    }

    private loadBattle(type: number): void {
        let path = type === 0 ? 'battletest/Spine.json' : 'battletest/Anim.json';
        path = `${GameApp.I.ResUrl}/${path}`;
        cc.assetManager.loadAny([{ url: path }], (e, data: any) => {
            console.log(data);
            EventClient.I.emit(E.Battle.Test, data);
        });
    }

    /** 添加装备 */
    public addEquipItem(e, str: string): void {
        this.addItem(str, '1');
    }
    /** 测战力变化 */
    // private _fvNum: number = 100;
    public onFvUp(): void {
        for (let i = 1; i <= 6; i++) {
            this.addItem(`${1000 + i}`, '10000');
            this.addItem(`${1010 + i}`, '10000');
        }
        this.addItem(`16`, '200000');
        // this._fvNum += 50;
        // FvUp.show(this._fvNum);
    }

    /**  添加道具 */
    private addItem(k?: string, c?: string): void {
        let key = this.EditAddItemKey.string;
        if (k) {
            key = k;
        }
        let count = this.EditAddItemCount.string;
        if (c) {
            count = c;
        }
        if (key && count) {
            let id = 0;
            if (Number.isInteger(Number(key))) {
                id = Number(key);
            } else {
                const indexer: ConfigItemIndexer = Config.Get(Config.Type.Cfg_Item);
                id = indexer.getIdByName(key);
            }

            const num = Number(count);
            if (id > 0 && !Number.isNaN(num) && num !== 0) {
                ControllerMgr.I.GMController.reqC2SGm('additem', `${id}@${count}`);
            } else {
                MsgToastMgr.Show('参数不合法');
            }
        } else {
            MsgToastMgr.Show('参数不能为空');
        }
    }

    /** 填满背包 */
    private fullBag() {
        const sprite = this.NdFullBagButton.getComponent(cc.Sprite);
        // if (sprite[`grayscale`]) {
        //     return;
        // }
        // sprite[`grayscale`] = true;
        const label = this.NdFullBagButton.getComponentInChildren(cc.Label);
        label.string = '填充中...';

        let idx = 0;
        const list = [];
        const indexer = Config.Get(Config.Type.Cfg_Item);
        const keys = indexer.getKeys();
        for (let i = 0, len = keys.length; i < len; i++) {
            const itemId: string = keys[i];
            // 增量添加，已经有的就不在添加
            const ownItemNum = BagMgr.I.getItemNum(Number(itemId));
            if (ownItemNum <= 0) {
                const item: Cfg_Item = indexer.getValueByKey(itemId);
                if (item) {
                    let subList: string[] = list[idx];
                    if (!subList) {
                        subList = [];
                        list[idx] = subList;
                    } else if (subList.length >= 99) { // 每个分组最多100个
                        idx++;
                    }
                    const count = item.IsPile ? 10 : 1;
                    subList.push(`${itemId}@${count}`);
                }
            }
        }

        if (list[0]) {
            // 首批不用定时器
            const firstList = list.shift() as string[];
            for (let i = 0, len = firstList.length; i < len; i++) {
                const data = firstList[i];
                ControllerMgr.I.GMController.reqC2SGm('additem', data);
            }

            // 第二批开始，分批添加，1秒一批
            if (list[1]) {
                MsgToastMgr.Show('道具较多，以1秒100个的速度填充，请勿关闭该弹框！');
                sprite.schedule(() => {
                    const moreList = list.shift() as string[];
                    if (moreList && moreList.length > 0) {
                        // if (sprite) sprite.grayscale = true;
                        if (label) label.string = '填充中...';
                        for (let i = 0, len = moreList.length; i < len; i++) {
                            const data = moreList[i];
                            ControllerMgr.I.GMController.reqC2SGm('additem', data);
                        }
                    } else {
                        sprite.unscheduleAllCallbacks();
                        // if (sprite) sprite.grayscale = false;
                        if (label) label.string = '填满背包';
                    }
                }, 1);
            }
        } else {
            MsgToastMgr.Show('背包中已经有所有道具了');
        }
    }
}
