/*
 * @Author: wangxin
 * @Date: 2022-09-29 11:21:08
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\module\DaySign\v\DaySignItem.ts
 */
import WinMgr from '../../../../../../app/core/mvc/WinMgr';
import { EffectMgr } from '../../../../../manager/EffectMgr';
import { DynamicImage } from '../../../../../base/components/DynamicImage';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import UtilItem from '../../../../../base/utils/UtilItem';
import { ItemWhere } from '../../../../../com/item/ItemConst';
import { ItemIcon } from '../../../../../com/item/ItemIcon';
import ItemModel from '../../../../../com/item/ItemModel';
import { ViewConst } from '../../../../../const/ViewConst';
import UtilRedDot from '../../../../../base/utils/UtilRedDot';
import { Config } from '../../../../../base/config/Config';
import { BagMgr } from '../../../../bag/BagMgr';
import { RES_ENUM } from '../../../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class DaySignItem extends cc.Component {
    @property(cc.Node)
    private PosItemIcon: cc.Node = null;

    @property(cc.Prefab)
    private preItemIcon: cc.Prefab = null;
    @property(DynamicImage)
    private NdTag: DynamicImage = null;
    @property(cc.Node)
    private NdMask: cc.Node = null;
    @property(cc.Label)
    private sigDay: cc.Label = null;
    @property(cc.Node)
    private NdfenxianR: cc.Node = null;

    protected start(): void {
        // start
    }

    public setData(ActFuncId: number, itemId: number, itemNum: number, idx: number, tag: number, sigDay: number, CurDay: number): void {
        this.PosItemIcon.removeAllChildren();
        this.PosItemIcon.destroyAllChildren();
        const itemModel: ItemModel = UtilItem.NewItemModel(itemId, itemNum);
        const item = cc.instantiate(this.preItemIcon);
        item.getComponent(ItemIcon).setData(itemModel, { needNum: true, where: ItemWhere.OTHER });
        this.PosItemIcon.addChild(item);
        this.sigDay.string = sigDay.toString();
        this.NdfenxianR.active = (idx + 1) % 5 !== 0 || idx + 1 === 1;
        this.NdTag.node.active = tag !== 0;

        let isRed: boolean = false;
        this.NdMask.targetOff(this);
        if (tag === 0) {
            // 待签到
            this.NdMask.active = false;
            if (sigDay === CurDay) {
                // 加可领取角标
                EffectMgr.I.showEffect(RES_ENUM.Item_Ui_117, item);
                this.NdTag.loadImage(RES_ENUM.Com_Font_Com_Font_Zhuangtai_03, 1, true);
                this.NdTag.node.active = true;
                // item.getComponent(ItemIcon).refreshStreamerEffect(ItemQuality.RED);
            }
        } else if (tag === 1) {
            // 再领一次
            EffectMgr.I.showEffect(RES_ENUM.Item_Ui_117, item);
            this.NdMask.active = false;
            this.NdTag.loadImage(RES_ENUM.Com_Font_Com_Font_Zhuangtai_04, 1, true);
            this.NdTag.node.active = true;
        } else if (tag === 2) {
            // 已领取
            this.NdMask.active = true;
            this.NdMask.getComponent(cc.BlockInputEvents).enabled = false;
            this.NdTag.loadImage(RES_ENUM.Com_Img_Com_Img_Gou, 0, false);
            this.NdTag.node.active = true;
            UtilGame.Click(this.NdMask, () => {
                WinMgr.I.open(ViewConst.ItemTipsWin, itemModel, item.getComponent(ItemIcon).getTipsOptions());
            }, this.NdMask);
        } else if (tag === 3) {
            // 可补签
            UtilGame.Click(this.NdMask, () => {
                WinMgr.I.open(ViewConst.DaySignRe, ActFuncId, sigDay, itemId, itemNum);
            }, this.NdMask);
            this.NdTag.loadImage(RES_ENUM.Com_Font_Com_Font_Zhuangtai_02, 1, true);

            const indexer = Config.Get(Config.Type.Cfg_Server_DailySignConst);
            const signConst: string = indexer.getValueByKey('RemedyCost', 'CfgValue');
            const cost = signConst.split(':');
            const id = parseInt(cost[0]);
            const need = parseInt(cost[1]);
            const have = BagMgr.I.getItemNum(id);
            isRed = have >= need;
        }
        UtilRedDot.UpdateRed(this.node, isRed, cc.v2(50, 65));
    }
}
