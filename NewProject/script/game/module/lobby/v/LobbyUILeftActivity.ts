import { EventClient } from '../../../../app/base/event/EventClient';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../app/core/res/ResMgr';
import { FoldButton } from '../../../base/components/FoldButton';
import { UtilGame } from '../../../base/utils/UtilGame';
import { E } from '../../../const/EventName';
import ModelMgr from '../../../manager/ModelMgr';
import { ActivityButton } from '../../activity/v/ActivityButton';
import { ActData } from '../../activity/ActivityConst';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ELobbyViewType } from '../LobbyConst';

const { ccclass, property } = cc._decorator;
@ccclass
export class LobbyUILeftActivity extends BaseCmp {
    @property(cc.Node)
    private NdLeftTop: cc.Node = null;
    @property(cc.Node)
    private NdLeft: cc.Node = null;
    @property(FoldButton)
    private NdFoldButton: FoldButton = null;
    @property(cc.Node)
    private NdGodWeapons: cc.Node = null;

    protected start(): void {
        UtilGame.Click(this.NdGodWeapons, () => {
            console.log('神兵榜点击');
        }, this);

        const topids: number[] = ModelMgr.I.ActivityModel.getTopContainerIds();
        const leftids: number[] = ModelMgr.I.ActivityModel.getLeftContainerIds();
        this.onAddActivitys(topids.concat(leftids));

        this.onE();
    }

    private onE() {
        EventClient.I.on(E.Activity.Add, this.onAddActivitys, this);
        EventClient.I.on(E.Activity.Del, this.onDelActivitys, this);
        EventClient.I.on(E.Lobby.ChangeViewType, this.onChangeViewType, this);
        EventClient.I.on(E.Activity.Update, this.onUpdateActivitys, this);
    }
    private offE() {
        EventClient.I.off(E.Lobby.ChangeViewType, this.onChangeViewType, this);
        EventClient.I.off(E.Activity.Add, this.onAddActivitys, this);
        EventClient.I.off(E.Activity.Del, this.onDelActivitys, this);
        EventClient.I.off(E.Activity.Update, this.onUpdateActivitys, this);
    }
    private onChangeViewType(type: ELobbyViewType) {
        switch (type) {
            case ELobbyViewType.YeWai:
                this.onMainCityHide();
                break;
            default:
                this.onMainCityShow();
                break;
        }
    }

    private lastFoldState = undefined;
    private onMainCityShow() {
        if (this.lastFoldState === undefined) {
            this.lastFoldState = this.NdFoldButton.getFoldState();// 记录下最后的状态
        }
        // this.lastFoldState = this.NdFoldButton.getFoldState();
        if (this.NdLeftTop) {
            this.NdFoldButton.setFoldState(true);
        }
    }

    private onMainCityHide() {
        this.NdFoldButton.setFoldState(this.lastFoldState);
        this.lastFoldState = undefined;
    }

    /**
     * 侦听折叠状态
     * @param isFold 是否折叠
     */
    private onFoldState(isFold: boolean): void {
        const w = this.NdLeftTop.width;
        const wpWidth = 720;// cc.view.getDesignResolutionSize().width;
        const godWidth = this.NdGodWeapons.width;
        const startX = this.node.anchorX * wpWidth;
        if (isFold) {
            this.moveFoldContainer(cc.v2(-w - startX, this.NdLeftTop.position.y), () => {
                this.NdLeftTop.active = false;
            });
            this.moveGodWeapons(cc.v2(wpWidth - godWidth, this.NdGodWeapons.position.y), () => {
                this.NdGodWeapons.active = false;
            });
            // this.moveFoldButton(cc.v2(22, this.NdFoldButton.node.position.y, 0));
        } else {
            this.moveFoldContainer(cc.v2(-startX, this.NdLeftTop.position.y));
            this.moveGodWeapons(
                cc.v2(startX - godWidth * this.NdGodWeapons.anchorX, this.NdGodWeapons.position.y),
                () => {
                    // this.NdGodWeapons.active = true;
                },
            );
            // this.moveFoldButton(cc.v2(w + 22, this.NdFoldButton.node.position.y, 0));
        }
    }

    /**
     * 缩放折叠容器
     * @param v3 缩放值
     */
    private moveFoldContainer(v3: cc.Vec2, end?: () => void): void {
        cc.Tween.stopAllByTarget(this.NdLeftTop);
        this.NdLeftTop.active = true;
        cc.tween(this.NdLeftTop).to(0.2, { position: cc.v3(v3.x, v3.y, 0) }).call(end).start();
    }

    /**
     * 缩放折叠容器
     * @param v3 缩放值
     */
    private moveGodWeapons(v3: cc.Vec2, end?: () => void): void {
        cc.Tween.stopAllByTarget(this.NdGodWeapons);

        cc.tween(this.NdGodWeapons).to(0.2, { position: cc.v3(v3.x, v3.y, 0) }).call(end).start();
    }

    /** 是否已创建了活动入口 */
    private hasActivity(containerId: number, Pos: number): boolean {
        if (Pos === 2) {
            for (let i = this.NdLeftTop.children.length - 1; i >= 0; i--) {
                if (this.NdLeftTop.children[i]) {
                    const s: ActivityButton = this.NdLeftTop.children[i].getComponent(ActivityButton);
                    if (s && s.getData().FuncId === containerId) {
                        return true;
                    }
                }
            }
        } else if (Pos === 3) {
            for (let i = this.NdLeft.children.length - 1; i >= 0; i--) {
                if (this.NdLeft.children[i]) {
                    const s: ActivityButton = this.NdLeft.children[i].getComponent(ActivityButton);
                    if (s && s.getData().FuncId === containerId) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /** 添加活动入口 */
    private onAddActivitys(actIds: number[]) {
        console.log('添加活动入口', actIds);
        if (!actIds || actIds.length === 0 || !this.node || !this.node.isValid) return;
        ResMgr.I.loadLocal(UI_PATH_ENUM.Module_Activity_ActivityButton, cc.Prefab, (e, p: cc.Prefab) => {
            if (e || !p) { return; }
            if (this.NdLeftTop && this.NdLeftTop.isValid) {
                actIds.forEach((actId: number) => {
                    const data: ActData = ModelMgr.I.ActivityModel.getActivityData(actId);
                    if (data && !data.Config.ContainerId) {
                        if (!this.hasActivity(data.Config.FuncId, data.Config.Pos)) {
                            const node = cc.instantiate(p);
                            const s = node.getComponent(ActivityButton);
                            s.setData(data);
                            s.onClick(this.onActClicked, this);

                            if (data.Config.Pos === 2) {
                                this.NdLeftTop.addChild(node);
                            } else if (data.Config.Pos === 3) {
                                this.NdLeft.addChild(node);
                            }
                            console.log('------------添加活动入口', data);
                        }
                    }
                });
            }
        }, { target: this });
    }

    /** 移除活动入口 */
    private onDelActivitys(actFuncIds: number[]) {
        if (actFuncIds && actFuncIds.length > 0) {
            for (let k = 0; k < actFuncIds.length; k++) {
                // NdLeftTop 里找
                let isFind: boolean = false;
                for (let i = this.NdLeftTop.children.length - 1; i >= 0; i--) {
                    if (this.NdLeftTop.children[i]) {
                        const s: ActivityButton = this.NdLeftTop.children[i].getComponent(ActivityButton);
                        if (s && s.getData().FuncId === actFuncIds[k]) {
                            this.NdLeftTop.removeChild(this.NdLeftTop.children[i]);
                            isFind = true;
                        }
                    }
                }
                // NdLeft 里找
                if (!isFind) {
                    for (let i = this.NdLeft.children.length - 1; i >= 0; i--) {
                        if (this.NdLeft.children[i]) {
                            const s: ActivityButton = this.NdLeft.children[i].getComponent(ActivityButton);
                            if (s && s.getData().FuncId === actFuncIds[k]) {
                                this.NdLeft.removeChild(this.NdLeft.children[i]);
                            }
                        }
                    }
                }
            }
        }
    }

    /** 更新活动数据 */
    private onUpdateActivitys(...actFuncIds: number[]) {
        if (actFuncIds && actFuncIds.length > 0) {
            for (let k = 0; k < actFuncIds.length; k++) {
                // NdLeftTop 里找
                let isFind: boolean = false;
                for (let i = this.NdLeftTop.children.length - 1; i >= 0; i--) {
                    if (this.NdLeftTop.children[i]) {
                        const s: ActivityButton = this.NdLeftTop.children[i].getComponent(ActivityButton);
                        if (s && s.getData().FuncId === actFuncIds[k]) {
                            const data = ModelMgr.I.ActivityModel.getActivityData(actFuncIds[k]);
                            s.setData(data);
                            isFind = true;
                        }
                    }
                }
                // NdLeft里找
                if (!isFind) {
                    for (let i = this.NdLeft.children.length - 1; i >= 0; i--) {
                        if (this.NdLeft.children[i]) {
                            const s: ActivityButton = this.NdLeft.children[i].getComponent(ActivityButton);
                            if (s && s.getData().FuncId === actFuncIds[k]) {
                                const data = ModelMgr.I.ActivityModel.getActivityData(actFuncIds[k]);
                                s.setData(data);
                            }
                        }
                    }
                }
            }
        }
    }

    private onActClicked(actData: ActData) {
        if (actData) {
            let containerId: number = actData.Config.ContainerId;
            if (!containerId) {
                containerId = actData.Config.FuncId;
            }
            WinMgr.I.open(containerId, actData.Config.FuncId);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.offE();
    }
}
