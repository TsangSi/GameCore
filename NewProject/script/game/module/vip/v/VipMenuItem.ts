/*
 * @Author: myl
 * @Date: 2022-08-16 10:22:39
 * @Description:
 */
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListItem from '../../../base/components/listview/ListItem';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class VipMenuItem extends ListItem {
    @property(cc.Node)
    private NdBg: cc.Node = null;

    @property(cc.Label)
    private itemName: cc.Label = null;

    @property(cc.Label)
    private lvLab: cc.Label = null;

    @property(DynamicImage)
    private SprItem: DynamicImage = null;

    @property(cc.Node)
    private NdItem: cc.Node = null;

    protected start(): void {
        UtilGame.Click(this.node, () => {
            // 通过此处来选择选中
            this.list.selectedId = this._index;
        }, this, { scale: 1 });
    }

    private _data: Cfg_VIP = null;
    private _index: number = 0;
    public setData(data: Cfg_VIP, index: number, isRed: boolean = true): void {
        this._data = data;
        this._index = index;
        this.itemName.string = data.PrizeName.slice(0, 5);
        this.lvLab.string = `${data.VIPLevel > 10 ? data.VIPLevel - 10 : data.VIPLevel}${i18n.tt(Lang.equip_lev)}`;

        UtilRedDot.UpdateRed(this.node, isRed, cc.v2(70, 35));

        /** 是第一个的类型 直接分割取0 */
        const res = this._data.Prize.split(':')[0];
        const item = UtilItem.NewItemModel(parseInt(res));
        this.SprItem.loadImage(UtilItem.GetItemIconPath(item.cfg.PicID, RoleMgr.I.d.Sex), 1, true);
    }

    public updateSwitchUI(val: boolean): void {
        this.selectedFlag.active = val;
        this.NdBg.active = !val;
        // 背景宽度大小 [选中，未选中]
        // const bgW: number[] = [186, 163];
        // // lv 颜色 [选中， 未选中]
        // const lvColor: cc.Color[] = [new cc.Color(UtilColor.WhiteD), new cc.Color(UtilColor.NorV)];
        // // lv坐标
        // const lvPos = [v3(-45, 28), v3(-50, 28)];
        // // 道具节点坐标
        // const itemPos = [v3(36, 0), v3(23, 0)];
        // // const redDotPos = [v3(70, 40, 0), v3(70, 40, 0)];
        // this.selectedFlag.active = val;
        // const selectIdx: number = val ? 0 : 1;
        // this.NdBg.getComponent(UITransform).width = bgW[selectIdx];
        // this.lvLab.node.setPosition(lvPos[selectIdx]);
        // this.lvLab.color = lvColor[selectIdx];
        // this.NdItem.setPosition(itemPos[selectIdx]);
        // UtilRedDot.UpdateRed(this.node, this._redDot, redDotPos[val ? 0 : 1]);
    }
}
