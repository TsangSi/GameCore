/*
 * @Author: kexd
 * @Date: 2023-01-17 11:27:07
 * @FilePath: \SanGuo2.4\assets\script\game\module\escort\com\RecordItem.ts
 * @Description: 被劫记录item
 *
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { NickShowType } from '../../../base/utils/UtilGame';
import { RoleInfo } from '../../role/RoleInfo';
import { i18n, Lang } from '../../../../i18n/i18n';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import LostItem from './LostItem';

const { ccclass, property } = cc._decorator;
@ccclass
export default class RecordItem extends BaseCmp {
    @property(cc.Label)
    private LabName: cc.Label = null;
    @property(cc.Label)
    private LabFv: cc.Label = null;
    @property(cc.Label)
    private LabResult: cc.Label = null;
    @property(cc.Label)
    private LabLost: cc.Label = null;
    @property(cc.Node)
    private NdLost: cc.Node = null;

    protected start(): void {
        super.start();
    }

    /**
     * 展示
     * @param itemId 道具id
     * @param exp 经验
     * @param isSelected 选中状态
     * @param callback 回调
     */
    public setData(log: CarRobLog): void {
        const info = new RoleInfo(log.UserShowInfo);
        this.LabName.string = info.getAreaNick(NickShowType.ArenaNick);
        this.LabFv.string = `${i18n.tt(Lang.com_txt_fv)} ${info.FightValue}`;
        //
        if (log.IsDefeSucc) {
            this.LabResult.string = i18n.tt(Lang.escort_def_sucess);
            this.LabResult.node.color = UtilColor.ColorEnough;
            this.LabLost.string = i18n.tt(Lang.escort_sucess);
            this.LabLost.node.active = true;
            this.NdLost.active = false;
        } else {
            this.LabResult.string = i18n.tt(Lang.escort_def_fail);
            this.LabResult.node.color = UtilColor.Hex2Rgba('#736764');
            this.LabLost.node.active = false;
            this.NdLost.active = true;
            // 损失
            ResMgr.I.loadLocal(UI_PATH_ENUM.LostItem, cc.Prefab, (err, p: cc.Prefab) => {
                if (err || !this.NdLost || !this.NdLost.isValid) return;
                if (p) {
                    for (let i = 0; i < log.LostRewardInfo.length; i++) {
                        const nd = cc.instantiate(p);
                        nd.getComponent(LostItem).setData(log.LostRewardInfo[i].ItemId, log.LostRewardInfo[i].ItemNum);
                        this.NdLost.addChild(nd);
                    }
                }
            });
        }
    }
}
