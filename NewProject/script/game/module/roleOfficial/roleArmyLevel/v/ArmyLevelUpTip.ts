import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { i18n } from '../../../../../i18n/i18n';
import { IAttrBase } from '../../../../base/attribute/AttrConst';
import { DynamicImage } from '../../../../base/components/DynamicImage';

import { UtilGame } from '../../../../base/utils/UtilGame';
import { NdAttrBaseContainer } from '../../../../com/attr/NdAttrBaseContainer';
import WinBase from '../../../../com/win/WinBase';
import ModelMgr from '../../../../manager/ModelMgr';
import { RoleMgr } from '../../../role/RoleMgr';
import { ArmyLvConst } from '../ArmyLvConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class ArmyLevelUpTip extends WinBase {
    //
    @property(cc.Node)
    private NdSprMask: cc.Node = null;

    @property(DynamicImage)
    private sprCurrIcon: DynamicImage = null;
    @property(DynamicImage)
    private sprNextIcon: DynamicImage = null;

    @property(DynamicImage)
    private sprCurrName: DynamicImage = null;
    @property(DynamicImage)
    private sprNextName: DynamicImage = null;

    @property(cc.Label)
    private LabCurrName: cc.Label = null;
    @property(cc.Label)
    private LabNextName: cc.Label = null;

    @property(cc.Node)
    private SprArrow1: cc.Node = null;
    @property(cc.Node)
    private SprArrow2: cc.Node = null;

    @property(cc.Node)
    private NdCurAttrContainer: cc.Node = null;
    @property(cc.Node)
    private NdNextAttrContainer: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => {
            this.close();
        }, this, { scale: 1 });
    }

    public init(params: any): void {
        this._updateAttr();
    }

    /** 更新属性 */
    private _updateAttr() {
        const armyLevel = RoleMgr.I.getArmyLevel();
        const armyStar = RoleMgr.I.getArmyStar();

        // const isMax: boolean = ModelMgr.I.ArmyLevelModel.isArmyLvMax(armyLevel, armyStar);
        // if (isMax) { // 只显示当前等级
        //     this.NdCurAttrContainer.position.x = -40;
        //     this.NdCurAttrContainer.position.y = -118;
        //     this.NdNextAttrContainer.active = false;

        //     this.sprCurrIcon.node.position.x = 0;
        //     this.sprCurrIcon.node.position.y = 81;
        //     this.sprNextIcon.node.active = false;

        //     this.sprCurrName.node.position.x = -50;
        //     this.sprCurrName.node.position.y = 164;
        //     this.sprNextName.node.active = false;

        //     this.LabCurrName.node.position.x = 60;
        //     this.LabCurrName.node.position.y = 164;

        //     this.LabNextName.node.active = false;

        //     this.SprArrow1.active = false;
        //     this.SprArrow2.active = false;

        //     // 只需要显示当前的name lv 属性
        //     const curAttr: IAttrBase[] = ModelMgr.I.ArmyLevelModel.getAttrInfo(armyLevel, armyStar);
        //     this.NdCurAttrContainer.getComponent(NdAttrBaseContainer).init(curAttr);
        //     // 名称
        //     let url: string = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(armyLevel);
        //     this.sprCurrName.loadImage(url, 1, true);
        //     // 等级
        //     this.LabCurrName.string = `${armyStar}${i18n.lv}${i18n.lv}`;// xx级
        //     const colorStr: string = ArmyLvConst.getLvColorByArmyLV(armyLevel, true);
        //     this.LabCurrName.node.color = UtilColor.Hex2Rgba(colorStr);
        //     // 图标
        //     url = ModelMgr.I.ArmyLevelModel.getIconByArmyLv(armyLevel);
        //     this.sprCurrIcon.loadImage(url, 1, true);
        // } else {
        // 已经升上来了
        const currArmyLv: number = armyLevel;// 1
        const currStar: number = armyStar;// 1

        let beforeArmyLv: number;
        let beforeArmyStar: number;

        if (currArmyLv === 1 && currStar === 1) {
            beforeArmyLv = 1;
            beforeArmyStar = 1;
        } else if (currStar === 1) {
            beforeArmyLv = currArmyLv - 1;
            beforeArmyStar = 5;
        } else {
            beforeArmyLv = currArmyLv;
            beforeArmyStar = currStar - 1;
        }

        // const currArmyLv: number = armyLevel;// 1
        // const currStar: number = armyStar;// 5

        // 只需要显示当前的name lv 属性
        const curAttr: IAttrBase[] = ModelMgr.I.ArmyLevelModel.getAttrInfo(beforeArmyLv, beforeArmyStar);

        const coloneBaseAttr: IAttrBase[] = JSON.parse(JSON.stringify(curAttr));
        if (currArmyLv === 1 && currStar === 1) {
            for (const item of coloneBaseAttr) {
                item.value = 0;
            }
            this.NdCurAttrContainer.getComponent(NdAttrBaseContainer).init(
                coloneBaseAttr,
                0,
                { nameC: UtilColor.GreenD, valueC: UtilColor.GreenD },
            );
        } else {
            this.NdCurAttrContainer.getComponent(NdAttrBaseContainer).init(
                curAttr,
                0,
                { nameC: UtilColor.GreenD, valueC: UtilColor.GreenD },
            );
        }
        // 名称
        let url: string = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(beforeArmyLv);
        if (currArmyLv === 1 && currStar === 1) { // 平民
            url = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(0);
            this.LabCurrName.node.active = false;
        } else {
            this.LabCurrName.node.active = true;
            // 等级
            this.LabCurrName.string = `${beforeArmyStar}${i18n.lv}`;// 级
        }

        let colorStr: string = ArmyLvConst.getLvColorByArmyLV(beforeArmyLv, true);
        this.LabCurrName.node.color = UtilColor.Hex2Rgba(colorStr);

        this.sprCurrName.loadImage(url, 1, true);
        // 图标
        url = ModelMgr.I.ArmyLevelModel.getIconByArmyLv(beforeArmyLv);
        this.sprCurrIcon.loadImage(url, 1, true);

        //---------------------
        const nextArmyLv: number = currArmyLv;
        const nextArmyStar: number = currStar;
        // if (currStar === 5) {
        //     nextArmyLv = currArmyLv + 1;// 2
        //     nextArmyStar = 1;// 1
        // } else {
        //     nextArmyLv = currArmyLv;
        //     nextArmyStar = currStar + 1;
        // }

        // 只需要显示当前的name lv 属性
        const nextAttr: IAttrBase[] = ModelMgr.I.ArmyLevelModel.getAttrInfo(nextArmyLv, nextArmyStar);
        this.NdNextAttrContainer.getComponent(NdAttrBaseContainer).init(
            nextAttr,
            0,
            { nameC: UtilColor.GreenD, valueC: UtilColor.GreenD },
        );
        // 名称
        url = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(nextArmyLv);
        this.sprNextName.loadImage(url, 1, true);
        // 等级
        this.LabNextName.string = `${nextArmyStar}${i18n.lv}`;// 级
        colorStr = ArmyLvConst.getLvColorByArmyLV(nextArmyLv, true);
        this.LabNextName.node.color = UtilColor.Hex2Rgba(colorStr);
        // 图标
        url = ModelMgr.I.ArmyLevelModel.getIconByArmyLv(nextArmyLv);
        this.sprNextIcon.loadImage(url, 1, true);
    }
    // }
}
