/*
 * @Author: wx
 * @Date: 2022-07-11 11:32:20
 * @FilePath: \SanGuo2.4\assets\script\game\module\gradeGift\v\GradeGiftPage.ts
 * @Description: 进阶豪礼
 */

import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import ListView from '../../../base/components/listview/ListView';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import ItemModel from '../../../com/item/ItemModel';
import { GradeMgr } from '../../grade/GradeMgr';
import { EGiftGetStatus, GradeGiftItem } from './GradeGiftItem';
import { EventClient } from '../../../../app/base/event/EventClient';
import { E } from '../../../const/EventName';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class GradeGiftPage extends WinTabPage {
    @property(ListView)
    private SvLeftNameList: ListView = null;
    @property(ListView)
    private SvRightGiftList: ListView = null;
    @property(DynamicImage)
    private DyBanner: DynamicImage = null;

    // 当前所在分页
    private currIndex: number = null;
    // 用户储存gradeid
    private gradeIdList: number[] = [];
    private gradeBtnName: string[] = [];
    private gradeGiftData: Cfg_GradeJJHL[][] = [];
    private bigLv: number[] = [];
    private upGift: number[][] = [];
    private leftRed: boolean[] = [];
    protected onLoad(): void {
        super.onLoad();
        EventClient.I.on(E.Grade.UpdateInfo, this.onUpdateInfo, this);
    }

    private normallGradeId: number = 0;
    public init(winId: number, param: unknown, tabIdx: number, tabId?: number): void {
        this.normallGradeId = param[0] || 0;
        this.currIndex = 0;
        this.onUpdateInfo();
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.Grade.UpdateInfo, this.onUpdateInfo, this);
    }

    private onUpdateInfo() {
        this.gradeIdList = GradeMgr.I.getGradeIdList();
        this.gradeBtnName = [];// [i18n.tt(Lang.grade_tab_horse), i18n.tt(Lang.grade_tab_wing), i18n.tt(Lang.grade_tab_weapon)];
        this.gradeGiftData = [];
        this.bigLv = [];
        this.upGift = [];
        this.DyBanner.loadImage(RES_ENUM.Grade_Bnr_Jinjie_Huodongtu, 1, true);
        // const borde = true;
        // this.leftBg.getComponent(DynamicImage).loadImage(RES_ENUM.Com_Bg_Dadiban_02, 1, true, null, borde);
        // this.rightBg.getComponent(DynamicImage).loadImage(RES_ENUM.Com_Bg_Dadiban_02, 1, true, null, borde);
        this.gradeIdList.forEach((element, index) => {
            if (this.normallGradeId === element) {
                this.currIndex = index;
            }
            this.gradeGiftData.push(GradeMgr.I.getGradeJJHLCfgList(element));
            this.bigLv.push(GradeMgr.I.getGradeData(element).GradeLv.BigLv);
            this.upGift.push(GradeMgr.I.getGradeData(element).GradeLv.UpGift);
            // 去进阶相关道具换一个进阶的名字
            this.gradeBtnName.push(GradeMgr.I.getGradeItemCfgById(element).Desc);
        });
        // console.log('礼物列表：', this.gradeGiftData, '最大等级:', this.bigLv, '已领取', this.upGift);
        this.setLeftRedPoint();
        // 已领取奖励部分的key值
        this.upGift.forEach((e) => {
            e.sort((a, b) => a - b);
            this.setGetUpGiftList(e);
        });
        this.setGetUpGiftList(this.upGift[this.currIndex]);
        // 已领取的奖励列表，这里要把领取的赛选出来然后放到最后，但是目前发了啥不知道
        this.SvLeftNameList.setNumItems(this.gradeIdList.length, this.currIndex);
        this.SvRightGiftList.setNumItems(this.gradeGiftData[this.currIndex].length, 0);
        this.SvLeftNameList.updateAll();
        this.SvRightGiftList.updateAll();
    }

    /** 用于判断左边是否需要红点 */
    private setLeftRedPoint() {
        this.bigLv.forEach((e, i) => {
            if (e > 1 && e - 1 > this.upGift[i].length) {
                this.leftRed[i] = true;
            } else {
                this.leftRed[i] = false;
            }
        });
    }

    /**
     * 已领取奖励数组重新排序
     * @param upGift 已领取道具数组key
     */
    private setGetUpGiftList(upGift: number[]) {
        for (let i = 0; i < upGift.length; i++) {
            const ifHas = this.gradeGiftData[this.currIndex].findIndex((v) => v.Key === upGift[i]);
            if (ifHas !== this.gradeGiftData[this.currIndex].length) {
                this.gradeGiftData[this.currIndex].push(this.gradeGiftData[this.currIndex].splice(ifHas, 1)[0]);
            }
        }
    }

    private onRenderEventLeft(item: cc.Node, i: number): void {
        //  目前来说就是设置一个按钮标题和响应事件
        this.setLeftList(item, i === this.currIndex, this.gradeBtnName[i]);
        // if (this.leftRed[i]) {
        //     UtilRedDot.New(item, cc.v2(70, 25));
        // } else {
        //     UtilRedDot.Delete(item);
        // }
        UtilRedDot.UpdateRed(item, this.leftRed[i], cc.v2(60, 25));
        UtilGame.Click(item, () => {
            if (this.currIndex != null) {
                // 用户把上一个点击按钮的状态还原
                this.setLeftList(this.SvLeftNameList.getItemByListId(this.currIndex), false, this.gradeBtnName[this.currIndex]);
            }
            this.currIndex = i;
            item.getChildByName('Label').color = UtilColor.Hex2Rgba('#ae6f3a');
            UtilCocos.LoadSpriteFrame(item.getComponent(cc.Sprite), RES_ENUM.Grade_Btn_Jj_An);
            this.UpdataUI();
        }, this);

        // const rightY = this.SvLeftNameList.scrollView.getScrollOffset().y;
        // const contentH = this.SvLeftNameList.content.height;
        // const viewH = this.SvLeftNameList.node.height;
        // // if (contentH > viewH) {
        //     this.SprTop.active = rightY > 0;
        //     this.SprBottom.active = rightY < contentH - viewH;
        // } else {
        //     this.SprTop.active = false;
        //     this.SprBottom.active = false;
        // }
    }

    private setLeftList(item: cc.Node, isActive: boolean, btnName: string) {
        const NdLab = item.getChildByName('Label');
        NdLab.color = isActive ? UtilColor.Hex2Rgba('#ae6f3a') : UtilColor.Hex2Rgba('#8E7E68');
        if (isActive) {
            UtilCocos.LoadSpriteFrame(item.getComponent(cc.Sprite), RES_ENUM.Grade_Btn_Jj_An);
        } else {
            // UtilCocos.LoadSpriteFrame(item.getComponent(cc.Sprite), RES_ENUM.Com_Btn_Com_Btn_Fenye_2);
            item.getComponent(cc.Sprite).spriteFrame = null;
        }

        item.getComponentInChildren(cc.Label).string = btnName;
    }

    private onRenderEventRight(item: cc.Node, i: number): void {
        if (this.gradeGiftData[this.currIndex].length > 0) {
            this.setGiftItemInfo(item, this.gradeGiftData[this.currIndex][i], i);
        }
        // const rightY = this.SvRightGiftList.scrollView.getScrollOffset().y;
        // const contentH = this.SvRightGiftList.content.height;
        // const viewH = this.SvRightGiftList.node.height;
        // if (contentH > viewH) {
        //     this.SprTop.active = rightY > 0;
        //     this.SprBottom.active = rightY < contentH - viewH;
        // } else {
        //     this.SprTop.active = false;
        //     this.SprBottom.active = false;
        // }
    }

    private setGiftItemInfo(item: cc.Node, data: Cfg_GradeJJHL, i): void {
        // 0 未达成 1领取 2已领取 解锁领取
        let stats: number;
        if (data.TargetLevel > this.bigLv[this.currIndex]) {
            stats = EGiftGetStatus.unGet;
            // } else if (i > this.gradeGiftData.length - this.upGift[this.currIndex].length) {
        } else if (this.upGift[this.currIndex].includes(data.Key)) {
            // 已领取
            stats = EGiftGetStatus.got;
        } else {
            // 待领取
            stats = EGiftGetStatus.get;
        }
        const itemdata: string[] = data.Prize.split('|');
        const itemInfo: ItemModel[] = [];
        itemdata.forEach((e) => {
            const item = e.split(':');
            itemInfo.push(UtilItem.NewItemModel(parseInt(item[0]), parseInt(item[1])));
        });
        item.getComponent(GradeGiftItem).setItemData(data.Desc, stats, itemInfo, this.gradeIdList[this.currIndex], data.TargetLevel);
    }

    private UpdataUI() {
        //    刷新右边界面Ui
        this.setLeftRedPoint();
        this.setGetUpGiftList(this.upGift[this.currIndex]);
        this.SvRightGiftList.updateAll();
    }
}
