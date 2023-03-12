import { EventClient } from '../../../../../../app/base/event/EventClient';
import WinMgr from '../../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import { DynamicImage } from '../../../../../base/components/DynamicImage';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import UtilItem from '../../../../../base/utils/UtilItem';
import { ItemIconOptions, ItemWhere } from '../../../../../com/item/ItemConst';
import { ItemIcon } from '../../../../../com/item/ItemIcon';
import ItemModel from '../../../../../com/item/ItemModel';
import { E } from '../../../../../const/EventName';
import { UI_PATH_ENUM } from '../../../../../const/UIPath';
import { ViewConst } from '../../../../../const/ViewConst';
import ModelMgr from '../../../../../manager/ModelMgr';
import { WishState } from '../GeneralRecruitConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class GeneralWishItem extends cc.Component {
    /** 图标 */
    private icon: ItemIcon = null;
    /** 物品加载中状态 */
    private loading: boolean = false;
    /** 选中 */

    @property(cc.Node)
    private StateAdd: cc.Node = null;
    @property(cc.Node)
    private StateLock: cc.Node = null;
    @property(cc.Node)
    private StateChange: cc.Node = null;
    @property(cc.Node)
    private StateSelect: cc.Node = null;
    @property(cc.Node)
    private StateAlready: cc.Node = null;

    @property(DynamicImage)
    private SprLeftTopFlag: DynamicImage = null;

    public loadIcon(data: ItemModel, optional?: ItemIconOptions): void {
        if (this.loading) { return; }

        const offClick = !!(optional && optional.offClick);
        if (this.icon) {
            this.icon.setData(data, {
                where: ItemWhere.OTHER, needName: false, needNum: true, hideLeftLogo: true, offClick,
            });
        } else {
            this.loading = true;
            ResMgr.I.showPrefab(UI_PATH_ENUM.Com_Item_ItemIcon, this.node.children[0], (err, node) => {
                this.loading = false;
                if (err) { return; }
                const icon = node.getComponent(ItemIcon);
                if (icon) {
                    icon.setData(data, {
                        where: ItemWhere.OTHER, needName: false, needNum: true, hideLeftLogo: true, offClick,
                    });
                    this.icon = icon;
                }
                this.getComponent(cc.Sprite).enabled = false;
            });
        }
    }

    public clearIcon(): void {
        if (this.icon) {
            this.icon.node.destroy();
            this.icon = null;
            this.getComponent(cc.Sprite).enabled = true;
        }
    }

    public touchClick(isLong: boolean): void {
        // if (this._state === WishState.lock) {
        //     MsgToastMgr.Show('功能未开启');
        //     return;
        // }
        if (isLong) {
            WinMgr.I.open(ViewConst.ItemTipsWin, this._itemModel, { where: ItemWhere.OTHER });
        } else {
            // 当前点击 判断是否已经开启了

            const tabIdx: number = this._tabIdx;// 当前选中这个
            const model = ModelMgr.I.GeneralRecruitModel;

            // 1 在已完成列表
            const isInGetList: boolean = model.isInWishGet(this._actId, tabIdx);// 是否在选中列表里
            if (isInGetList) {
                MsgToastMgr.Show(i18n.tt(Lang.general_alreadyGet));
                return;// 展示直接走展示信息
            }

            // 2 在选择列表里，删除
            const inInSelectList: boolean = model.inInSelectList(tabIdx);// 是否在选中列表里
            if (inInSelectList) {
                console.log('删除已选中列表里的');
                model.deleteTempWishListItem(tabIdx);
                this.setData(this._tabIdx, this._actId, this._idx);
                return;
            }

            // 当前选中的类型在哪个库
            const wishType: number = model.getWishTypeByTbaleIdx(tabIdx);
            // 当前库总共可以选几个
            const curCanSeletNum: number = model.getWishNumByType(this._actId, wishType);
            console.log(`当前类型的库，可以选：${curCanSeletNum} 个`);

            // 获取已经选的个数 要在tempList里选
            const curSelectNum = model.getAlreadySelectNum(wishType);
            console.log(`当前类型的已经选了选：${curSelectNum} 个`);

            if (curSelectNum + 1 > curCanSeletNum) {
                MsgToastMgr.Show(i18n.tt(Lang.general_limit));
                return;
            }

            // 3  不在列表里 加入列表
            const curSelectNumArr: number[] = model.getCurSelectNum();
            const maxSelectNum = model.getCfgWishNum(this._actId);
            if (curSelectNumArr.length + 1 > maxSelectNum) {
                MsgToastMgr.Show(i18n.tt(Lang.general_limit));
                return;
            }

            // 加入之前也要判断是否达到当前库上限
            model.addTempWishList(tabIdx);
            // this._curSelectNum();// 更新底部选中个数
            EventClient.I.emit(E.GeneralRecruit.UpdateWishSelectNum);
            this.setData(this._tabIdx, this._actId, this._idx);
        }
    }

    private _tabIdx: number = 0;
    private _idx: number = 0;
    private _actId: number = 0;
    private _itemModel: ItemModel;
    private _state: WishState;
    public setData(tabIdx: number, actId: number, index: number, bol: boolean = false): void {
        this._tabIdx = tabIdx;
        this._idx = index;
        this._actId = actId;
        // this.loadIcon(itemModel);
        const model = ModelMgr.I.GeneralRecruitModel;
        const item: Cfg_Server_GeneralZhaoMu = model.getCfgZhaoMu(tabIdx);
        const itemModel: ItemModel = UtilItem.NewItemModel(item.ItemId, 1);
        this._itemModel = itemModel;

        // 当前的索引,在选中列表？

        const isInGetList: boolean = model.isInWishGet(actId, tabIdx);// 是否在选中列表里
        const inInSelectList: boolean = model.inInSelectList(tabIdx);// 是否在选中列表里
        // tabIdx 是否在 已完成列表
        if (isInGetList) {
            this.setState(WishState.already);
        } else if (inInSelectList) {
            this.setState(WishState.select);
        } else {
            this.setState(WishState.none);
        }

        this.refreshLeftLogo(itemModel.cfg.LeftLogo, bol);
    }

    public setState(state: WishState): void {
        this.StateLock.active = false;
        this.StateAdd.active = false;
        this.StateChange.active = false;
        this.StateSelect.active = false;
        this.StateAlready.active = false;
        switch (state) {
            case WishState.lock:// 锁
                this._state = WishState.lock;
                this.StateLock.active = true;
                break;
            case WishState.add:// 空的时候 +
                this._state = WishState.add;
                this.StateAdd.active = true;
                this.SprLeftTopFlag.node.active = false;
                this.clearIcon();
                break;
            case WishState.change:// 拥有未实现 变化
                this._state = WishState.change;
                this.StateChange.active = true;
                break;
            case WishState.select:// 选中
                this._state = WishState.select;
                this.StateSelect.active = true;
                break;
            case WishState.already:// 已实现
                this._state = WishState.already;
                this.StateAlready.active = true;
                break;
            default:
                this._state = WishState.none;
                this.StateAdd.active = false;
                this.StateChange.active = false;
                this.StateSelect.active = false;
                this.StateAlready.active = false;
                break;
        }
    }

    /**
     * 刷新左上角标
     * @param logoId 图片ID
     */
    public refreshLeftLogo(logoId: number, isHideLeftLogo?: boolean): void {
        const leftFlagPath = UtilItem.GetItemLeftFlagPath(logoId);
        if (leftFlagPath && !isHideLeftLogo) {
            this.SprLeftTopFlag.loadImage(leftFlagPath, 1, true);
            this.SprLeftTopFlag.node.active = true;
        } else {
            this.SprLeftTopFlag.node.active = false;
        }
    }
    // /**
    //  * 显示概率 或者显示必得
    //  * @param show 是否显示
    //  * @param isGL 显示概率 true 显示必得 false
    //  */
    // public showGLBD(show: boolean, isGL: boolean): void {
    //     this.SpGL.active = show && isGL;
    //     this.SpBD.active = show && !isGL;
    // }
}
