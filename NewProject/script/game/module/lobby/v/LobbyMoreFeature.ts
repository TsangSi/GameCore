/*
 * @Author: hwx
 * @Date: 2022-05-10 09:27:05
 * @Description: 大厅更多功能面板
 */

import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { UtilGame } from '../../../base/utils/UtilGame';
import ControllerMgr from '../../../manager/ControllerMgr';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { RID } from '../../reddot/RedDotConst';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { FuncId } from '../../../const/FuncConst';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { ViewConst } from '../../../const/ViewConst';
import UtilNewMark from '../../../base/utils/UtilNewMark';
import { NewMark } from '../../newMark/NewMark';

const { ccclass, property } = cc._decorator;

@ccclass
export class LobbyMoreFeature extends BaseCmp {
    @property({ type: cc.Layout, displayName: '功能按钮容器' })
    public LayFoldContainer: cc.Layout = null;

    /** 侦听关闭回调 */
    private _onHide: () => void;

    protected start(): void {
        super.start();
        this.clk();
    }

    private clk() {
        UtilGame.Click(this.node, () => {
            this.hide();
        }, this, { scale: 1 });

        this.LayFoldContainer.node.children.forEach((node, idx) => {
            // 注册点击
            UtilGame.Click(node, () => {
                switch (node.name) {
                    case 'NdBeauty':
                        if (UtilFunOpen.isOpen(FuncId.Beauty, true)) {
                            ControllerMgr.I.BeautyController.linkOpen();
                        }
                        if (node.getChildByName('NewMark')) {
                            UtilFunOpen.CheckClick(FuncId.Beauty);
                        }
                        break;
                    case 'NdAdviser':
                        if (UtilFunOpen.isOpen(FuncId.Adviser, true)) {
                            ControllerMgr.I.AdviserController.linkOpen();
                        }
                        if (node.getChildByName('NewMark')) {
                            UtilFunOpen.CheckClick(FuncId.Adviser);
                        }
                        break;
                    case 'NdFriend':
                        if (UtilFunOpen.isOpen(FuncId.Friend, true)) {
                            WinMgr.I.open(ViewConst.FriendWin);
                        }
                        if (node.getChildByName('NewMark')) {
                            UtilFunOpen.CheckClick(FuncId.Friend);
                        }
                        break;
                    case 'NdCollectionBook':
                        if (UtilFunOpen.isOpen(FuncId.CollectionBook, true)) {
                            ControllerMgr.I.CollectionBookController.linkOpen();
                        }
                        if (node.getChildByName('NewMark')) {
                            UtilFunOpen.CheckClick(FuncId.CollectionBook);
                        }
                        break;
                    default:
                        break;
                }
                // 点击任何一个按钮都隐藏了LobbyMoreFeature
                this.hide();
            }, this);
        });
    }

    private containerIndexs: string[] = [];
    public init(parma: string[]): void {
        if (parma) {
            this.containerIndexs = parma;
        }

        /** 注册容器项点击 : 注意，这里的child的顺序是不能保证的，显隐会修改他们的顺序，所以要按节点名字来 */
        this.LayFoldContainer.node.children.forEach((node, idx) => {
            // 是否显示
            node.active = this.containerIndexs.indexOf(node.name) > -1;
            // 绑定红点和'新'标签
            switch (node.name) {
                case 'NdBeauty':
                    UtilRedDot.Bind(RID.Forge.Beauty.Id, node, cc.v2(20, 30));
                    UtilNewMark.Bind(FuncId.Beauty, node, cc.v2(20, 30));
                    break;
                case 'NdAdviser':
                    UtilRedDot.Bind(RID.Forge.Adviser.Id, node, cc.v2(20, 30));
                    UtilNewMark.Bind(FuncId.Adviser, node, cc.v2(20, 30));
                    break;
                case 'NdFriend':
                    UtilRedDot.Bind(RID.More.Friend.Id, node, cc.v2(20, 30));
                    UtilNewMark.Bind(FuncId.Friend, node, cc.v2(20, 30));
                    break;
                case 'NdCollectionBook':
                    UtilRedDot.Bind(RID.More.CollectionBook.Id, node, cc.v2(20, 30));
                    UtilNewMark.Bind(FuncId.CollectionBook, node, cc.v2(20, 30));
                    break;
                default:
                    break;
            }
        });
        // 检查'新'标签
        this.checkNewMark();
    }

    /** 检查是否有‘新’标签 */
    private checkNewMark() {
        this.LayFoldContainer.node.children.forEach((n, idx) => {
            if (n && cc.isValid(n)) {
                const newMark = n.getComponent(NewMark);
                if (newMark) {
                    newMark.onFuncNew();
                }
            }
        });
    }

    public show(): void {
        this.node.active = true;
        this.updateBtnStatus();
    }

    private updateBtnStatus() {
        this.LayFoldContainer.node.children.forEach((node, idx) => {
            switch (node.name) {
                case 'NdBeauty':
                    UtilColor.setGray(node, !UtilFunOpen.canShow(FuncId.Beauty), true);
                    break;
                case 'NdAdviser':
                    UtilColor.setGray(node, !UtilFunOpen.canShow(FuncId.Adviser), true);
                    break;
                case 'NdFriend':
                    UtilColor.setGray(node, !UtilFunOpen.canShow(FuncId.Friend), true);
                    break;
                case 'NdCollectionBook':
                    UtilColor.setGray(node, !UtilFunOpen.canShow(FuncId.CollectionBook), true);
                    break;
                default:
                    break;
            }
        });
    }

    public hide(): void {
        this.node.active = false;
        if (this._onHide) {
            this._onHide();
        }
    }

    /** 监听折叠状态 */
    public onHide(cb: () => void, target: unknown): void {
        this._onHide = cb.bind(target);
    }
}
