/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: zs
 * @Date: 2022-05-06 17:06:31
 * @Description:
 */

import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../app/core/res/ResMgr';
import { UtilGame } from '../../base/utils/UtilGame';
import WinBase from './WinBase';

const { ccclass, property } = cc._decorator;

interface WinSmallParam {
    title: string,
    size: cc.Size,
}

/**
 * 窗口背景类型
 * @param type_A   = 0 通用类型A 方形
 * @param type_B   = 1 通用类型b 带木框
 */
export enum WinSmallType {
    TypeA = 0,
    TypeB = 1,
    TypeC = 2,
}

@ccclass
export class WinSmall extends WinBase {
    // 标题文本
    @property(cc.Label)
    private LabTitle: cc.Label = null;
    @property(cc.Node)
    private NdImgTitle: cc.Node = null;
    @property(cc.Node)
    private NodeFrame: cc.Node = null;

    /** 点击空白区域关闭提示 */
    @property(cc.Node)
    private NodeTips: cc.Node = null;
    /** 子节点 */
    private NodeView: cc.Node = null;

    // 方形的框
    @property(cc.Node)
    private NdDibangA: cc.Node = null;

    // 带木架的框
    @property(cc.Node)
    private NdDibangB: cc.Node = null;

    @property(cc.Node)
    private NdDibangC: cc.Node = null;

    // 关闭按钮
    @property(cc.Node)
    private BtnClose: cc.Node = null;

    public minSizeWidth: number = 682; // 内容框最小尺寸
    public minSizeHeight: number = 190; // 内容框最小尺寸
    public minSizeBg: number = 380;
    public open(param: unknown[]): void {
        this.resetSize(this.viewVo.size);
        if (this.viewVo.title) {
            this.LabTitle.string = this.viewVo.title;
        }
        ResMgr.I.showPrefab(this.viewVo.childPath, this.NdContent, (err: any, node: cc.Node) => {
            if (err) {
                console.log('BaseWin == err', err);
            } else {
                this.NodeView = node;
                const winCmp = node.getComponent('WinCmp');
                // eslint-disable-next-line dot-notation
                winCmp['winSmall'] = this;
                super.open(param);
            }
        });
    }

    public init(param: unknown): void {
        const isShowTips = !(this.viewVo.isShowTips === false);
        this.NodeTips.active = isShowTips;
        this.BtnClose.active = this.viewVo.isShowBtnClose || false;
        if (isShowTips || this.viewVo.isBlackClose || this.viewVo.isBlackClose) {
            UtilGame.Click(this.NodeBlack, this.closeSelf, this);
        }
        if (this.viewVo.isShowBtnClose) {
            UtilGame.Click(this.BtnClose, this.closeSelf, this);
        }
        const sc = this.NodeView.getComponent(this.viewVo.childView) as BaseCmp;
        sc.uiId = this.viewVo.id;
        this.setFrameBg(this.viewVo.winSmallType);
        sc.init(param);
    }

    public refreshView(...param: unknown[]): void {
        const isShowTips = !(this.viewVo.isShowTips === false);
        this.NodeTips.active = isShowTips;
        this.BtnClose.active = this.viewVo.isShowBtnClose || false;
        if (isShowTips || this.viewVo.isBlackClose || this.viewVo.isBlackClose) {
            UtilGame.Click(this.NodeBlack, this.closeSelf, this);
        }
        if (this.viewVo.isShowBtnClose) {
            UtilGame.Click(this.BtnClose, this.closeSelf, this);
        }
        const sc = this.NodeView.getComponent(this.viewVo.childView) as BaseCmp;
        sc.uiId = this.viewVo.id;
        this.setFrameBg(this.viewVo.winSmallType);
        sc.refreshUI(param);
    }

    /**
     * 重置窗口大小
     * @param cc.size
     * @returns
     */
    public resetSize(size: cc.Size): void {
        if (!size) { return; }
        // this.NodeFrame.size = size; 3.4
        this.NodeFrame.width = size.width;
        this.NodeFrame.height = size.height < this.minSizeBg ? this.minSizeBg : size.height;
    }

    /**
     * 换背景底 PS背景图新样式有两种，传参换吧! 这个建议不用
     * 需要用到特殊背景就会隐藏默认的底板
     */
    public resetFrame(path: string): void {
        if (!path) { return; }
        this.NdDibangA.active = false;
        this.NdDibangB.active = false;
        UtilCocos.LoadSpriteFrame(this.NodeFrame.getComponent(cc.Sprite), path);
    }

    public setFrameBg(winSmallType: WinSmallType): void {
        this.NdImgTitle.active = winSmallType !== 2;
        const _wi = this.LabTitle.node.getComponent(cc.Widget);
        _wi.top += winSmallType !== 2 ? 0 : 3;

        const _widgetBtnClose = this.BtnClose.getComponent(cc.Widget);
        _widgetBtnClose.top = winSmallType !== WinSmallType.TypeA ? 4.35 : -24.5;
        if (winSmallType !== WinSmallType.TypeC) {
            _widgetBtnClose.right = 2;
        } else {
            const width = this.viewVo.size.width;
            const offsetWidth = width == this.minSizeWidth ? 0 : (width - this.minSizeWidth) / 2;
            _widgetBtnClose.right = offsetWidth + 10;
        }

        this.LabTitle.node.color = winSmallType !== 2 ? UtilColor.Hex2Rgba(UtilColor.NorV) : UtilColor.Hex2Rgba('#f7efca');
        if (winSmallType === 1) {
            this.NdDibangA.active = false;
            this.NdDibangB.active = true;
            this.NdDibangC.active = false;
        } else if (winSmallType === 2) {
            this.NdDibangA.active = false;
            this.NdDibangB.active = false;
            this.NdDibangC.active = true;
        } else {
            // 0 或者默认
            this.NdDibangA.active = true;
            this.NdDibangB.active = false;
            this.NdDibangC.active = false;
        }
    }

    public closeSelf(): void {
        WinMgr.I.closeView(this);
    }

    public resetTitle(str: string): void {
        this.LabTitle.string = str;
    }
}
