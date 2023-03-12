/*
 * @Author: wangxin
 * @Date: 2022-10-14 15:31:50
 * @FilePath: \SanGuo2.4\assets\script\game\module\rankList\v\RankInfoItem.ts
 */

import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilHead from '../../../base/utils/UtilHead';
import { RES_ENUM } from '../../../const/ResPath';
import ModelMgr from '../../../manager/ModelMgr';
import { ArmyLvConst } from '../../roleOfficial/roleArmyLevel/ArmyLvConst';
import { Max_Vip_Level } from '../../vip/VipConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class RankInfoItem extends cc.Component {
    @property(DynamicImage)
    private DyBg: DynamicImage = null;

    @property(cc.Label)
    private LbNo: cc.Label = null;

    @property(DynamicImage)
    private DyNo: DynamicImage = null;

    @property(cc.Node)
    private NdHead: cc.Node = null;

    @property(cc.Sprite)
    private SprHead: cc.Sprite = null;

    @property(cc.Node)
    private NdVipBg: cc.Node = null;

    // 比拼内容
    @property(cc.Node)
    private NdBattle: cc.Node = null;

    @property(cc.Node)
    private NdFarmily: cc.Node = null;

    @property(cc.Label)
    private NdName: cc.Label = null;

    @property(cc.Node)
    private NdLook: cc.Node = null;

    protected start(): void {
        // start
    }

    public setData(data: { RankNo: number, Name: string }): void {
        // 设置名字
        this.NdName.string = data.Name;
        if (data.RankNo === 2 || data.RankNo === 3) {
            this.DyBg.loadImage(`${RES_ENUM.RankList_Bg_Rank}${data.RankNo}_di`, 1, true);
            this.DyNo.node.active = true;
            this.DyNo.loadImage(`${RES_ENUM.RankList_Bg_Rank}${data.RankNo}`, 1, true);
        } else {
            this.DyBg.loadImage(RES_ENUM.RankList_Bg_Rank_Di, 1, true);
            this.DyNo.node.active = false;
        }
        this.LbNo.string = data.RankNo.toString();
    }

    public setInfo(tValue: string, bValue: string, isArmy: number, vip: number = 0, fValue: string = '无', color: string = '#538959'): void {
        // 战力榜// 装备榜// 等级榜// 武将榜// 官职榜 // 军衔榜// 坐骑榜// 光武榜 // 羽翼榜
        const battleTile: string = tValue;

        this.NdBattle.getChildByName('SprArmy').active = isArmy > -1;
        let valueColor: string = color;
        if (isArmy >= 0) {
            const img = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(isArmy);
            this.NdBattle.getChildByName('SprArmy').getComponent(DynamicImage).loadImage(img, 1, true);
            const colorStr: string = ArmyLvConst.getLvColorByArmyLV(isArmy, true);
            valueColor = colorStr;
            if (isArmy === 0) {
                bValue = '';
            }
            // const sprUi = this.NdBattle.getChildByName('SprArmy').getComponent(UITransform);
            // sprUi.width /= 2;
            // sprUi.height /= 2;
        }
        const battleValue: string = bValue;
        this.setLayoutLable(this.NdBattle, battleTile, battleValue, UtilColor.NorN, valueColor);
        const farmilyTilie: string = `${i18n.tt(Lang.com_framly)}:`;
        const farmilyValue: string = fValue;
        this.NdVipBg.active = vip > 0;
        this.NdHead.setPosition(cc.v2(1, vip > 0 ? 11.4 : 0));

        // eslint-disable-next-line max-len
        this.NdVipBg.getComponentInChildren(cc.Label).string = ModelMgr.I.VipModel.getVipName(vip);
        // `${vip > Max_Vip_Level ? i18n.tt(Lang.open_svip) : i18n.tt(Lang.open_vip)}${vip > Max_Vip_Level ? vip - Max_Vip_Level : vip}`;
        this.setLayoutLable(this.NdFarmily, farmilyTilie, farmilyValue);
    }

    public setHead(headId: number): void {
        UtilHead.setHead(headId, this.SprHead, 1, null);
    }

    public setLayoutLable(_node: cc.Node, Lb0: string, Lb1: string, color0: string = UtilColor.NorN, color1: string = '#538959'): void {
        const LbNode0 = _node.getChildByName('Lb0').getComponent(cc.Label);
        const LbNode1 = _node.getChildByName('Lb1').getComponent(cc.Label);
        LbNode0.string = Lb0;
        LbNode1.string = Lb1;
        LbNode0.node.color = UtilColor.Hex2Rgba(color0);
        LbNode1.node.color = UtilColor.Hex2Rgba(color1);
    }

    public clickInfo(): void {
        // 打开玩家详细信息
        console.log('玩家详细信息');
    }
}
