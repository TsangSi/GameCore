/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { EventClient } from '../../../../../../app/base/event/EventClient';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import ListView from '../../../../../base/components/listview/ListView';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import UtilItem from '../../../../../base/utils/UtilItem';
import ItemModel from '../../../../../com/item/ItemModel';
import WinBase from '../../../../../com/win/WinBase';
import { E } from '../../../../../const/EventName';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { GeneralWishItem } from './GeneralWishItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class GeneralWishTip extends WinBase {
    //
    @property(cc.Node)
    private NdSprMask: cc.Node = null;

    /** 概率列表 */
    @property(ListView)
    private heroList: ListView = null;

    @property(cc.Node)
    private BtnSure: cc.Node = null;
    @property(cc.Node)
    private BtnCancel: cc.Node = null;

    @property([cc.Toggle])
    private arrToggle: cc.Toggle[] = [];

    @property(cc.Label)
    private labHeroNum: cc.Label = null;
    @property(cc.Label)
    private LabSelectNum: cc.Label = null;

    @property(cc.Node)
    private BtnClose: cc.Node = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => this.close(), this, { scale: 1 });

        UtilGame.Click(this.BtnCancel, () => this.close(), this);
        UtilGame.Click(this.BtnSure, this._onSureClick, this);
        UtilGame.Click(this.BtnClose, () => {
            this.close();
        }, this);

        for (let i = 0, len = this.arrToggle.length; i < len; i++) {
            this.arrToggle[i].node.on('toggle', () => {
                this._onToggle(i);
            }, this);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.GeneralRecruit.SetWish, this._onSetWish, this);
    }

    private _onSetWish(data: S2CZhaoMuSetWish) {
        if (data.FuncId === this._actFuncId) {
            MsgToastMgr.Show(i18n.tt(Lang.general_setWish));// 设置许愿成功
            this.close();
        }
    }

    // 确定
    private _onSureClick() {
        const model = ModelMgr.I.GeneralRecruitModel;
        const wishList: number[] = model.getCurSelectNum();
        ControllerMgr.I.GeneralRecruitController.reqC2SZhaoMuSetWish(this._actFuncId, wishList);
    }

    private _onToggle(idx: number): void {
        console.log('单前选中了哪个');
        console.log(idx);
        this._initBtnState(idx);
    }

    private _actFuncId: number = 0;
    public init(params: [{ actId: number }]): void {
        EventClient.I.on(E.GeneralRecruit.SetWish, this._onSetWish, this);
        EventClient.I.on(E.GeneralRecruit.UpdateWishSelectNum, this._curSelectNum, this);
        this._actFuncId = params[0].actId;// 当前活动ID
        // 当前最多可以选择的数量
        const wishNum = ModelMgr.I.GeneralRecruitModel.getCfgWishNum(this._actFuncId);

        this.labHeroNum.string = `${wishNum}${i18n.tt(Lang.arena_ming)}`;
        // 进入UI 就要将当前选中的 放入临时列表
        ModelMgr.I.GeneralRecruitModel.initTempWishList(this._actFuncId);

        this._initListCfg();
        // 初始默认选中第一个
        this._initBtnState(0);
    }

    private _initListCfg() {
        const model = ModelMgr.I.GeneralRecruitModel;
        // 仓库类型[1,2]
        const wishTypeArr: number[] = model.getCfgWishTypeArr(this._actFuncId);
        const allCfgId: number[] = model.getAllCfg(this._actFuncId, wishTypeArr);// 16 17 18 7 8 9
        model.setListByAllCfg(allCfgId);
    }

    private _initBtnState(idx: number) {
        for (let i = 0, len = this.arrToggle.length; i < len; i++) {
            if (idx === i) {
                this.arrToggle[i].isChecked = true;
            } else {
                this.arrToggle[i].isChecked = false;
            }
        }
        // 选中哪个 就初始数据
        this._initList(idx);
        // 当前已经选中了几个
        this._curSelectNum();
    }

    // 每次点击都要判断当前选中
    private _curSelectNum(): void {
        // 当前已经选中的length
        const curSelectArr = ModelMgr.I.GeneralRecruitModel.getCurSelectNum();
        // 总共可以设置几个许愿
        const wishNum = ModelMgr.I.GeneralRecruitModel.getCfgWishNum(this._actFuncId);
        this.LabSelectNum.string = `${curSelectArr.length}/${wishNum}`;
    }

    private _currData: number[] = [];
    private _initList(idx: number): void {
        // 这里是阵营
        this._currData = ModelMgr.I.GeneralRecruitModel.getListByCamp(idx);
        // let temdData: number[] = ModelMgr.I.GeneralRecruitModel.
        // 获取当前已经设置  放到model存一个数组
        // 获取当前已完成
        if (this._currData && this._currData.length) {
            this.heroList.setNumItems(this._currData.length, 0);
        } else {
            this.heroList.setNumItems(0, 0);
        }
        this.heroList.scrollTo(0);
    }

    private scrollEvent(node: cc.Node, index: number) {
        // if (index <= 5) {
        //     this.SprTop.node.active = false;
        //     this.SprBottom.node.active = true;
        // } else if (index >= this._allCfg.length - 6) {
        //     this.SprTop.node.active = true;
        //     this.SprBottom.node.active = false;
        // } else {
        //     this.SprTop.node.active = true;
        //     this.SprBottom.node.active = true;
        // }
        const item: GeneralWishItem = node.getComponent(GeneralWishItem);
        item.setData(this._currData[index], this._actFuncId, index);

        if (item) {
            const cfgItem: Cfg_Server_GeneralZhaoMu = ModelMgr.I.GeneralRecruitModel.getCfgZhaoMu(this._currData[index]);
            const itemModel: ItemModel = UtilItem.NewItemModel(cfgItem.ItemId, 1);
            item.loadIcon(itemModel);

            // const nodeEvent: cc.Node = node.getChildByName('NdEvent');
            // nodeEvent.targetOff(this);
            // UtilGame.Click(nodeEvent, () => {
            //     console.log('点击');

            //     // 点击了当前这个
            //     const tabIdx: number = this._currData[index];// 当前选中这个
            //     if (index >= this._currData.length) {
            //         nodeEvent.targetOff(this);
            //         return;
            //         // 大于列表不选中
            //     }
            //     const model = ModelMgr.I.GeneralRecruitModel;

            //     // 1 在已完成列表
            //     const isInGetList: boolean = model.isInWishGet(this._actFuncId, tabIdx);// 是否在选中列表里
            //     if (isInGetList) {
            //         return;// 展示直接走展示信息
            //     }
            //     // 2 在选择列表里，删除
            //     const inInSelectList: boolean = model.inInSelectList(tabIdx);// 是否在选中列表里
            //     if (inInSelectList) {
            //         console.log('删除已选中列表里的');
            //         model.deleteTempWishListItem(tabIdx);
            //         this._curSelectNum();// 更新底部选中个数
            //         item.setData(this._currData[index], this._actFuncId);
            //         return;
            //     }

            //     // 当前选中的类型在哪个库
            //     const wishType: number = model.getWishTypeByTbaleIdx(tabIdx);
            //     // 当前可以选几个
            //     const curCanSeletNum: number = model.getWishNumByType(this._actFuncId, wishType);

            //     // 获取已经选的个数
            //     const curSelectNum = model.getAlreadySelectNum(wishType);
            //     //

            //     if (curSelectNum + 1 > curCanSeletNum) {
            //         MsgToastMgr.Show(i18n.tt(Lang.general_limit));
            //         return;
            //     }

            //     // 3  不在列表里 加入列表
            //     const curSelectNumArr: number[] = model.getCurSelectNum();
            //     const maxSelectNum = model.getCfgWishNum(this._actFuncId);
            //     if (curSelectNumArr.length + 1 > maxSelectNum) {
            //         MsgToastMgr.Show(i18n.tt(Lang.general_limit));
            //         return;
            //     }
            //     model.addTempWishList(tabIdx);
            //     this._curSelectNum();// 更新底部选中个数
            //     item.setData(this._currData[index], this._actFuncId);
            // }, this);
        } else {
            item.clearIcon();
        }
    }
}
