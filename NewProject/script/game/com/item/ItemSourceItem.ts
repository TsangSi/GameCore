/*
 * @Author: zs
 * @Date: 2022-06-07 18:25:29
 * @FilePath: \SanGuo2.4\assets\script\game\com\item\ItemSourceItem.ts
 * @Description:
 */
import { UtilBool } from '../../../app/base/utils/UtilBool';
import { UtilCocos } from '../../../app/base/utils/UtilCocos';
import WinMgr from '../../../app/core/mvc/WinMgr';
import { AssetType } from '../../../app/core/res/ResConst';
import { Config } from '../../base/config/Config';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { UtilGame } from '../../base/utils/UtilGame';
import { ControllerIds } from '../../const/ControllerIds';
import { FuncId } from '../../const/FuncConst';
import { RES_ENUM } from '../../const/ResPath';
import { ViewConst } from '../../const/ViewConst';
import ControllerMgr from '../../manager/ControllerMgr';
import { Link } from '../../module/link/Link';

const { ccclass, property } = cc._decorator;
@ccclass
export class ItemSourceItem extends cc.Component {
    @property(cc.Sprite)
    private SpriteIcon: cc.Sprite = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Node)
    private BtnGoTo: cc.Node = null;
    @property(cc.Node)
    private NodeTuiJian: cc.Node = null;
    /** 跳转id */
    private funcId: number;
    /** 跳转参数 */
    private funcParam;
    /** 未开启提示语 */
    private unOpenTipStr: string;
    protected onLoad(): void {
        UtilGame.Click(this.BtnGoTo, this.onGoToClicked, this);
    }
    public setData(sourceId: number): void {
        if (!sourceId) { return; }
        const cfgSource = Config.Get(Config.Type.Cfg_ItemSource).getValueByKey(sourceId, {
            Desc: '', Desc2: '', FuncId: 0, RMB: 0, Icon: '', FuncParam: '', Recommend: '',
        });
        this.funcId = cfgSource.FuncId;
        this.funcParam = cfgSource.FuncParam;
        this.LabelName.string = cfgSource.Desc;
        this.NodeTuiJian.active = !!cfgSource.Recommend;
        this.unOpenTipStr = cfgSource.Desc2;
        const iconUrl = `${RES_ENUM.Com_ItemSource}${cfgSource.Icon}`;
        if (cfgSource.Icon) {
            // 来源图标
            UtilCocos.LoadSpriteFrameRemote(this.SpriteIcon, iconUrl, AssetType.SpriteFrame);
            this.SpriteIcon.node.active = true;
        } else {
            this.SpriteIcon.node.active = false;
        }
    }

    private getLinkParams(cfgFunc: Cfg_Client_Func): any[] {
        const funcArgs = [];
        if (!UtilBool.isNullOrUndefined(cfgFunc.Param1)) {
            funcArgs.push(cfgFunc.Param1);
        }
        if (!UtilBool.isNullOrUndefined(cfgFunc.Param2)) {
            funcArgs.push(cfgFunc.Param2);
        }
        if (!UtilBool.isNullOrUndefined(cfgFunc.Param3)) {
            funcArgs.push(cfgFunc.Param3);
        }
        if (!UtilBool.isNullOrUndefined(cfgFunc.Param4)) {
            funcArgs.push(cfgFunc.Param4);
        }
        return funcArgs;
    }

    private onGoToClicked() {
        let result = false;
        // todo_: 需要统一跳转接口
        // 活动类的不走
        if (this.funcId > ViewConst.ActivityWin) {
            result = ControllerMgr.I.linkOpen(ControllerIds.ActivityController, this.funcId, null);
            if (!result && this.unOpenTipStr) {
                MsgToastMgr.Show(this.unOpenTipStr);
            }
        } else {
            Link.To(this.funcId);
        }

        // if (!result) {
        //     if (this.funcId === FuncId.CloseAll) { // 跳转为1时默认全关，并且不需要提示
        //         WinMgr.I.closeAll(true);
        //     } else if (this.unOpenTipStr) {
        //         MsgToastMgr.Show(this.unOpenTipStr);

        //         if (UtilFunOpen.isOpen(this.funcId, true)) {
        //             return;
        //         }
        //     }
        // }
        // if (result) {

        // }
        WinMgr.I.close(ViewConst.ItemSourceWin);
    }
}
