/*
 * @Author: zs
 * @Date: 2023-02-14 18:01:15
 * @Description:
 *
 */
import { _decorator, Node, Label, EventTouch, Component } from 'cc';
import { Executor } from '../../core/executor/Executor';
import { BundleType } from '../../global/GConst';
import Utils from '../../utils/Utils';
import UtilsCC from '../../utils/UtilsCC';
import { BtnCloseStyle, BtnHelpStyle, CloseType, PageInfo, UIInfo, UIType } from '../UIConfig';
import UIManager from '../UIManager';
import { BaseView } from './BaseView';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Win
 * DateTime = Wed Sep 01 2021 16:41:22 GMT+0800 (中国标准时间)
 * Author = knuth520
 * FileBasename = Win.ts
 * FileBasenameNoExtension = Win
 * URL = db://assets/scripts/ui/base/Win.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('Win')
export class Win extends BaseView {
    /** 当前显示中的索引 */
    private curIndex = -1;
    /** 页签按钮content */
    private content: Node = undefined;
    /** 关闭按钮 */
    private BtnClose: Node = undefined;
    /** 帮助按钮 */
    private BtnHelp: Node = undefined;
    /** 标题label */
    private LbTitle: Label = undefined;
    /** 页签界面的content */
    private Pages: Node = undefined;
    private onClose: Executor = undefined;
    public ClassName = 'Win';
    /** destroy等待列表 */
    private destroyWaitList: { [index: number]: { time: number, node: Node } } = {};
    public isWin = true;
    onLoad () {
        this.BtnClose = UtilsCC.getNode('Frame/BtnClose', this.node);
        this.BtnHelp = UtilsCC.getNode('Frame/BtnHelp', this.node);
    }


    /** 获取默认显示的页签 */
    private getNormallPageName () {
        return <string>Utils.getNodeAttr(this.node, '_page_name') || '';
    }
    /**
     * 设置帮助按钮隐藏or显示
     * @param active true or false
     */
    setBtnHelpActive (active: boolean) {
        if (this.BtnHelp) {
            this.BtnHelp.active = active;
            if (active) UtilsCC.setClickEventOnly(this.BtnHelp, 'on_help_clicked', this);
        }
    }

    /**
     * 设置点击空白区域关闭提示隐藏or显示
     * @param active true or false
     */
    setCloseTipsActive (active: boolean) {
        let n = UtilsCC.setActive('Frame/LbClose', this.node, active);
        if (active && n) {
            UtilsCC.setClickEventOnly(n, 'on_close_clicked', this);
        }
    }

    /**
     * 设置关闭按钮隐藏or显示
     * @param active true or false
     */
    setBtnCloseActive (active: boolean) {
        let n = UtilsCC.setActive('Frame/BtnClose', this.node, true);
        if (n && active) {
            UtilsCC.setClickEventOnly(n, 'on_close_clicked', this);
        }
    }

    deletePageBtn () {
        //
    }

    /** 显示菜单 */
    showMenus () {
        const ScrollView = UtilsCC.getNode('Frame/Bottom/ScrollView', this.node);
        const length = this.getPagesLength();
        if (length > 0) {
            const normall_page_name = this.getNormallPageName();
            this.Pages = UtilsCC.getNode('Frame/Pages', this.node);
            this.content = ScrollView.getChildByName('view').getChildByName('content');
            UtilsCC.ensureListableChildren(this.content, length);
            this.setPageActive(0, true);
        } else if (ScrollView) ScrollView.destroy();
        this.updateBtnBlackActive();
    }

    updateBtnBlackActive () {
        const hide_back = this._isHideBack();
        UtilsCC.setActive('Frame/Bottom/BtnBlack', this.node, !hide_back);
        if (!hide_back) {
            UtilsCC.setClickEventOnly('Frame/Bottom/BtnBlack', this.node, 'on_close_clicked', this);
        }
    }

    /** 点击页签事件 */
    on_page_clicked (e: EventTouch, index: number) {
        if (this.curIndex !== index) {
            const last_child = this.content.children[this.curIndex];
            const cur_child = this.content.children[index];
            UtilsCC.setSpriteFrameIndex('SpriteBg', last_child, 1);
            UtilsCC.setSpriteFrameIndex('SpriteBg', cur_child, 0);
            UtilsCC.setActive('Sprite', last_child, false);
            UtilsCC.setActive('SpriteNo', last_child, true);
            UtilsCC.setActive('Sprite', cur_child, true);
            UtilsCC.setActive('SpriteNo', cur_child, false);
            const last_index = this.curIndex;
            this.setPageActive(index, true, () => {
                this.setPageActive(last_index, false);
            });
            this.curIndex = index;
        }
    }

    /**
     * 设置子页显示or隐藏
     * @param index 索引
     * @param active true | false
     * @param callback 回调
     */
    setPageActive (index: number, active: boolean, callback?) {
        const page_info = this._getPageInfo(index);
        if (page_info) {
            const node_page = this.Pages.getChildByName(page_info.name);
            if (node_page) {
                node_page.active = active;
                if (!node_page.active && page_info.closeType === CloseType.Close) {
                    this.waitDestroyPage(node_page, index);
                }
                if (callback) callback.call(this);
            } else if (active) {
                const args = Utils.getNodeAttr(this.node, '_args');
                console.time('setPageActive');
                UIManager.I.showPrefab(this.Pages, page_info.path, page_info.bundle, callback, this, args);
                console.timeEnd('setPageActive');
            }
        }
        if (active) {
            this.destroyWaitList[index] = undefined;
        }
    }

    /**
     * 等待移除子页签
     * @param node_page 页签节点
     * @param index 索引
     */
    waitDestroyPage (node_page: Node, index: number) {
        if (node_page && node_page.active === false) {
            // 延迟10秒移除;
            if (this.destroyWaitList[index]) {
                this.destroyWaitList[index].time = 10;
            } else {
                this.destroyWaitList[index] = {
                    time: 10,
                    node: node_page,
                };
            }
        }
    }

    /** 改变帮助按钮样式 */
    changeHelpStyle (style: BtnHelpStyle) {
        UtilsCC.setSpriteFrameIndex(this.BtnHelp, style);

        // 根据不同样式需要调整坐标的处理
        switch (style) {
            case BtnHelpStyle.Other:
                break;
            default:
                break;
        }
    }

    /** 改变关闭按钮样式 */
    changeCloseStyle (style: BtnCloseStyle) {
        UtilsCC.setSpriteFrameIndex(this.BtnClose, style);

        // 根据不同样式需要调整坐标的处理
        switch (style) {
            case BtnCloseStyle.Activity:
                break;
            default:
                break;
        }
    }

    /** 设置帮助按钮坐标 */
    setHelpPos (x: number, y: number) {
        UtilsCC.setPos(this.BtnHelp, x, y);
    }

    /** 设置关闭按钮坐标 */
    setClosePos (x: number, y: number) {
        UtilsCC.setPos(this.BtnClose, x, y);
    }

    updateS () {
        for (const index in this.destroyWaitList) {
            const w = this.destroyWaitList[index];
            if (w) {
                w.time -= 1;
                if (w.time <= 0) {
                    w.node.destroy();
                    this.destroyWaitList[index] = undefined;
                }
                // console.log('index, time=', index, w.time);
            }
        }
    }

    /** 页签info列表 */
    private _page_infos: PageInfo[] = [];
    /** 获取页签数量 */
    getPagesLength () {
        if (this._page_infos.length) {
            return this._page_infos.length;
        }
        this._page_infos.length = 0;
        const length = this._getPagesLength();
        for (let i = 0; i < length; i++) {
            const name = this._getPagesName(i);
            const u = UIManager.I.getPageInfo(name);
            if (u) {
                // 子页
                u.name = name;
                u.closeType = u.closeType || CloseType.Close;
                this._page_infos.push(u);
            }
        }
        return this._page_infos.length;
    }

    /** 获取页签info */
    _getPageInfo (index: number) {
        return this._page_infos[index];
    }

    setCloseCallback (callback: Executor) {
        this.onClose = callback;
    }

    close () {
        if (this.onClose) {
            this.onClose.invoke();
            this.onClose = undefined;
        } else {
            super.close();
        }
    }
}
