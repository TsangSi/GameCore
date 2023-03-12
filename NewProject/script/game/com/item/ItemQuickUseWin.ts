import { EventClient } from '../../../app/base/event/EventClient';
import { EffectMgr } from '../../manager/EffectMgr';
import { i18n, Lang } from '../../../i18n/i18n';
import { DynamicImage } from '../../base/components/DynamicImage';
import { NumberChoose } from '../../base/components/NumberChoose';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import { UtilEffectPath } from '../../base/utils/UtilEffectPath';
import { UtilGame } from '../../base/utils/UtilGame';
import { E } from '../../const/EventName';
import ControllerMgr from '../../manager/ControllerMgr';
import { BagMgr } from '../../module/bag/BagMgr';
import WinBase from '../win/WinBase';
import { ItemType } from './ItemConst';
import { ItemIcon } from './ItemIcon';
import ItemModel from './ItemModel';
import { RES_ENUM } from '../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class ItemQuickUseWin extends WinBase {
    // -----------道具使用----------
    @property(cc.Node)
    private NdUseBox: cc.Node = null;
    /** 道具ItemIcon */
    @property(ItemIcon)
    private NdUseItemIcon: ItemIcon = null;
    /** 关闭道具使用 */
    @property(cc.Sprite)
    private SprUseCloseButton: cc.Sprite = null;
    /** 道具数量+-框 */
    @property(NumberChoose)
    private NdUseNumChoose: NumberChoose = null;
    /** 使用道具 */
    @property(cc.Node)
    private BtnUse: cc.Node = null;

    // ---------装备穿戴---------
    @property(cc.Node)
    private NdWearBox: cc.Node = null;
    /** 装备ItemIcon */
    @property(ItemIcon)
    private NdWearEquipIcon: ItemIcon = null;
    /** 装备关闭按钮 */
    @property(cc.Sprite)
    private SprWearCloseButton: cc.Sprite = null;
    /** 装备按钮 */
    @property(cc.Node)
    private BtnWear: cc.Node = null;

    // ------穿戴装备后特效部分-----
    @property(cc.Node)
    private NdEquipBar: cc.Node = null;
    /** 发光动画节点 */
    @property(cc.Node)
    private NdAnimations: cc.Node[] = [];
    /** 8个飞的图标 */
    @property(DynamicImage)
    private SprEquipIcons: DynamicImage[] = [];

    // 当前这个顶层的ItemModel
    private _currItemModel: ItemModel;

    private _wearArr: ItemModel[];

    protected start(): void {
        super.start();
        UtilGame.Click(this.SprUseCloseButton.node, () => {
            this.close();
        }, this);
        UtilGame.Click(this.SprWearCloseButton.node, () => {
            this.close();
        }, this, { scale: 0.9 });
        // 使用道具
        UtilGame.Click(this.BtnUse, () => {
            if (this._useNum > 0) {
                this.NdUseBox.active = false;
                ControllerMgr.I.BagController.reqC2SExchange(this._currItemModel.data.OnlyId, this._useNum);
                this.close();
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.com_msg_choose_count));
            }
        }, this);
        // 穿戴装备
        UtilGame.Click(this.BtnWear, this.WearEquip, this);

        EventClient.I.on(E.ItemQU.GetBox, this._onGetBox, this);
        EventClient.I.on(E.ItemQU.GetEquip, this._onGetEquip, this);
    }

    public WearEquip(): void {
        this.NdWearBox.active = false;
        this.unscheduleAllCallbacks();

        // if (this._currItemModel.cfg.Type === ItemType.EQUIP) {
        this._wearArr = [];
        EventClient.I.on(E.Role.WearEquipSuccess, this.onWearEquipSuccess, this);
        /** 当前需要穿戴的装备 */
        this._initEquipInfo();
        /** 池子里 */
        this._wearArr = this.getFinalWearEquip(this._currItemModel);
        const onlyIds: string[] = [];
        for (const item of this._wearArr) {
            // 装备待穿列表里的装备。有可能在穿上之前。被升星等操作移除了。此时，就没有可以穿的了
            const num: number = BagMgr.I.getItemNum(item.data.ItemId);
            if (num) {
                onlyIds.push(item.data.OnlyId);
            }
        }
        if (onlyIds.length) {
            ControllerMgr.I.RoleController.reqC2SWearEquip(onlyIds);
        } else {
            EventClient.I.off(E.Role.WearEquipSuccess, this.onWearEquipSuccess, this);
        }
        // } else { // 使用道具
        //     ControllerMgr.I.BagController.reqC2SExchange(this._currItemModel.data.OnlyId, this._currItemModel.data.ItemNum);
        //     this.close();
        // }
    }

    public onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.ItemQU.GetBox, this._onGetBox, this);
        EventClient.I.off(E.ItemQU.GetEquip, this._onGetEquip, this);
    }

    /** 获得装备 */
    private _onGetEquip(itemModel: ItemModel) {
        // 如果是宝箱 需要将宝箱放回map  并且关闭当前宝箱UI
        if (this.NdUseBox.active) {
            // 当前是宝箱界面 需要顶掉宝箱 此处是否存在引用
            BagMgr.I.addQuickUseItemMap(this._currItemModel.data.OnlyId, this._currItemModel);
            this.close();
        } else if (itemModel.cfg.EquipPart === this._currItemModel.cfg.EquipPart && itemModel.fightValue > this._currItemModel.fightValue) {
            // 如果当前打开是装备 是同个部位 则判断战力
            this.close();
            // 如果是不同部位 不做处理
        }
    }

    /** 获得宝箱 */
    private _onGetBox(onlyId: string): void {
        // 如果当前宝箱是激活页面
        if (!this.NdUseBox.active) return;
        // 并且获得的宝箱就是当前这种类型宝箱，那么需要更新数量。
        if (onlyId === this._currItemModel.data.OnlyId) {
            this.close();
            const num = BagMgr.I.getItemNum(this._currItemModel.data.OnlyId);
            this.NdUseNumChoose.curCount = num;// itemModel.data.ItemNum;
        }
    }

    private _posArr: number[] = [-301, -215, -129, -43, 43, 129, 215, 301];
    public init(param?: unknown[]): void {
        this._hideAll();

        let itemModel = param[0] as ItemModel;
        if (!itemModel) {
            itemModel = BagMgr.I.getQuickUseItem();
        }
        this._currItemModel = itemModel;

        if (itemModel.cfg.Type === ItemType.EQUIP) {
            this.setWearButtonName(i18n.tt(Lang.com_btn_equip));// 装备 倒计时开始
            this._resetNodeItemPos();
            this.NdWearEquipIcon.setData(itemModel, { needName: true, isDarkBg: true });
            this.NdWearBox.active = true;
        } else {
            this.NdUseNumChoose.setMaxCount(itemModel.data.ItemNum);
            const num = BagMgr.I.getItemNum(itemModel.data.OnlyId);
            this.NdUseNumChoose.curCount = num;// itemModel.data.ItemNum;
            this.NdUseItemIcon.setData(itemModel, { needName: true, isDarkBg: true });
            this.NdUseBox.active = true;
        }
    }

    protected close(): void {
        this.unscheduleAllCallbacks();
        const itemModel = BagMgr.I.getQuickUseItem();
        if (itemModel) {
            this.init([itemModel]);
        } else {
            super.close();
        }
    }

    /** 隐藏所有 */
    private _hideAll() {
        this.NdEquipBar.active = false;
        this.NdUseBox.active = false;
        this.NdWearBox.active = false;
        this.SprEquipIcons.forEach((v) => v.node.active = false);
    }

    public getFinalWearEquip(currItemModel: ItemModel): ItemModel[] {
        // 比对当前这件 & 队列池的 是否存在同一个部位
        // 如果存在  则需要比对战力
        // 否则 push this._currItemModel
        const equips: ItemModel[] = BagMgr.I.getQuickUseSameRoleEquips();
        if (!equips.length) {
            return [currItemModel];
        }
        for (let i = equips.length - 1; i >= 0; i--) {
            let item = equips[i];
            if (item.cfg.EquipPart === currItemModel.cfg.EquipPart) {
                if (item.fightValue > currItemModel.fightValue) {
                    item = currItemModel;
                    return equips;
                } else {
                    equips.splice(i, 1);
                }
            }
        }
        equips.push(currItemModel);
        return equips;
    }

    private onWearEquipSuccess() {
        EventClient.I.off(E.Role.WearEquipSuccess, this.onWearEquipSuccess, this);
        this.NdEquipBar.active = true;
        this._playSpreadAni();
    }
    /** 播放底部8件装备展开动画 */
    private _playSpreadAni(): void {
        this._resetNodeItemPos();

        let n: number = 0;
        this.NdEquipBar.children.forEach((node: cc.Node, idx: number) => {
            cc.tween(node).to(0.5, { x: this._posArr[idx], y: 0 }, { easing: 'cubicOut' }).call(() => {
                n++;
                if (n === 8) { // 8件展开之后
                    n = 0;
                    this.fallDownEquip();
                }
            }).start();
        });
    }
    /** 当前穿戴装备落到格子里 */
    private fallDownEquip() {
        if (!(this._wearArr && this._wearArr.length)) {
            return;
        }
        const len = this._wearArr.length;

        for (let i = 0; i < len; i++) {
            const data = this._wearArr[i];
            const SprIcon: DynamicImage = this.SprEquipIcons[i];
            SprIcon.loadImage(`${RES_ENUM.Item}${data.cfg.PicID}`, 1, true);
            SprIcon.node.active = true;
            const equipPart: number = data.cfg.EquipPart;// 装备部位1 2 3 4 5 6 7 8

            cc.tween(SprIcon.node).to(0.3, { x: this._posArr[equipPart - 1], y: this.NdEquipBar.position.y }).call(() => {
                const itemIcon: ItemIcon = this.NdEquipBar.children[equipPart - 1].getComponentInChildren(ItemIcon);
                itemIcon.setData(data);
                const effNode: cc.Node = this.NdAnimations[equipPart - 1];
                if (effNode && cc.isValid(effNode)) {
                    effNode.destroyAllChildren();
                }
                const eff = UtilEffectPath.getRoleEquipEffUrl();
                if (eff) {
                    EffectMgr.I.showEffect(eff, effNode, null, () => {
                        this.scheduleOnce(() => {
                            if (effNode && cc.isValid(effNode)) {
                                effNode.destroyAllChildren();
                            }
                        }, 1);
                    });
                }
                if (i === len - 1) {
                    this.scheduleOnce(() => {
                        this._resetNodeItemPos();
                        this.close();
                    }, 1);
                }
            }).start();
        }
    }

    /** 将底部list的Item位置全部置0 */
    private _resetNodeItemPos(): void {
        this.NdEquipBar.children.forEach((node: cc.Node) => {
            node.x = 0;
            node.y = 0;
        });

        /** icon位置置为0 */
        this.SprEquipIcons.forEach((v: DynamicImage) => {
            v.node.x = 0;
            v.node.y = 0;
        });
    }

    /** 初始化装备信息 */
    private _initEquipInfo(): void { // 获取角色身上穿戴列表
        const roleEquipList = BagMgr.I.getOnEquipMapWithEquipPart();
        this.NdEquipBar.children.forEach((node: cc.Node, idx: number) => { // 8个部位 idx:= 0 1 2 3 4 5 6 7
            const item = roleEquipList.get(idx + 1);
            if (item) {
                const itemIcon = node.getComponentInChildren(ItemIcon);
                itemIcon.setData(item);
            }
        });
    }

    private setWearButtonName(name: string) {
        let second = 5;
        const label = this.BtnWear.getComponentInChildren(cc.Label);
        label.string = `${name}(${second}${i18n.tt(Lang.com_second)})`;
        this.schedule(() => {
            second--;
            if (second === 0) {
                // BagMgr.I.deleteAllQuickUserEquip();// 倒计时结束 需要清除所有装备 剩余道具
                // this.close();
                this.WearEquip();
                return;
            }
            label.string = `${name}(${second}${i18n.tt(Lang.com_second)})`;
        }, 1);
    }

    /** 物品数量变化增减 */
    private _useNum: number = 0;
    private onNumberChooseChange(num: number): void {
        this._useNum = num;
    }
}
