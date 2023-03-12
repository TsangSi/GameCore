/*
 * @Author: zs
 * @Date: 2022-07-15 15:46:31
 * @FilePath: \SanGuo2.4\assets\script\game\module\roleskin\v\com\RoleSkinSuitInfo.ts
 * @Description:
 *
 */

import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { EffectMgr } from '../../../../manager/EffectMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { AttrBase } from '../../../../base/attribute/AttrBase';
import {
    EAttrType, IAttrBase,
} from '../../../../base/attribute/AttrConst';
import { AttrModel } from '../../../../base/attribute/AttrModel';
import { SpriteCustomizer } from '../../../../base/components/SpriteCustomizer';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { EActiveStatus } from '../../../../const/GameConst';
import { SUIT_PART_STAR } from '../RoleSkinConst';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { UtilAttr } from '../../../../base/utils/UtilAttr';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import { RES_ENUM } from '../../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class RoleSkinSuitInfo extends cc.Component {
    @property(cc.Node)
    protected NodeInfo: cc.Node = null;
    protected attrs: AttrBase[][] = [];
    protected hasCount: number = 0;
    protected activeStatus: EActiveStatus[] = [];
    @property(DynamicImage)
    private icon: DynamicImage = null;

    /**
     *
     * @param attrIds 属性id列表
     * @param activeStatus 激活状态列表
     * @param hasCount 已有数量
     */
    // eslint-disable-next-line max-len
    public setData(
        attrIds: number[],
        activeStatus: EActiveStatus[] = [EActiveStatus.UnActive, EActiveStatus.UnActive,
        EActiveStatus.UnActive],
        hasCount: number = 0,
        func: (num: number) => void = undefined,
        suitId: number = 0,
    ): void {
        this.hasCount = hasCount;
        this.activeStatus = activeStatus;
        for (let i = 0, n = attrIds.length; i < n; i++) {
            const node = this.NodeInfo.children[i] || cc.instantiate(this.NodeInfo.children[0]);
            if (!this.NodeInfo.children[i]) {
                this.NodeInfo.addChild(node);
            }
            this.updateCountName(node, i + SUIT_PART_STAR);
            const attrInfo = AttrModel.MakeAttrInfo(attrIds[i]);
            this.attrs[i] = attrInfo.attrs;
            this.updateAttrAndStatu(node, this.attrs[i], activeStatus[i]);
            if (func) {
                node.targetOff(this);
                UtilGame.Click(node, () => {
                    if (activeStatus[i] === EActiveStatus.CanActive) {
                        func(i + SUIT_PART_STAR);
                    }
                }, this);
            }
        }
    }

    // eslint-disable-next-line max-len
    public updateActiveStatus(activeStatus?: EActiveStatus[], hasCount?: number): void {
        if (activeStatus && activeStatus.length) {
            this.activeStatus = activeStatus;
        }
        if (hasCount !== undefined && hasCount !== null) {
            this.hasCount = hasCount;
        }
        for (let i = 0, n = this.NodeInfo.children.length; i < n; i++) {
            const node = this.NodeInfo.children[i];

            this.updateCount(node, i + SUIT_PART_STAR);
            this.updateAttrAndStatu(node, this.attrs[i], this.activeStatus[i]);
        }
    }

    /** 更新名字 */
    private updateCountName(node: cc.Node, suitCount: number) {
        UtilCocos.SetString(node, 'NodeTitle/LabelName', i18n.tt(Lang[`roleskin_suit_${suitCount}`]));
        this.updateCount(node, suitCount);
    }

    /** 更新数量 */
    private updateCount(node: cc.Node, suitCount: number) {
        const str = UtilString.FormatArgs(i18n.tt(Lang.com_number_kuohao), this.hasCount, suitCount);
        const labelCount = UtilCocos.SetString(node, 'NodeTitle/LabelCount', str) as cc.Label;
        if (this.hasCount && this.hasCount >= suitCount) {
            labelCount.node.color = UtilColor.Green();
        } else {
            labelCount.node.color = UtilColor.Red();
        }
    }

    /** 更新属性和激活状态 */
    private updateAttrAndStatu(node: cc.Node, attrs: IAttrBase[], activeStatu: EActiveStatus) {
        let nameC = UtilColor.GreyV;
        let valueC = UtilColor.GreyV;
        if (activeStatu === EActiveStatus.Active) {
            nameC = UtilColor.NorV;
            valueC = UtilColor.GreenV;
        }
        const nodeAttrs = node.getChildByName('NodeAttrs');
        for (let i = 0, n = Math.max(attrs.length, nodeAttrs.children.length); i < n; i++) {
            let node: cc.Node;
            const element: IAttrBase = attrs[i];
            if (element) {
                node = nodeAttrs.children[i] || cc.instantiate(nodeAttrs.children[0]);
                if (!nodeAttrs.children[i]) {
                    nodeAttrs.addChild(node);
                }
            } else {
                node = nodeAttrs.children[i];
                if (node) {
                    node.destroy();
                    nodeAttrs.removeChild(node);
                    node = null;
                }
            }
            if (node) {
                const name = element.name || UtilAttr.GetAttrName(element.attrType);
                const value = element.value;
                UtilCocos.SetString(node, 'LabelName', name);
                UtilCocos.SetString(node, 'LabelValue', `+${value}`);
                UtilCocos.SetColor(node, 'LabelName', nameC);
                UtilCocos.SetColor(node, 'LabelValue', valueC);

                const dyImgNd = node.getChildByName('Icon');
                const dyImg = dyImgNd.getComponent(DynamicImage) || dyImgNd.addComponent(DynamicImage);
                dyImg.loadImage(UtilAttr.getIconByAttrType(element.attrType), 1, true);
            }
        }

        const spritecus = node.getChildByName('SpriteStatu')?.getComponent(SpriteCustomizer);
        if (spritecus) {
            spritecus.curIndex = activeStatu || 0;
        }

        if (activeStatu === EActiveStatus.CanActive) {
            EffectMgr.I.showEffect(RES_ENUM.Com_Ui_102, node, cc.WrapMode.Loop);
        } else {
            EffectMgr.I.delEffect(RES_ENUM.Com_Ui_102, node);
        }
    }
}
