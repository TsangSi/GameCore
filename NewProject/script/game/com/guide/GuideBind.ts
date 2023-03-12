/*
 * @Author: zs
 * @Date: 2022-09-22 11:12:53
 * @FilePath: \SanGuo2.4-main\assets\script\game\com\guide\GuideBind.ts
 * @Description:
 *
 */
import { GuideBtnIds } from './GuideConst';
import { GuideMgr } from './GuideMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class GuideBind extends cc.Component {
    @property({
        type: cc.Enum(GuideBtnIds),
        tooltip: CC_DEV && '引导按钮id',
    })
    private GuideBtnId: GuideBtnIds = GuideBtnIds.Normall;

    @property({
        type: cc.Node,
        tooltip: CC_DEV && '引导UI的父节点,引导UI被谁addChild',
    })
    private GuideUIParent: cc.Node = null;

    /** 设置 */
    public static readonly SetGuideUIParent = 'SetGuideUIParent';

    protected onLoad(): void {
        if (!GuideMgr.I.isDoing) {
            return;
        }
        if (this.GuideBtnId) {
            GuideMgr.I.bind(this.GuideBtnId as number, this.node, this.GuideUIParent);
        }
        this.node.on(GuideBind.SetGuideUIParent, this.onSetGuideUIParent, this);
    }

    public bind(btnId: number, guideUIParent?: cc.Node): void {
        this.GuideBtnId = btnId;
        if (this.GuideBtnId) {
            GuideMgr.I.bind(this.GuideBtnId, this.node, guideUIParent || this.GuideUIParent);
        }
    }

    private onSetGuideUIParent(guideUIParent: cc.Node) {
        this.GuideUIParent = guideUIParent;
        if (this.GuideBtnId) {
            GuideMgr.I.bind(this.GuideBtnId as number, this.node, this.GuideUIParent);
        }
    }

    protected onDestroy(): void {
        if (!GuideMgr.I.isDoing) {
            return;
        }
        GuideMgr.I.unbind(this.GuideBtnId as number, this.node);
    }
}
