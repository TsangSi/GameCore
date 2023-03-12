/*
 * @Author: zs
 * @Date: 2022-09-22 15:25:23
 * @FilePath: \SanGuo2.4-main\assets\script\game\com\guide\GuideUI.ts
 * @Description:
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { UtilNum } from '../../../app/base/utils/UtilNum';
import { IRichTransform, UtilRichString } from '../../../app/base/utils/UtilRichString';
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../i18n/i18n';
import { Config } from '../../base/config/Config';
import { E } from '../../const/EventName';
import TimerMgr from '../../manager/TimerMgr';
import { TaskMgr } from '../../module/task/TaskMgr';
import { GuideBtnIds } from './GuideConst';
import { GuideMgr } from './GuideMgr';

const { ccclass, property } = cc._decorator;

/** 方向 */
enum EDir {
    /** 自动 */
    Auto,
    /** 上 */
    Top,
    /** 下 */
    Bottom,
    /** 左 */
    Left,
    /** 右 */
    Right
}

const _tempPos: cc.Vec2 = new cc.Vec2();

@ccclass
export class GuideUI extends BaseCmp {
    /** 箭头 */
    @property(cc.Node)
    private NodeJianTou: cc.Node = null;
    /** 新手引导员 */
    @property(cc.Node)
    private NodeRole: cc.Node = null;
    /** 强制节点 */
    @property(cc.Node)
    private NodeForce: cc.Node = null;
    /** 提示框 */
    @property(cc.Node)
    private NodeTipFrame: cc.Node = null;
    /** 新手引导员的提示语 */
    @property(cc.Label)
    private LabelRoleTips: cc.Label = null;
    /** 箭头提示语 */
    @property(cc.Label)
    private LabelTips: cc.Label = null;

    @property(cc.Node)
    private NdTipSpr: cc.Node = null;
    @property(cc.Node)
    private plotHead: cc.Node = null;

    protected onLoad(): void {
        super.onLoad();
        EventClient.I.emit(E.Guide.Show);
    }

    private readonly headWidth;
    private clickNode: cc.Node = null;
    private curBtnId: GuideBtnIds;

    private _data: Cfg_TaskGuide = null;
    public setData(cfgTaskGuide: Cfg_TaskGuide, step: number = 0): void {
        this._data = cfgTaskGuide;
        this.curBtnId = cfgTaskGuide.ButtonID;
        const cfg = cfgTaskGuide;
        this.NodeRole.active = false;
        this.NodeForce.active = false;
        const nodeTipFrameActive = !!cfg.TipsContent;
        const headState = !cfg.Ren;// 指引人物
        this.plotHead.active = headState;
        this.NodeTipFrame.active = nodeTipFrameActive;
        if (nodeTipFrameActive) {
            const contentStr = cfg.TipsContent.replace('\\n', '\n');
            this.LabelTips.string = contentStr;
        }

        const nodeInfo = GuideMgr.I.getNodeInfoById(cfgTaskGuide.ButtonID);
        if (this.node.parent !== nodeInfo?.guiParent) {
            this.node.removeFromParent();
            nodeInfo.guiParent.addChild(this.node);
        }
        const node = nodeInfo.node;
        this.offTouchEvent(this.clickNode);
        this.offTouchEvent(node);
        this.onTouchEvent(node);
        this.clickNode = node;
        // this.updatePos(nodeInfo?.guiParent);
        this.updateJianTouDir(cfg.Direct);
        // this.updateJianTouDir(4);
        this.specialHandle(cfgTaskGuide.ButtonID);
    }

    /**
     * 特殊处理
     * @param btnId 按钮id
     */
    private specialHandle(btnId: GuideBtnIds) {
        /** 聊天发送按钮 */
        if (btnId === GuideBtnIds.ChatSend) {
            const guideType: number = Config.Get(Config.Type.Cfg_LinkTask).getValueByKey(TaskMgr.I.getMainTaskId(), 'GuideType');
            const indexs: number[] = Config.Get(Config.Type.Cfg_TalkWord).getValueByKey(guideType);
            if (indexs && indexs.length) {
                const index = indexs[UtilNum.RandomInt(0, indexs.length - 1)];
                const str = Config.Get(Config.Type.Cfg_TalkWord).getValueByIndex(index, 'Word2') || i18n.tt(Lang.chat_guide_talk_str);
                EventClient.I.emit(E.Chat.InputContent, str);
            }
        } else if (btnId === GuideBtnIds.LeaderPersonFight || btnId === GuideBtnIds.LeaderSupremeFight) {
            this.scheduleOnce(() => {
                this.NodeTipFrame.setPosition(-this.contentSize.width / 2 - 70 * 2, 10);
            });
        }
    }

    /** 更新位置 */
    private updatePos(parent: cc.Node, dir: EDir) {
        if (this.clickNode === parent) { return; }
        const offX = this.node.anchorX * this.clickNode.width - this.clickNode.anchorX * this.clickNode.width;
        const offY = this.node.anchorY * this.clickNode.height - this.clickNode.anchorY * this.clickNode.height;
        if (this.clickNode.parent !== parent) {
            _tempPos.x = offX;
            _tempPos.y = offY;
            this.getWorldPosition(this.clickNode, parent, _tempPos);
            this.node.setPosition(_tempPos.x, _tempPos.y);
        } else {
            this.node.setPosition(this.clickNode.position.x + offX, this.clickNode.position.y + offY);
        }

        // const offsetSize = cc.size(this.tipSize.width + this.contentSize.width, this.tipSize.height + this.contentSize.height);

        // 根据方向布局不同的位置
        switch (dir) {
            case EDir.Top:
                this.NodeTipFrame.setPosition(0, this.contentSize.height + 70);
                this.plotHead.setPosition(this.NodeTipFrame.width / 2 - 170 / 2, this.contentSize.height + 70 + this.NodeTipFrame.height / 2 - 15);
                this.plotHead.scaleX = 1;
                break;
            case EDir.Bottom:
                this.NodeTipFrame.setPosition(0, -this.contentSize.height - 70);
                this.plotHead.setPosition(this.NodeTipFrame.width / 2 - 170 / 2, this.contentSize.height + 70 + this.NodeTipFrame.height / 2 - 15);
                this.plotHead.scaleX = 1;
                break;
            case EDir.Left:
                this.NodeTipFrame.setPosition(-this.contentSize.width / 2 - 70 * 2, 0);
                this.plotHead.setPosition(-70 * 2 - 170 / 2, this.NodeTipFrame.height / 2 - 15);
                this.plotHead.scaleX = -1;
                break;

            case EDir.Right:
                this.NodeTipFrame.setPosition(this.contentSize.width / 2 + 70 * 2, 0);
                this.plotHead.setPosition(70 * 2 + 170 / 2, this.NodeTipFrame.height / 2 - 15);
                this.plotHead.scaleX = -1;
                break;
            default:
                this.NodeTipFrame.setPosition(0, this.contentSize.height + 70);
                this.plotHead.setPosition(this.NodeTipFrame.width / 2 - 170 / 2, this.contentSize.height + 70 + this.NodeTipFrame.height / 2 - 15);
                this.plotHead.scaleX = 1;
                break;
        }
    }

    private getWorldPosition(node: cc.Node, parent: cc.Node, pos?: cc.Vec2): cc.Vec2 {
        if (!pos) {
            _tempPos.x = 0;
            _tempPos.y = 0;
            pos = _tempPos;
        }
        pos.x += node.position.x;
        pos.y += node.position.y;
        if (!node.parent || node.parent === parent) {
            return pos;
        }
        return this.getWorldPosition(node.parent, parent, pos);
    }

    private onTouchEvent(node: cc.Node) {
        if (node && cc.isValid(node)) {
            node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }
    }

    private offTouchEvent(node: cc.Node) {
        if (node && cc.isValid(node)) {
            node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }
    }

    private onTouchEnd() {
        this.isNeedClear = false;
        const btnId = this.curBtnId;
        const node = this.clickNode;
        const step = GuideMgr.I.curStep + 1;
        this.close(() => {
            if (btnId === GuideBtnIds.GeneralFight && !GuideMgr.I.isCompleteTask()) {
                GuideMgr.I.changeNodeInfoIndex(btnId, node);
                GuideMgr.I.continueGuide();
            } else {
                GuideMgr.I.nextGuide(step);
            }
        });
    }

    private onTouchCancel() {
        this.close();
    }

    public close(callFunc?: () => void): void {
        super.close();
        if (callFunc) {
            TimerMgr.I.setTimeout(() => {
                if (callFunc) {
                    callFunc();
                }
            }, 100);
        }
    }

    /** 更新箭头方向位置 */
    private readonly tipSize = cc.size(67, 69);
    private contentSize = cc.size(0, 0);
    private updateJianTouDir(dir: EDir) {
        // dir = dir || this.getAutoDir();
        let rotationZ = 0;
        const contentStr = this._data.TipsContent.replace('\\n', '\n');
        const stringSize = this.textSize(contentStr);
        this.contentSize.width = stringSize.width + 40;
        this.contentSize.height = stringSize.height + 40;
        this.NodeTipFrame.width = stringSize.width + 40;
        this.NodeTipFrame.height = stringSize.height + 40;
        // this.NodeTipFrame.setPosition(cc.v2(0, 0));
        // 始终保持在中心点
        this.NodeJianTou.setPosition(cc.v2(0, 0));
        switch (dir) {
            case EDir.Top:
                rotationZ = 0;
                break;
            case EDir.Bottom:
                rotationZ = -180;
                break;
            case EDir.Left:
                rotationZ = 90;
                break;
            case EDir.Right:
                rotationZ = -90;
                break;
            default:
                break;
        }

        this.NodeJianTou.angle = rotationZ;
        // this.scheduleOnce(() => {
        const nodeInfo = GuideMgr.I.getNodeInfoById(this._data.ButtonID);
        this.updatePos(nodeInfo?.guiParent, dir);
        // });
    }

    private textSize(text: string): cc.Size {
        const conf: IRichTransform = {
            fSize: 26,
            maxWidth: 0,
            lineHeight: 30,
            richString: text,
            // eslint-disable-next-line dot-notation
            fontFamily: this.LabelTips.font['_fontFamily'],
        };
        return UtilRichString.NormalRichStringSize(conf);
    }

    private isNeedClear: boolean = true;
    protected onDestroy(): void {
        super.onDestroy();
        if (this.isNeedClear) {
            GuideMgr.I.clearCur();
        }
        EventClient.I.emit(E.Guide.Close);
    }
}
