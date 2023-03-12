/*
 * @Author: myl
 * @Date: 2022-11-17 11:41:05
 * @Description:
 */

import { DynamicImage } from '../../../base/components/DynamicImage';
import ListItem from '../../../base/components/listview/ListItem';
import { StarLabelComponent } from '../../../base/components/StarLabelComponent';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilHead from '../../../base/utils/UtilHead';
import UtilItem from '../../../base/utils/UtilItem';
import UtilItemList from '../../../base/utils/UtilItemList';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import ModelMgr from '../../../manager/ModelMgr';
import { RoleMgr } from '../../role/RoleMgr';
import { HeadItemData, HeadPhotoType } from '../HeadConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class HeadItem extends ListItem {
    @property(cc.Node)
    private NdSelect: cc.Node = null;
    @property(cc.Node)
    private NdNormal: cc.Node = null;
    @property(cc.Node)
    private SprIcon: cc.Node = null;
    @property(StarLabelComponent)
    private starLab: StarLabelComponent = null;
    @property(cc.Node)
    private NdLock: cc.Node = null;
    // @property(DynamicImage)
    // private BgQuality: DynamicImage = null;
    @property(cc.Node)
    private NdUsing: cc.Node = null;

    private _data: HeadItemData = null;

    private _index: number = 0;
    protected start(): void {
        UtilGame.Click(this.node, () => {
            // 通过此处来选择选中
            this.list.selectedId = this._index;
        }, this, { scale: 1 });
    }

    public setData(data: HeadItemData, idx: number, type: number): void {
        this._data = data;
        this._index = idx;
        this.NdLock.active = data.data === undefined || data.data === null;

        const itemId = data.cfg.StarUpItem;
        UtilItem.NewItem(this.SprIcon, itemId, { option: { offClick: true } });

        this.starLab.updateStars(data.data ? data.data.Star : 0);
        if (data.data && data.data.Status === 1) {
            this.NdUsing.active = true;
        } else {
            this.NdUsing.active = false;
        }
        const { active, star } = ModelMgr.I.HeadModel.getRedState(data);

        if (idx !== 0) UtilRedDot.UpdateRed(this.node, active || star, cc.v2(55, 60));

        this.starLab.node.active = data.cfg.Unlock !== 1;
    }

    public updateSwitchUI(val: boolean): void {
        this.selectedFlag.active = val;
        this.NdNormal.active = !val;
    }
}
