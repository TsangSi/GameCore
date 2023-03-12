/*
 * @Author: kexd
 * @Date: 2023-02-17 16:13:57
 * @FilePath: \SanGuo2.4\assets\script\game\module\funcPreview\v\FuncPreviewPage.ts
 * @Description: 功能预告
 *
 */

import { EventClient } from '../../../../app/base/event/EventClient';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import ListView from '../../../base/components/listview/ListView';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItemList from '../../../base/utils/UtilItemList';
import { ItemWhere } from '../../../com/item/ItemConst';
import { WinTabPage } from '../../../com/win/WinTabPage';
import { E } from '../../../const/EventName';
import { RES_ENUM } from '../../../const/ResPath';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { EFuncState, IFuncMsg } from '../FuncPreviewConst';
import { FuncPreviewModel } from '../FuncPreviewModel';
import FuncItem from './FuncItem';
import UtilFunOpen from '../../../base/utils/UtilFunOpen';
import { i18n, Lang } from '../../../../i18n/i18n';
import { Link } from '../../link/Link';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FuncPreviewPage extends WinTabPage {
    @property(ListView)
    private ListHead: ListView = null;
    @property(DynamicImage)
    private SprIcon: DynamicImage = null;
    @property(DynamicImage)
    private SprDesc: DynamicImage = null;
    @property(cc.Node)
    private NdReward: cc.Node = null;
    @property(cc.Node)
    private BtnGet: cc.Node = null;

    private _M: FuncPreviewModel = null;
    private _list: IFuncMsg[] = [];
    private _select: number = 0;

    protected onLoad(): void {
        super.onLoad();
        if (!this._M) {
            this._M = ModelMgr.I.FuncPreviewModel;
        }
    }

    protected start(): void {
        super.start();
        this.addE();
        this.clk();
        this.initUI();
    }

    public init(winId: number, param: unknown): void {
        super.init(winId, param, 0);
        if (!this._M) {
            this._M = ModelMgr.I.FuncPreviewModel;
        }
        ControllerMgr.I.EscortController.reqOpenEscortUI();
    }

    private addE() {
        EventClient.I.on(E.FuncPreview.Got, this.uptUI, this);
        EventClient.I.on(E.FuncPreview.FuncOpenUpt, this.uptOpen, this);
    }

    private remE() {
        EventClient.I.off(E.FuncPreview.Got, this.uptUI, this);
        EventClient.I.off(E.FuncPreview.FuncOpenUpt, this.uptOpen, this);
    }

    private clk() {
        UtilGame.Click(this.BtnGet, () => {
            const cur = this._list[this._select];
            if (cur.state === EFuncState.CanGet) {
                ControllerMgr.I.FuncPreviewController.reqGetFuncPreviewPrize(this._list[this._select].cfg.FuncId);
            } else if (cur.state === EFuncState.Got) {
                Link.To(cur.cfg.FuncId);
            }
        }, this);
    }

    private initUI() {
        this._select = 0;
        let isSelect: boolean = false;
        if (!this._list || this._list.length === 0) {
            this._list = [];
            const indexer = Config.Get(Config.Type.Cfg_FuncPreview);
            const configKeys = indexer.getKeys();
            const openFuncIds = UtilFunOpen.getServerOpen();
            const gotFuncIds = this._M.getFuncGot();

            for (let i = 0; i < configKeys.length; i++) {
                const key = configKeys[i];
                const cfg: Cfg_FuncPreview = indexer.getValueByKey(key);
                const state: EFuncState = this.getState(cfg.FuncId, openFuncIds, gotFuncIds);
                this._list.push({
                    index: i,
                    state,
                    cfg,
                    callback: this.uptClick,
                    context: this,
                });
                if (!isSelect && state !== EFuncState.Got) {
                    this._select = i;
                    isSelect = true;
                }
            }
        }
        this.ListHead.setNumItems(this._list.length);
        this.ListHead.scrollTo(this._select);
        // 显示选中
        this.showContent();
    }

    private getState(funcId: number, openFuncIds: number[], gotFuncIds: number[]): EFuncState {
        const isOpen: boolean = openFuncIds.indexOf(funcId) >= 0;
        let state: EFuncState = EFuncState.UnOpen;
        if (isOpen) {
            const isGot: boolean = gotFuncIds.indexOf(funcId) >= 0;
            state = isGot ? EFuncState.Got : EFuncState.CanGet;
        }
        return state;
    }

    /** 状态改变 */
    private uptUI(funcId: number) {
        const openFuncIds = UtilFunOpen.getServerOpen();
        const gotFuncIds = this._M.getFuncGot();
        let index: number = 0;
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i].cfg.FuncId === funcId) {
                const state: EFuncState = this.getState(funcId, openFuncIds, gotFuncIds);
                this._list[i].state = state;
                index = i;
                break;
            }
        }
        this.autoSelect();
        this.ListHead.updateItem(index);
        this.ListHead.updateItem(this._select);
        this.showContent();
    }

    /** 有新的功能开放 */
    private uptOpen(funcIds: number[]) {
        const openFuncIds = UtilFunOpen.getServerOpen();
        const gotFuncIds = this._M.getFuncGot();
        const change: number[] = [];

        for (let index = 0; index < funcIds.length; index++) {
            for (let i = 0; i < this._list.length; i++) {
                if (this._list[i].cfg.FuncId === funcIds[index]) {
                    const state: EFuncState = this.getState(funcIds[index], openFuncIds, gotFuncIds);
                    this._list[i].state = state;
                    change.push(i);
                    break;
                }
            }
        }
        this.autoSelect();
        for (let i = 0; i < change.length; i++) {
            this.ListHead.updateItem(i);
        }
        this.ListHead.updateItem(this._select);
        this.showContent();
    }

    /** 自动选中第一个可领取或未开启的功能 */
    private autoSelect() {
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i].state !== EFuncState.Got) {
                this._select = i;
                break;
            }
        }
        this.ListHead.scrollTo(this._select);
    }

    private uptClick(index: number) {
        if (index === null || index === undefined) return;
        if (this._select === index) return;
        const lastSelect = this._select;
        this._select = index;
        this.ListHead.updateItem(this._select);
        this.ListHead.updateItem(lastSelect);
        this.showContent();
    }

    private showContent() {
        const cur: IFuncMsg = this._list[this._select];
        this.SprIcon.loadImage(`${RES_ENUM.FuncPreviewUi}${cur.cfg.FuncId}@ML`, ImageType.PNG, true);
        this.SprDesc.loadImage(`${RES_ENUM.FuncPreviewDesc}${cur.cfg.FuncId}@ML`, ImageType.PNG, true);
        UtilItemList.ShowItems(this.NdReward, cur.cfg.Reward, { option: { where: ItemWhere.OTHER, needNum: true } });
        if (cur.state === EFuncState.UnOpen) {
            this.BtnGet.active = false;
        } else if (cur.state === EFuncState.CanGet) {
            this.BtnGet.active = true;
            this.BtnGet.getChildByName('Label').getComponent(cc.Label).string = i18n.tt(Lang.arena_reward_tip);
            this.BtnGet.getChildByName('NdRed').active = true;
        } else if (cur.state === EFuncState.Got) {
            this.BtnGet.active = true;
            this.BtnGet.getChildByName('Label').getComponent(cc.Label).string = i18n.tt(Lang.com_btn_qianwang);
            this.BtnGet.getChildByName('NdRed').active = false;
        }
    }

    private onRenderList(node: cc.Node, idx: number): void {
        const data: IFuncMsg = this._list[idx];
        data.selected = this._select === idx;
        const item = node.getComponent(FuncItem);

        if (data && item) {
            item.setData(data);
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }
}
