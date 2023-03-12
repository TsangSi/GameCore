/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/*
 * @Author: dcj
 * @Date: 2022-10-24 17:53:51
 * @FilePath: \SanGuo\assets\script\game\module\equip\gem\v\GemEquipItem.ts
 * @Description:
 */
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { UtilColorFull } from '../../../../base/utils/UtilColorFull';
import { UtilEquip } from '../../../../base/utils/UtilEquip';
import UtilItem from '../../../../base/utils/UtilItem';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import ItemModel from '../../../../com/item/ItemModel';
import { EquipPartGem } from '../GemModel';

const { ccclass, property } = cc._decorator;

@ccclass
export class GemEquipItem extends cc.Component {
    @property({ type: cc.Label, displayName: CC_DEV && '道具等级' })
    private LabLevel: cc.Label = null;

    @property({ type: DynamicImage, displayName: CC_DEV && '道具图标' })
    private SprIcon: DynamicImage = null;

    /** 图标 */
    @property(ItemIcon)
    private icon: ItemIcon = null;

    /** 默认装备图标 */
    @property(DynamicImage)
    private SprDefaultIcon: DynamicImage = null;

    /* 提示文本背景 */
    @property(cc.Node)
    private NdTipBg: cc.Node = null;

    /* 提示文本 如果绑定会显示未装备 */
    @property(cc.Node)
    private NdTip: cc.Node = null;

    @property(cc.Node)
    private NdGems: cc.Node = null;

    @property(cc.Node)
    private NdLock: cc.Node = null;

    @property(cc.Node)
    private NdAdd: cc.Node = null;

    @property(cc.Node)
    private NdEvent: cc.Node = null;

    @property(cc.Node)
    private gemBg: cc.Node = null;

    public hideIcon() {
        if (this.SprIcon) this.SprIcon.node.active = false;
        if (this.LabLevel) this.LabLevel.node.active = false;
        return this;
    }

    public loadIcon(data: ItemModel, opts?: any) {
        this.icon.setData(data, opts);
        if (this.SprIcon) this.SprIcon.node.active = true;
        return this;
    }

    public setGems(data: EquipPartGem[]): void {
        if (this.NdGems) {
            this.gemBg.active = false;
            for (let i = 0; i < 5; ++i) {
                const v = data && data[i];
                const parent = this.NdGems.children[i];
                const nd = parent.children[0];
                if (!nd) continue;
                const spr = nd.getComponent(cc.Sprite);
                if (v && v.curGemId) {
                    console.log(i, v.curGemId);
                    const model = UtilItem.NewItemModel(v.curGemId, 1);
                    ResMgr.I.loadLocal(UtilItem.GetItemIconPath(model.cfg.PicID), cc.SpriteFrame, (err, spriteFrame: cc.SpriteFrame) => {
                        spr.spriteFrame = spriteFrame;
                        const scale = 16 / Math.max(nd.width, nd.height);
                        nd.scale = scale;
                    });
                    parent.active = true;
                    this.gemBg.active = true;
                } else {
                    parent.active = false;
                }
            }
            this.NdGems.getComponent(cc.Layout).updateLayout();
        }
    }

    /** 默认图标 */
    public showTip(active: boolean = false, bkActive: boolean = false, str: string = null) {
        this.NdTip.active = active;
        if (this.NdTipBg) {
            // 美术说暂时移除
            this.NdTipBg.active = false;
            // this.NdTipBg.active = bkActive;
            // if (bkActive) {
            //     this.scheduleOnce(() => {
            //         if (this.NdTipBg && this.NdTip) this.NdTipBg.width = this.NdTip.width + 42;
            //     });
            // }
        }
        const cmp = this.NdTip.getComponent(cc.Label);
        if (cmp) {
            cmp.string = str || i18n.tt(Lang.strength_unequip);
            UtilColorFull.resetMat(cmp);
            this.NdTip.color = this.NdTip.color.fromHEX(UtilColor.RedV);
        }
        return this;
    }

    public showEventNode(activate: boolean): void {
        this.NdEvent.active = activate;
    }

    public setLockNodeShow(show: boolean) {
        if (this.NdLock) {
            this.NdLock.active = show;
        }
        return this;
    }

    public setLevel(level: number) {
        if (this.LabLevel) {
            this.LabLevel.node.active = true;
            this.LabLevel.string = `${level}${i18n.lv}`;
        }
    }

    /** 默认图标 */
    public initDefaultIcon(active: boolean, equipPart?: number): void {
        if (active) {
            const equipIconStr: string = UtilEquip.getEquipIconByPart(equipPart);
            this.SprDefaultIcon.loadImage(equipIconStr, 1, false);
            this.icon.setData(null);
            this.icon.refreshQualityBg(0);
        }
        this.SprDefaultIcon.node.active = active;
    }

    public setAddNodeShow(show: boolean, labShow: boolean) {
        if (this.NdAdd) {
            this.NdAdd.active = show;
            this.NdAdd.getChildByName('LabAdd').active = labShow;
        }
        return this;
    }
}
