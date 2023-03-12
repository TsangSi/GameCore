import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { i18n } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import ListView from '../../../../base/components/listview/ListView';
import { UtilGame } from '../../../../base/utils/UtilGame';
import WinBase from '../../../../com/win/WinBase';
import ModelMgr from '../../../../manager/ModelMgr';
import { RoleMgr } from '../../../role/RoleMgr';
import { ArmyLvConst } from '../ArmyLvConst';
import { PreViewItem } from './PreViewItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class ArmyPreviewTip extends WinBase {
    //
    @property(cc.Node)
    private NdSprMask: cc.Node = null;

    @property(ListView)
    private list: ListView = null;

    // 等级 星级
    @property(cc.Label)
    private LabLv: cc.Label = null;

    @property(DynamicImage)
    private SprName: DynamicImage = null;

    @property(cc.Sprite)
    private SprTop: cc.Sprite = null;

    @property(cc.Sprite)
    private SprBottom: cc.Sprite = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;

    private _allCfg: Cfg_ArmyGrade[];
    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.BtnClose, this.close, this);
        // 列表长度
        const len: number = ModelMgr.I.ArmyLevelModel.getAllCfgArmyGradeLenth();
        this.list.setNumItems(len - 1, 0);

        // 当前等级
        // list滑动到当前等级
        const armyLevel: number = RoleMgr.I.getArmyLevel();
        const armyStar: number = RoleMgr.I.getArmyStar();

        let n = 0;
        for (let i = 0; i < this._allCfg.length; i++) {
            const item = this._allCfg[i];
            if (item.ArmyLevel === armyLevel && item.ArmyStar === armyStar) {
                n = i;
                break;
            }
        }

        this.list.scrollTo(n);
    }

    public init(params: any): void {
        this._allCfg = ModelMgr.I.ArmyLevelModel.getAllCfgArmyGrade();
        this._updateName();
        this._updateLv();

        //
    }

    /** 更新名字 */
    private _updateName(): void {
        const armyLevel: number = RoleMgr.I.getArmyLevel();
        const url: string = ModelMgr.I.ArmyLevelModel.getNameIconByArmyLv(armyLevel);
        this.SprName.loadImage(url, 1, true);
    }

    /** 更新等级与颜色 */
    private _updateLv(): void {
        const armyLevel: number = RoleMgr.I.getArmyLevel();
        const armyStar: number = RoleMgr.I.getArmyStar();
        if (!armyStar) {
            this.LabLv.node.active = false;
            return;
        }
        this.LabLv.node.active = true;
        this.LabLv.string = `${armyStar}${i18n.lv}`;
        const colorStr: string = ArmyLvConst.getLvColorByArmyLV(armyLevel, true);
        this.LabLv.node.color = UtilColor.Hex2Rgba(colorStr);
    }

    private scrollEvent(node: cc.Node, index: number) {
        if (index <= 5) {
            this.SprTop.node.active = false;
            this.SprBottom.node.active = true;
        } else if (index >= this._allCfg.length - 6) {
            this.SprTop.node.active = true;
            this.SprBottom.node.active = false;
        } else {
            this.SprTop.node.active = true;
            this.SprBottom.node.active = true;
        }
        const item: PreViewItem = node.getComponent(PreViewItem);
        item.setData(this._allCfg[index]);
    }
}
