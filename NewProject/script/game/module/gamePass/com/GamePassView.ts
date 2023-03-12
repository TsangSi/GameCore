/*
 * @Author: myl
 * @Date: 2022-09-14 15:18:06
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import ListView from '../../../base/components/listview/ListView';
import { Config } from '../../../base/config/Config';
import { ConfigPassLevelIndexer } from '../../../base/config/indexer/ConfigPassLevelIndexer';
import { ConfigStageIndexer } from '../../../base/config/indexer/ConfigStageIndexer';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import ItemModel from '../../../com/item/ItemModel';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { MaterialRewardScanWin } from '../../material/v/material/MaterialRewardScanWin';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { EGamePassRewardType } from '../GamePassConst';
import { GamePassItem } from './GamePassItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class GamePassView extends BaseUiView {
    @property(cc.Node)
    private NodeBuy: cc.Node = null;
    // @property(cc.Node)
    // private NodeMoney: cc.Node = null;
    @property(cc.Node)
    private NodeLock: cc.Node = null;
    @property(cc.Node)
    private NodeYlq: cc.Node = null;
    @property(ListView)
    private listView: ListView = null;
    @property(cc.Node)
    private bigPrizeNode: cc.Node = null;
    @property(cc.Label)
    private bigPrizeLabel: cc.Label = null;
    @property(cc.Label)
    private LabelCurStage: cc.Label = null;
    private passId: number = 0;
    private indexs: number[] = [];
    private cfg = Config.Get<ConfigPassLevelIndexer>(Config.Type.Cfg_Stage_PassLevel);
    /** 可视范围的数量 */
    private visiableNum: number = 0;
    /** 模板的高度 */
    private itemHeight: number = 0;
    /** 索引数组的长度 */
    private indexLength: number = 0;
    private items: string[] = [];
    protected onLoad(): void {
        super.onLoad();
        this.node.on('PageRefreshEvent', this.onPageRefreshEvent, this);
        EventClient.I.on(E.GamePass.UpdateInfo, this.onUpdateInfo, this);
        RoleMgr.I.on(this.onUpdateStage, this, RoleAN.N.Stage);
        EventClient.I.on(E.GamePass.GetReward, this.onGetReward, this);

        this.listView.node.on('scrolling', this.updateStagePrize, this);
        const tmpNode = this.listView.getTempLateItemNode();
        this.itemHeight = tmpNode.height;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, dot-notation
        this.visiableNum = this.listView.scrollView['_view'].height / this.itemHeight;

        UtilGame.Click(this.NodeBuy, this.onBuyClicked, this);
        const value: string = Config.Get(Config.Type.Cfg_Config).getValueByKey('BSPassPrice', 'CfgValue') || '2:100';
        this.items = value.split(':');

        // UtilCocos.LoadSpriteFrameRemote(this.NodeMoney.getChildByName('Sprite').getComponent(cc.Sprite), `${RES_ENUM.Item}${this.items[0]}_h`);
        // UtilCocos.SetString(this.NodeMoney, 'Label', this.items[1]);
        this.onUpdateStage();
    }

    public sync(): void {
        this.listView.updateAll();
    }

    /** 关卡变更 */
    private onUpdateStage() {
        const obj = Config.Get<ConfigStageIndexer>(Config.Type.Cfg_Stage).getChapterInfo(RoleMgr.I.d.Stage);
        this.LabelCurStage.string = UtilString.FormatArgs(i18n.tt(Lang.gamepass_curstage_title), obj.chapter, obj.level);
        this.listView.content.children.forEach((n) => {
            if (n && n.isValid) {
                n.getComponent(GamePassItem)?.updateReward();
                n.getComponent(GamePassItem)?.updateLockStatus();
            }
        });
    }

    private onPageRefreshEvent(passId: number) {
        this.passId = passId;
        this.indexs = this.cfg.getValueByKey(passId);
        this.indexLength = this.indexs.length;
        const stage = RoleMgr.I.d.Stage;
        let showIndex = 0;
        /** 当前关卡的配置 */
        let curStageCfg: { MaxStageNum: number, Key: number };
        /** 上一个关卡的配置 */
        let lastStageCfg: { MaxStageNum: number, Key: number };
        for (showIndex = 0; showIndex < this.indexLength; showIndex++) {
            curStageCfg = this.cfg.getValueByIndex(this.indexs[showIndex], { MaxStageNum: 0, Key: 0 });
            if (curStageCfg.MaxStageNum >= stage) {
                break;
            }
            lastStageCfg = curStageCfg;
        }
        const model = ModelMgr.I.GamePassModel;
        /** 还有上一个奖励 && （普通奖励未领取 || （已购买王者宝藏 并且 未领取）） */
        // eslint-disable-next-line max-len
        if (lastStageCfg && (!model.isYlqReward(EGamePassRewardType.Nor, lastStageCfg.Key) || (model.getPassRewardBuyStatus(this.passId) && !model.isYlqReward(EGamePassRewardType.Buy, lastStageCfg.Key)))) {
            showIndex -= 1;
        }

        if (this.indexs && this.indexs.length) {
            this.listView.setNumItems(this.indexs.length, showIndex);
        } else {
            this.listView.setNumItems(0);
        }
        this.NodeBuy.active = this.NodeLock.active = !ModelMgr.I.GamePassModel.getPassRewardBuyStatus(this.passId);
        this.lastShowIndex = -1;
        this.updateStagePrize();
    }

    private onRenderList(node: cc.Node, index: number) {
        const s = node.getComponent(GamePassItem);
        s.setData(this.passId, this.indexs[index]);
        s.setNdUpActive(index !== 0);
        s.setNdDownActive(index !== this.indexLength - 1);
    }

    private onUpdateInfo() {
        WinMgr.I.close(ViewConst.MaterialRewardScanWin);
        this.listView.content.children.forEach((n) => {
            if (n && n.isValid) {
                n.getComponent(GamePassItem)?.updateReward();
            }
        });
        // const lsatBuyActive = this.NodeBuy.active;
        this.NodeBuy.active = this.NodeLock.active = !ModelMgr.I.GamePassModel.getPassRewardBuyStatus(this.passId);
        // if (lsatBuyActive && !this.NodeBuy.active) {
        //     MsgToastMgr.Show(i18n.tt(Lang.com_buy_success));
        // }
    }

    private lastShowIndex: number = -1;

    // 更新显示阶段奖励
    private updateStagePrize() {
        const y = this.listView.content.position.y;
        let index = Math.floor((y + this.itemHeight * (this.visiableNum - 0.5)) / this.itemHeight);
        index = Math.min(index, this.indexLength - 1);
        const stage: number = this.cfg.getValueByIndex(this.indexs[index], 'MaxStageNum');
        const bigIndex = this.cfg.getPassBigPrizeIndexByStage(stage);
        const bigCfg: Cfg_Stage_PassLevel = this.cfg.getValueByIndex(bigIndex);
        if (this.lastShowIndex !== bigIndex) {
            this.lastShowIndex = bigIndex;
            const item = bigCfg.Prize2.split(':');
            UtilItem.Show(this.bigPrizeNode, UtilItem.NewItemModel(+item[0], +item[1]), { option: { needNum: true, needName: true } }, (itemicon) => {
                const lab = itemicon.node.getChildByName('LabName').getComponent(cc.Label);
                lab.fontSize = 24;
                lab.lineHeight = 24;
                lab.node.y = -68;
            });
            const obj = Config.Get<ConfigStageIndexer>(Config.Type.Cfg_Stage).getChapterInfo(bigCfg.MaxStageNum);
            this.bigPrizeLabel.string = UtilString.FormatArgs(i18n.tt(Lang.gamepass_bigprize_title), obj.chapter, obj.level);
            this.NodeYlq.active = ModelMgr.I.GamePassModel.isYlqReward(EGamePassRewardType.Buy, bigCfg.Key);
        }
    }

    private onBuyClicked() {
        let rmb = 68;
        const cfgPassName: Cfg_Stage_PassName = Config.Get(Config.Type.Cfg_Stage_PassName).getValueByKey(this.passId);
        if (cfgPassName) {
            const cfgCharge: Cfg_ChargeMall = Config.Get(Config.Type.Cfg_ChargeMall).getValueByKey(cfgPassName.GoodsId);
            if (cfgCharge) {
                rmb = cfgCharge.Money / 100;
            }
        }
        const allBuyRewards: { [id: number]: number } = cc.js.createMap(true);
        const canRewards: { [id: number]: number } = cc.js.createMap(true);
        for (let i = 0, n = this.indexs.length; i < n; i++) {
            const cfg = ModelMgr.I.GamePassModel.getPassRewardCfg(this.passId, this.indexs[i]);
            // console.log(cfg);

            if (cfg.Prize2) {
                const item = cfg.Prize2.split(':');
                if (allBuyRewards[+item[0]]) {
                    allBuyRewards[+item[0]] += +item[1];
                } else {
                    allBuyRewards[+item[0]] = +item[1];
                }
                if (RoleMgr.I.d.Stage > cfg.MaxStageNum) {
                    if (canRewards[+item[0]]) {
                        canRewards[+item[0]] += +item[1];
                    } else {
                        canRewards[+item[0]] = +item[1];
                    }
                }
            }
        }
        const itemmodes1: ItemModel[] = [];
        const itemmodes2: ItemModel[] = [];
        for (const id in allBuyRewards) {
            itemmodes1.push(UtilItem.NewItemModel(+id, allBuyRewards[id]));
        }
        for (const id in canRewards) {
            itemmodes2.push(UtilItem.NewItemModel(+id, canRewards[id]));
        }

        MaterialRewardScanWin.Show(itemmodes1, itemmodes2, {
            btnFunc: () => {
                // const [cmd, data] = UtilGame.ParseGMStr(`stage@buy@${this.passId}`);
                // ControllerMgr.I.GMController.reqC2SGm(cmd, data);
                ControllerMgr.I.RechargeController.reqC2SChargeMallBuyReq(cfgPassName.GoodsId);
            },
            btnName: UtilString.FormatArgs(i18n.tt(Lang.gamepass_buy_money_text), rmb),
            title1: i18n.tt(Lang.gamepass_buy_title1),
            title2: i18n.tt(Lang.gamepass_buy_title2),
        });
    }

    private onGetReward(itemInfo: ItemInfo[]) {
        const arr = [];
        for (const item of itemInfo) {
            const itemModel: ItemModel = UtilItem.NewItemModel(item.ItemId, item.ItemNum);
            arr.push(itemModel);
        }
        WinMgr.I.open(ViewConst.GetRewardWin, arr);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.GamePass.UpdateInfo, this.onUpdateInfo, this);
        RoleMgr.I.off(this.onUpdateStage, this, RoleAN.N.Stage);
        EventClient.I.off(E.GamePass.GetReward, this.onGetReward, this);
    }
}
