/*
 * @Author: myl
 * @Date: 2022-08-30 10:21:24
 * @Description:
 */
import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import { UtilString } from '../../../../app/base/utils/UtilString';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { AssetType } from '../../../../app/core/res/ResConst';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { DynamicImage } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import UtilItemList from '../../../base/utils/UtilItemList';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import UtilTitle from '../../../base/utils/UtilTitle';
import { ItemWhere } from '../../../com/item/ItemConst';
import { E } from '../../../const/EventName';
import { FuncId } from '../../../const/FuncConst';
import { RES_ENUM } from '../../../const/ResPath';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { Link } from '../../link/Link';
import { RID } from '../../reddot/RedDotConst';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';
import { FuncAddState, Max_Vip_Level, UpdateViewEvent } from '../VipConst';
import { VipContentItem } from './VipContentItem';
import { VipMenuItem } from './VipMenuItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class VipView extends BaseUiView {
    @property(cc.Node)
    private NdTop: cc.Node = null;
    @property(ListView)
    private list: ListView = null;
    private _vipConfig: Cfg_VIP[] = [];
    @property(cc.Node)
    private contentView: cc.Node = null;
    @property(cc.Node)
    private bannerReward: cc.Node = null;
    @property(cc.Node)
    private btnAllFunc: cc.Node = null;
    @property(cc.Node)
    private BtnReward: cc.Node = null;
    @property(cc.Node)
    private NdRewarded: cc.Node = null;
    @property(cc.Node)
    private NdPrize: cc.Node = null;
    @property(cc.Node)
    private NdPower: cc.Node = null;
    @property(cc.Label)
    private LabFv: cc.Label = null;
    @property(cc.Label)
    private SprName: cc.Label = null;

    @property(cc.Node)
    private dailyBtn: cc.Node = null;
    @property(cc.Node)
    private shopBtn: cc.Node = null;

    protected onLoad(): void {
        super.onLoad();
        this.node.on(UpdateViewEvent, this.refreshUI, this);
        /** 添加vip等级提升监听 处理界面逻辑 */
        RoleMgr.I.on(this.configMenu, this, RoleAN.N.VipLevel);
    }

    private _pageIndex = 0;
    private refreshUI(idx: number) {
        this._pageIndex = idx;
        this.configMenu();
    }

    protected start(): void {
        super.start();
        UtilGame.Click(this.btnAllFunc, () => {
            // 打开查看特权
            WinMgr.I.open(ViewConst.VipContentTipWin, this._vipConfig[this.list.selectedId].VIPLevel);
        }, this, { unRepeat: true, time: 500 });

        UtilGame.Click(this.BtnReward, () => {
            const viplv = this._vipConfig[this.list.selectedId].VIPLevel;
            if (viplv <= RoleMgr.I.d.VipLevel) {
                ControllerMgr.I.VipController.collectReward(viplv);
            } else {
                MsgToastMgr.Show(i18n.tt(Lang.vip_cannot_reward_tip));
            }
        }, this, { unRepeat: true, time: 500 });

        UtilRedDot.Bind(RID.Vip.Vip.Svip.Daily, this.dailyBtn, cc.v2(20, 32));
        UtilGame.Click(this.dailyBtn, () => {
            if (RoleMgr.I.d.VipLevel < Max_Vip_Level) {
                MsgToastMgr.Show(i18n.tt(Lang.vip_daily_reward_cannot_accept));
                return;
            }
            WinMgr.I.open(
                ViewConst.WinReward,
                this._vipConfig[RoleMgr.I.d.VipLevel - Max_Vip_Level - 1].DayPrize,
                () => {
                    ControllerMgr.I.VipController.collectDayReward();
                },
                UtilString.FormatArray(i18n.tt(Lang.vip_daily_reward_title), [ModelMgr.I.VipModel.vipName(RoleMgr.I.d.VipLevel)]),
                ModelMgr.I.VipModel.dailyReward,
            );
        }, this, { unRepeat: true, time: 500 });

        UtilGame.Click(this.shopBtn, () => {
            Link.To(FuncId.VipShop);
            // WinMgr.I.open(ViewConst.ShopWin, ShopPageType.Discount, ShopChildType.Vip, { data: 11001 });
        }, this, { unRepeat: true, time: 500 });

        this.loadTopNd();
        // this.configMenu();

        EventClient.I.on(E.Vip.VipLvReward, this.refreshMenu, this);
    }

    private refreshMenu() {
        if (!this.node.active) return;
        this.list.updateItem(this.list.selectedId);
        const defaultLv = ModelMgr.I.VipModel.defaultSelectIndex(this._pageIndex === 0);
        if (defaultLv === this.list.selectedId) {
            this.list.forceSelectItem(defaultLv);
            return;
        }
        this.list.selectedId = defaultLv;// 选中是根据index来做的
        this.list.scrollTo(this.list.selectedId);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Vip.VipLvReward, this.refreshMenu, this);
        this.node.off(UpdateViewEvent, this.refreshUI, this);
        /** 移除玩家属性监听 */
        RoleMgr.I.off(this.refreshUI, this, RoleAN.N.VipLevel);
    }

    /** 顶部加载回调 */
    private loadTopNd() {
        ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Vip_VipInfoView, this.NdTop, (err, nd) => {
            //
        });
    }

    /** 左侧menu */
    private configMenu() {
        this._vipConfig = this._pageIndex === 0 ? ModelMgr.I.VipModel.getSVipConfig() : ModelMgr.I.VipModel.getVipConfig();
        this.list.setNumItems(this._vipConfig.length, 0);
        this.refreshMenu();

        const result = this._pageIndex === 0 && RoleMgr.I.d.VipLevel > Max_Vip_Level;
        this.dailyBtn.active = this.shopBtn.active = result;
    }

    /** scroll渲染回调 */
    private scrollEvent(nd: cc.Node, index: number) {
        const item = this._vipConfig[index];
        const red = ModelMgr.I.VipModel.itemHaveRed(item.VIPLevel);
        nd.getComponent(VipMenuItem).setData(item, index, red);
    }

    private scrollSelectEvent(nd: cc.Node, index: number) {
        this.setUpContent(index);
    }

    private setUpContent(index: number) {
        // 配置content条数
        const len = this.contentView.children.length;
        for (let j = 0; j < len; j++) {
            const nd = this.contentView.children[0];
            this.content_pool.put(nd);
        }
        const vipConf = this._vipConfig[index];
        const vipModel = ModelMgr.I.VipModel;
        const vip = vipConf.VIPLevel;
        const contents = vipModel.addFunc(vip);
        const len1 = Math.min(vipConf.PgCount, contents.length);
        for (let i = 0; i < len1; i++) {
            const item = contents[i];
            this.addContent(item);
        }
        this.BtnReward.active = !vipModel.itemHaveGet(vip);
        this.NdRewarded.active = !this.BtnReward.active;
        if (this.BtnReward.active) {
            const isRed = vipModel.itemHaveRed(vip);
            UtilRedDot.UpdateRed(this.BtnReward, isRed, cc.v2(80, 22));
        }
        UtilItemList.ShowItems(this.NdPrize, vipConf.Prize, { option: { needNum: true, needName: false, where: ItemWhere.OTHER } });
        this.bannerReward.destroyAllChildren();
        this.bannerReward.removeAllChildren();
        this.bannerReward.setScale(cc.v2(1, 1));
        const scalConf = vipModel.resTypePath(vipConf.PrizeType);

        if (vipConf.PrizeType === 1) {
            const nd = new cc.Node();
            nd.setScale(cc.v2(scalConf.scale, scalConf.scale));
            nd.parent = this.bannerReward;
            const spr = nd.addComponent(cc.Sprite);
            const item = UtilItem.NewItemModel(parseInt(vipConf.PrizeResId));
            cc.tween(nd)
                .repeatForever(
                    cc.tween().by(1, { position: cc.v2(0, 10) })
                        .by(1, { position: cc.v2(0, -10) }),
                )
                .start();
            // UtilItemList.ShowItemArr(nd, [item], { option: { where: ItemWhere.OTHER } });
            // UtilCocos.LoadSpriteFrameRemote(spr, `${RES_ENUM.Item}${vipConf.PrizeResId}`, AssetType.cc.SpriteFrame);
            UtilCocos.LoadSpriteFrameRemote(spr, UtilItem.GetItemIconPath(item.cfg.PicID, RoleMgr.I.d.Sex), AssetType.SpriteFrame);
        } else {
            this.bannerReward.setScale(cc.v2(scalConf.scale, scalConf.scale));
            if (vipConf.PrizeType === 2) {
                // 皮肤分男女
                const resid = vipConf.PrizeResId.split('|')[RoleMgr.I.d.Sex === 1 ? 0 : 1];
                EntityUiMgr.I.createEntity(this.bannerReward, { resId: resid, resType: ANIM_TYPE.ROLE, isPlayUs: false });
            } else if (vipConf.PrizeType === 16) {
                // eslint-disable-next-line dot-notation
                this.bannerReward['titleRes'] = 0;
                UtilTitle.setTitle(this.bannerReward, parseInt(vipConf.PrizeResId));
            } else {
                EntityUiMgr.I.createEntity(this.bannerReward, { resId: vipConf.PrizeResId, resType: ANIM_TYPE.PET, isPlayUs: false });
            }
        }

        // 是否需要显示战力
        const needShowPower = vipConf.isShowFv;
        if (needShowPower === 1) {
            this.NdPower.active = true;
            // 获取战力值
            const item = vipConf.Prize.split('|')[0];
            const power = UtilItem.GetItemPower(item);
            this.LabFv.string = power.toString();
        } else {
            this.NdPower.active = false;
        }
        // this.SprName.loadImage(`${RES_ENUM.Vip_Gift_Com_Font_Vip}${vipConf.NamePic}`, 1, true);
        this.SprName.string = vipConf.PrizeName;
    }

    private content_pool: cc.NodePool = new cc.NodePool();
    /** 添加数据 */
    private addContent(content: { funcState: FuncAddState, desc: string }) {
        const nd = this.content_pool.get();
        if (nd) {
            const contentItem = nd.getComponent(VipContentItem);
            this.contentView.addChild(nd);
            contentItem.setData(content);
        } else {
            ResMgr.I.showPrefab(UI_PATH_ENUM.Module_Vip_VipContentItem, this.contentView, (err, loadNd: cc.Node) => {
                const contentItem1 = loadNd.getComponent(VipContentItem);
                contentItem1.setData(content);
            });
        }
    }
}
