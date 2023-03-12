/*
 * @Author: hrd
 * @Date: 2022-04-21 14:57:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-13 17:35:22
 * @FilePath: \SanGuo-2.4-main\assets\script\login\v\SelServerView.ts
 * @Description:
 *
 */

import { EventClient } from '../../app/base/event/EventClient';
import WinMgr from '../../app/core/mvc/WinMgr';
import ModelMgr from '../../game/manager/ModelMgr';
import { UtilGame } from '../../game/base/utils/UtilGame';
import { E } from '../../game/const/EventName';
import { ViewConst } from '../../game/const/ViewConst';
import PerformanceMgr from '../../game/manager/PerformanceMgr';
import ListView from '../../game/base/components/listview/ListView';
import { IAreaInfo } from '../LoginConst';
import { WinCmp } from '../../game/com/win/WinCmp';
import { UtilColor } from '../../app/base/utils/UtilColor';
import { UtilCocos } from '../../app/base/utils/UtilCocos';
import { RES_ENUM } from '../../game/const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelServerView extends WinCmp {
    /** 关闭按钮 */
    @property(cc.Node)
    private BtnClose: cc.Node = null;
    /** 返回按钮 */
    @property(cc.Node)
    private BtnBack: cc.Node = null;
    @property(ListView)
    private content1: ListView = null;
    @property(ListView)
    private content2: ListView = null;

    private _selPageSerList: IAreaInfo[] = [];
    private _curIndex: number = 0;
    protected onLoad(): void {
        //
    }

    private addEvent() {
        //  EventClient.I.on(E.Login.LoginSuc, this.onLoginSucc, this);
        //  EventClient.I.on(E.Login.GameLoading, this.onLoadStartGame, this);
    }

    private delEvent() {
        //  EventClient.I.off(E.Login.LoginSuc, this.onLoginSucc, this);
        //  EventClient.I.on(E.Login.GameLoading, this.onLoadStartGame, this);
    }

    public init(param: unknown[]): void {
        this.addEvent();
        this.initUI();
    }

    private initUI() {
        UtilGame.Click(this.BtnClose, this.onClose, this);
        UtilGame.Click(this.BtnBack, () => {
            this.onClose();
        }, this);
        const model = ModelMgr.I.LoginModel;
        const pageInfos = model.getPageTitles();
        this.content1.setNumItems(pageInfos.length);
        let page = -1;
        if (model.getPageInfo(-1).length === 0) {
            page = 0;
        }
        this.reServerList(page);
    }

    private reServerList(page: number): void {
        const model = ModelMgr.I.LoginModel;
        const data = model.getPageInfo(page);
        this._selPageSerList = data;
        this.content2.setNumItems(data.length);
    }

    private setLeftList(item: cc.Node, isActive: boolean, btnName: string) {
        const _btn = item.getChildByName('Button');
        const NdLab = _btn.getChildByName('Label');
        NdLab.color = isActive ? UtilColor.Hex2Rgba('#2f5955') : UtilColor.Hex2Rgba('#7c5555');
        const _path = isActive ? RES_ENUM.Com_Btn_Com_Btn_B_03 : RES_ENUM.Login_Btn_Dl_Hf;
        UtilCocos.LoadSpriteFrame(_btn.getComponent(cc.Sprite), _path);
        item.getComponentInChildren(cc.Label).string = btnName;
    }

    private onRederList1(item: cc.Node, i: number) {
        const model = ModelMgr.I.LoginModel;
        const pageInfos = model.getPageTitles();
        const info = pageInfos[i];
        this.setLeftList(item, i === this._curIndex, info.labelText);
        // item.getChildByName('Button').getChildByName('Label').getComponent(cc.Label).string = info.labelText;
        const func = (): void => {
            if (this._curIndex != null) {
                // 用户把上一个点击按钮的状态还原
                this.setLeftList(this.content1.getItemByListId(this._curIndex), false, pageInfos[this._curIndex].labelText);
            }
            this._curIndex = i;
            this.setLeftList(this.content1.getItemByListId(i), true, info.labelText);
            const page = info.page;
            this.reServerList(page);
        };
        UtilGame.Click(item.getChildByName('Button'), func, this);
    }

    private onRederList2(item: cc.Node, i: number) {
        const areaInfos = this._selPageSerList;
        const info = areaInfos[i];
        item.getChildByName('Button').getChildByName('Label').getComponent(cc.Label).string = info.area_name;

        const func = (): void => {
            const model = ModelMgr.I.LoginModel;
            model.selServerId = info.area_id;
            if (!info.user_id) {
                WinMgr.I.open(ViewConst.CreateRoleView);
            } else {
                model.selUserId = info.user_id;
                PerformanceMgr.I.loginCollect();
                EventClient.I.emit(E.Login.ReqGetgateaddr);
            }
            EventClient.I.emit(E.Login.ClickServerItem, info);
            this.close();
        };
        UtilGame.Click(item.getChildByName('Button'), func, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.delEvent();
    }

    private onClose() {
        // WinMgr.I.closeView(this);
        this.close();
    }
}
