/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import ListView from '../../../../../base/components/listview/ListView';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import WinBase from '../../../../../com/win/WinBase';
import ItemModel from '../../../../../com/item/ItemModel';
import ModelMgr from '../../../../../manager/ModelMgr';
import { BagMgr } from '../../../../bag/BagMgr';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import { DynamicImage } from '../../../../../base/components/DynamicImage';
import { WishState } from '../GeneralRecruitConst';
import { GeneralWishItem } from './GeneralWishItem';
import WinMgr from '../../../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../../../const/ViewConst';
import UtilItem from '../../../../../base/utils/UtilItem';
import { FuncId } from '../../../../../const/FuncConst';
import { Link } from '../../../../link/Link';
import { UtilColor } from '../../../../../../app/base/utils/UtilColor';
import { EventClient } from '../../../../../../app/base/event/EventClient';
import { E } from '../../../../../const/EventName';
import { UtilString } from '../../../../../../app/base/utils/UtilString';
import { RES_ENUM } from '../../../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class GeneralRecRewardWin extends WinBase {
    @property(ListView)
    private listGrid: ListView = null;

    @property(cc.Prefab)
    private wishItem: cc.Prefab = null;

    @property(cc.Node)
    private NdLessthan5: cc.Node = null;// 少于5个用这个不用list

    @property(cc.Node)
    private NdList: cc.Node = null;// 多余5个用List

    private listMinGridCount: number = 5;
    private listMaxGridCount: number = 200;

    @property(cc.Node)
    private BtnRecruit1: cc.Node = null;
    @property(cc.Node)
    private BtnRecruit10: cc.Node = null;
    @property(cc.Node)
    private BtnRecruit50: cc.Node = null;

    @property(cc.Node)
    private BtnFree: cc.Node = null;
    @property(cc.Node)
    private NdCost: cc.Node = null;
    @property(cc.Label)
    private LabNum1: cc.Label = null;
    @property(DynamicImage)
    private spr1: DynamicImage = null;
    // 招募10次
    @property(cc.Label)
    private LabNum10: cc.Label = null;
    @property(DynamicImage)
    private spr10: DynamicImage = null;
    @property(cc.Node)
    private NdDisCount10: cc.Node = null;
    @property(cc.Label)
    private LabDisCount10: cc.Label = null;

    // 招募50次
    @property(cc.Label)
    private LabNum50: cc.Label = null;
    @property(DynamicImage)
    private spr50: DynamicImage = null;
    @property(cc.Node)
    private NdDisCount50: cc.Node = null;
    @property(cc.Label)
    private LabDisCount50: cc.Label = null;

    @property(cc.Node)
    private NdRed10: cc.Node = null;
    @property(cc.Node)
    private NdRed50: cc.Node = null;

    // 积分
    @property(DynamicImage)
    private sprScore: DynamicImage = null;// 积分图标

    @property(cc.Label)// 当前积分
    private LabCurScore: cc.Label = null;

    @property(cc.Label)// 增加了多少
    private LabAddScore: cc.Label = null;

    @property(cc.Node)// 跳转积分
    private NdGoto: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });

        UtilGame.Click(this.BtnRecruit1, this._onRecrut, this, { customData: 1 });
        UtilGame.Click(this.BtnRecruit10, this._onRecrut, this, { customData: 10 });
        UtilGame.Click(this.BtnRecruit50, this._onRecrut, this, { customData: 50 });
        UtilGame.Click(this.NdGoto, () => {
            Link.To(FuncId.WuJiangShop);
            this.close();
        }, this);

        // UtilGame.Click(this.NdBtnSure, () => {
        //     this.close();
        // }, this);
    }
    /** 三个招募按钮 */

    private _initBtnStates() {
        // 1次 是否免费
        const num = ModelMgr.I.GeneralRecruitModel.getFreeNum(this._actId);// 获得免费次数
        this.BtnFree.active = num > 0;
        this.NdCost.active = num === 0;
        // 1次
        const [itemId1, num1] = ModelMgr.I.GeneralRecruitModel.getCfgCost(this._actId, 1);
        this.spr1.loadImage(`${RES_ENUM.Item}${itemId1}`, 1, true);
        // this.LabNum1.string = `${num1}`;
        const bagNum1 = BagMgr.I.getItemNum(itemId1);// 背包里的数量
        this.LabNum1.string = `${bagNum1}/${num1}`;
        this.LabNum1.node.color = bagNum1 >= num1 ? UtilColor.Green() : UtilColor.Red();

        // 10次
        const [itemId10, num10] = ModelMgr.I.GeneralRecruitModel.getCfgCost(this._actId, 10);
        this.spr10.loadImage(`${RES_ENUM.Item}${itemId10}`, 1, true);
        // this.LabNum10.string = `${num10}`;
        const bagNum10 = BagMgr.I.getItemNum(itemId10);// 背包里的数量
        this.NdRed10.active = bagNum10 >= num10;
        this.LabNum10.string = `${bagNum10}/${num10}`;
        this.LabNum10.node.color = bagNum10 >= num10 ? UtilColor.Green() : UtilColor.Red();

        // 是否显示折扣
        const bol10 = num10 / (10 * num1) !== 1;
        this.NdDisCount10.active = bol10;
        const discount10 = (num10 / (10 * num1)) * 10;
        if (bol10) this.LabDisCount10.string = `${discount10}${i18n.tt(Lang.general_disCount)}`;// 9折

        // 50次
        const [itemId50, num50] = ModelMgr.I.GeneralRecruitModel.getCfgCost(this._actId, 50);
        this.spr50.loadImage(`${RES_ENUM.Item}${itemId50}`, 1, true);
        // this.LabNum50.string = `${num50}`;
        const bagNum50 = BagMgr.I.getItemNum(itemId50);// 背包里的数量
        this.NdRed50.active = bagNum50 >= num50;

        this.LabNum50.string = `${bagNum50}/${num50}`;
        this.LabNum50.node.color = bagNum50 >= num50 ? UtilColor.Green() : UtilColor.Red();
        // 是否显示折扣
        const bol50 = num50 / (50 * num1) !== 1;
        this.NdDisCount50.active = bol50;
        const discount50 = (num50 / (50 * num1)) * 10;
        if (bol50) this.LabDisCount50.string = `${discount50}${i18n.tt(Lang.general_disCount)}`;// 9折
    }

    /** 招募 */
    private _onRecrut(target, num: number) {
        // 数量是否足够
        let bagNum = 0;
        if (num === 1) {
            const freeNum = ModelMgr.I.GeneralRecruitModel.getFreeNum(this._actId);// 获得免费次数
            if (freeNum) { // 有免费次数 啥也不管直接发
                this.reqLuckyDraw(num, 0);
                return;
            }
        }

        const [itemId, itemNum] = ModelMgr.I.GeneralRecruitModel.getCfgCost(this._actId, num);
        bagNum = BagMgr.I.getItemNum(itemId);
        if (bagNum >= itemNum) {
            this.reqLuckyDraw(num, 0);
        } else {
            let leftNum: number = 0;
            // 判断是否弹窗
            // 如果弹窗勾选了本次登录不在显示
            const isOpenTip: boolean = ModelMgr.I.GeneralRecruitModel.isOpenTip;
            if (isOpenTip) {
                const buyTimes = ModelMgr.I.GeneralRecruitModel.getBuyTimes(this._actId);
                const descStr = UtilString.FormatArgs(i18n.tt(Lang.general_BuyTimes), buyTimes);
                leftNum = itemNum - bagNum;
                WinMgr.I.open(ViewConst.GeneralAutoBuyTip, {
                    actId: this._actId, leftNum, num, descStr,
                });
                this.close();
                return;
            }

            /** 杜康酒配置 */
            const curItem: Cfg_ShopCity = ModelMgr.I.GeneralRecruitModel.getShopCfgByItemId(itemId);
            // 金币
            const price = curItem.GoodsPrice;// 1个杜康酒 需要 1000 金币
            const costNum = price * leftNum;

            const cfgItem: Cfg_Item = UtilItem.GetCfgByItemId(curItem.GoldType);

            const currencyNum = BagMgr.I.getItemNum(cfgItem.Id);
            if (costNum > currencyNum) {
                WinMgr.I.open(ViewConst.ItemSourceWin, curItem.GoldType);
                this.close();
            } else {
                this.reqLuckyDraw(num, 1);
            }
            //
        }
    }

    // 判断是否仓库超出最大容量
    private _checkMax(): boolean {
        // const len = ModelMgr.I.GeneralRecruitModel.getAllBagDataLen();
        const len = ModelMgr.I.GeneralRecruitModel.getCurBagLen(this._actId);
        // todo ask_: 常量表为什么要分一号仓库  WareHouse1
        const cfg: Cfg_Config_General = ModelMgr.I.GeneralRecruitModel.cfgActZhaoMuConfig.getValueByKey('WareHouse1');
        const maxGeneralLen = Number(cfg.CfgValue);

        if (len >= maxGeneralLen) {
            return true;
        }
        return false;
    }

    public reqLuckyDraw(num: number, autoBuy: number): void {
        this.removeLess5();
        this.close();

        // ControllerMgr.I.GeneralRecruitController.reqZhaoMuLuckyDraw(this._actId, autoBuy, num);

        if (this._checkMax()) {
            ModelMgr.I.MsgBoxModel.ShowBox(`<color=${UtilColor.NorV}>${i18n.tt(Lang.general_storefull)}</color>`, () => {
                ControllerMgr.I.GeneralRecruitController.reqZhaoMuLuckyDraw(this._actId, autoBuy, num);
            }, null);
        } else {
            ControllerMgr.I.GeneralRecruitController.reqZhaoMuLuckyDraw(this._actId, autoBuy, num);
        }
    }

    public onItemChange(changes: { itemModel: ItemModel, status: number }[]): void {
        for (let i = 0, len = changes.length; i < len; i++) {
            const [itemId, num1] = ModelMgr.I.GeneralRecruitModel.getCfgCost(this._actId, 1);
            if (itemId === changes[i].itemModel.data.ItemId) {
                this._initBtnStates();
                break;
            }
        }
    }

    protected close(): void {
        super.close();
        this.NdLessthan5.destroyAllChildren();
    }
    /**
     * 奖励列表
     * @param params
     */
    private _itemModelArr = [];
    private _actId: number;
    public init(params: [ItemModel[]] | any): void {
        this.removeLess5();

        this._itemModelArr = params[0];
        this._actId = params[1];

        this.NdList.active = this._itemModelArr.length > 5;
        this.NdLessthan5.active = this._itemModelArr.length <= 5;

        const data: S2CZhaoMuLuckyDraw = params[2];
        const num = data.Num;
        const score = data.Score;
        this.LabCurScore.string = `${score}`;
        const strScore: string = ModelMgr.I.GeneralRecruitModel.getCfgActZhaoMu(this._actId).Score;
        const arr: string[] = strScore.split(':');
        const [scItemId, scItemNum] = [Number(arr[0]), Number(arr[1])];
        const itemModel: ItemModel = UtilItem.NewItemModel(scItemId, scItemNum);
        // 招募次数*一次积分
        this.LabAddScore.string = `(+${num * scItemNum})`;

        this.sprScore.loadImage(UtilItem.GetItemIconPath(itemModel.cfg.PicID), 1, true);

        if (this._itemModelArr.length <= 5) {
            for (const itemModel of this._itemModelArr) {
                const wishItem = cc.instantiate(this.wishItem);
                wishItem.getChildByName('NdEvent').active = false;
                this.NdLessthan5.addChild(wishItem);

                const gwishItem: GeneralWishItem = wishItem.getComponent(GeneralWishItem);

                gwishItem.loadIcon(itemModel);
                gwishItem.setState(WishState.none);
                gwishItem.refreshLeftLogo(itemModel.cfg.LeftLogo, false);
            }
        } else {
            this.resetListHeight(400);
            this.initList();
        }

        this._initBtnStates();
        EventClient.I.on(E.Bag.ItemChange, this.onItemChange, this);
    }

    public onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Bag.ItemChange, this.onItemChange, this);
    }

    // 移除少于5个的
    public removeLess5(): void {
        for (let index = 0; index < this.NdLessthan5.children.length; index++) {
            const element = this.NdLessthan5.children[index];
            element.destroy();
        }
    }

    public initList(): void {
        const propCount = this._itemModelArr.length;
        const gridCount = Math.min(Math.max(propCount, this.listMinGridCount), this.listMaxGridCount);
        this.listGrid.setNumItems(gridCount, 0);
    }

    private resetListHeight(height: number): void {
        this.listGrid.node.height = height;
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const prop = this._itemModelArr[idx];

        node.getChildByName('NdEvent').active = false;
        const grid: GeneralWishItem = node.getComponent(GeneralWishItem);
        if (prop && grid) {
            grid.loadIcon(prop);
            grid.setState(WishState.none);
            grid.refreshLeftLogo(prop.cfg.LeftLogo, false);
        } else {
            grid?.destroy();
        }
    }
}
