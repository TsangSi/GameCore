/*
 * @Author: myl
 * @Date: 2022-07-29 16:56:37
 * @Description:
 */
import { UtilGame } from '../../../base/utils/UtilGame';
import ControllerMgr from '../../../manager/ControllerMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class ChatBlackListItem extends cc.Component {
    /** ------------balckList----------- */
    @property({ type: cc.Label })
    private LabBlackUname: cc.Label = null;
    @property({ type: cc.Node })
    private BtnRmBlackList: cc.Node = null;

    private _data: BlackInfo = null;
    protected onLoad(): void {
        UtilGame.Click(this.BtnRmBlackList, () => {
            ControllerMgr.I.ChatController.deleteUser(2, this._data.UserId);
        }, this);
    }

    public setData(data: BlackInfo, idx: number): void {
        this._data = data;
        this.LabBlackUname.string = `${UtilGame.ShowNick(data.AreaId, data.Nick)}`;
    }
}
