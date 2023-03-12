/*
 * @Author: myl
 * @Date: 2022-10-18 14:25:32
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { AttrModel } from '../../../../base/attribute/AttrModel';
import { E } from '../../../../const/EventName';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import ModelMgr from '../../../../manager/ModelMgr';
import { SealAmuletStarItem } from './SealAmuletStarItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class SealAmuletStarContentView extends cc.Component {
    @property(cc.Node)
    private NdAtt1: cc.Node = null;
    @property(cc.Node)
    private NdAtt2: cc.Node = null;
    @property(cc.Node)
    private NdAtt3: cc.Node = null;
    @property(cc.Node)
    private NdAtt4: cc.Node = null;
    @property(cc.Node)
    private NdAtt5: cc.Node = null;
    @property(cc.Node)
    private NdAtt6: cc.Node = null;
    @property(cc.Node)
    private NdAtt7: cc.Node = null;
    @property(cc.Node)
    private NdAtt8: cc.Node = null;

    @property(cc.Node)
    private NdSkill: cc.Node = null;

    private _data: OfficeSign = null;

    protected start(): void {
        EventClient.I.on(E.SealAmulet.UpStar, this.setUpView, this);
    }

    public setUpView(data: OfficeSign): void {
        this._data = data;
        // 1星是0孔 2-9星是1-8孔
        // 孔位计算是根据增量计算 也就是说每次都计算 当前星与上一星的差值 最小为 2-1星对比
        ResMgr.I.showPrefab(UI_PATH_ENUM.Module_SealAmulet_SealAmuletStarItem, null, (err, nd: cc.Node) => {
            this.addChildByInfo(2, this.NdAtt1, nd, 0, 1);
            this.addChildByInfo(3, this.NdAtt2, nd, -45, 2);
            this.addChildByInfo(4, this.NdAtt3, nd, -90, 3);
            this.addChildByInfo(5, this.NdAtt4, nd, -135, 4);
            this.addChildByInfo(6, this.NdAtt5, nd, 180, 5);
            this.addChildByInfo(7, this.NdAtt6, nd, -225, 6);
            // this.addChildByInfo(8, this.NdAtt7, nd, -270, 7);
            // this.addChildByInfo(9, this.NdAtt8, nd, -315, 8);
        });
    }

    private addChildByInfo(pos: number, nd: cc.Node, child: cc.Node, angle, limit: number) {
        const model = ModelMgr.I.SealAmuletModel;
        const curInfo = model.getAttByStar(this._data.Type, this._data.Star, pos - 1);
        const att = AttrModel.MakeAttrInfo(curInfo.Attr);
        const curInfo1 = model.getAttByStar(this._data.Type, this._data.Star, pos);
        const att1 = AttrModel.MakeAttrInfo(curInfo1.Attr);
        const nd1 = nd.children[0] ?? cc.instantiate(child);
        // nd.addChild(nd1);
        if (!nd1.parent) {
            nd1.parent = nd;
        }
        let st = 0;
        if (this._data.StarPos > limit) {
            st = 2;
        } else if (this._data.StarPos === limit) {
            st = 1;
        } else {
            st = 0;
        }
        nd1.getComponent(SealAmuletStarItem).setData(att, att1, angle, st);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.SealAmulet.UpStar, this.setUpView, this);
    }
}
