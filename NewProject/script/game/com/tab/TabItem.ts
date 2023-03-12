/*
 * @Author: hwx
 * @Date: 2022-06-09 18:53:12
 * @FilePath: \SanGuo2.4\assets\script\game\com\tab\TabItem.ts
 * @Description: 页签选项
 */

import { UtilColor } from '../../../app/base/utils/UtilColor';
import { FrameBlockMgr } from '../../../app/engine/frameBlock/FrameBlockMgr';
import { DynamicImage } from '../../base/components/DynamicImage';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { UtilGame } from '../../base/utils/UtilGame';
import UtilNewMark from '../../base/utils/UtilNewMark';
import UtilRedDot from '../../base/utils/UtilRedDot';
import { NewMark } from '../../module/newMark/NewMark';
import { TabData } from './TabData';

enum TabType {
    /** 无 */
    NONE,
    /** 仅图标 */
    ICON,
    /** 仅标题 */
    TITLE,
    /** 有标题图标 */
    TITLE_ICON
}

const { ccclass, property } = cc._decorator;

@ccclass
export class TabItem extends cc.Component {
    @property({ type: cc.Node, displayName: '未选中节点' })
    protected NdUnselect: cc.Node = null;

    @property({
        type: DynamicImage,
        displayName: '未选中图标',
        visible(this: TabItem) {
            return this.tabType !== TabType.TITLE;
        },
    })
    protected SprUnselectIcon: DynamicImage = null;

    @property({ type: cc.Node, displayName: '选中节点' })
    protected NdSelect: cc.Node = null;

    @property({
        type: DynamicImage,
        displayName: '选中图标',
        visible(this: TabItem) {
            // 清除缓存
            if (this.tabType === TabType.NONE || this.tabType === TabType.TITLE) {
                this.SprUnselectIcon = null;
                this.SprSelectIcon = null;
            }
            return this.tabType !== TabType.TITLE;
        },
    })
    protected SprSelectIcon: DynamicImage = null;

    @property({ type: [cc.String], displayName: '状态颜色' })
    public ColorStr: string[] = [];

    @property({
        type: cc.Label,
        displayName: '标题',
        visible(this: TabItem) {
            // 清除缓存
            if (this.tabType === TabType.NONE || this.tabType === TabType.ICON) {
                this.LabTitle = null;
            }
            return this.tabType !== TabType.ICON;
        },
    })
    protected LabTitle: cc.Label = null;

    @property({ type: cc.Enum(TabType), displayName: '类型' })
    protected tabType: TabType = TabType.NONE;

    /** 配置数据 */
    protected _data: TabData;
    /** 是否选中 */
    protected _isSelected: boolean;
    /** 选中监听 */
    protected _onSelected: (tabCompt: TabItem) => void;

    protected start(): void {
        if (!this._isSelected) {
            this.unselect();
        }
    }

    /**
     * 设置数据
     * @param data
     */
    public setData(data: TabData): void {
        this._data = data;

        // 加载图标
        if (this.SprUnselectIcon) {
            this.SprUnselectIcon.loadImage(`${data.icon}_02`, 1, true);
        }
        if (this.SprSelectIcon) {
            this.SprSelectIcon.loadImage(`${data.icon}_01`, 1, true);
        }

        // 设置标题
        if (this.LabTitle) {
            this.LabTitle.string = data.title;
        }

        /** 红点 */
        if (data.redId) {
            UtilRedDot.Bind(data.redId, this.node, cc.v2(60, -10));
        } else {
            UtilRedDot.Unbind(this.node);
        }
        /** '新'标签 */
        this.checkNewMark(data);
    }

    /**
     * 获取数据
     * @returns TabItemData
     */
    public getData(): TabData {
        return this._data;
    }

    /** 检查是否有‘新’标签 */
    private checkNewMark(data: TabData) {
        UtilNewMark.Bind(data.funcId, this.node, cc.v2(60, -15), 0.8);
        const newMark = this.node.getComponent(NewMark);
        if (newMark) {
            newMark.onFuncNew();
        }
    }

    /** 选中了该页签的处理 */
    private checkClick() {
        const newMark = this.node.getComponent(NewMark);
        if (newMark) {
            if (this._data && this._data.funcId) {
                UtilFunOpen.CheckClick(this._data.funcId);
            }
        }
    }

    /**
     * 选中
     */
    public select(): void {
        if (this.NdUnselect) this.NdUnselect.active = false;
        if (this.NdSelect) this.NdSelect.active = true;
        this._isSelected = true;
        if (this.ColorStr.length === 2) {
            this.LabTitle.node.color = UtilColor.Hex2Rgba(this.ColorStr[0]);
        }

        // 取消点击事件
        this.node.targetOff(this);
        this._onSelected(this);
        // '新’标签
        this.checkClick();
    }

    /**
     * 反选中
     */
    public unselect(): void {
        if (this.NdSelect) this.NdSelect.active = false;
        if (this.NdUnselect) this.NdUnselect.active = true;
        this._isSelected = false;
        if (this.ColorStr.length === 2) {
            this.LabTitle.node.color = UtilColor.Hex2Rgba(this.ColorStr[1]);
        }
        const opations = this._data.notScale ? { scale: 1 } : null;
        // 注册点击事件
        UtilGame.Click(this.node, () => {
            if (!this._isSelected) {
                this.select();
            }
        }, this, opations);
    }

    /**
     * 是否选中
     * @returns
     */
    public isSelected(): boolean {
        return this._isSelected;
    }

    /**
     * 设置监听选中事件
     * @param cb
     * @param target
     */
    public onSelected(cb: (tabCompt: TabItem) => void, target: cc.Component): void {
        this._onSelected = cb.bind(target);
    }
}
