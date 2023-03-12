/*
 * @Author: kexd
 * @Date: 2022-11-21 09:38:54
 * @FilePath: \SanGuo2.4\assets\script\game\module\setting\v\ComUserSettingInfo.ts
 * @Description:
 *
 */
import { UtilCopy } from '../../../../app/base/utils/UtilCopy';
import { i18n, Lang } from '../../../../i18n/i18n';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ComUserSettingInfo extends cc.Component {
    @property(cc.Label) // 昵称
    private labName: cc.Label = null;
    @property(cc.Label) // 区服
    private labServer: cc.Label = null;
    @property(cc.Label) // 角色ID
    private labRoleId: cc.Label = null;
    @property(cc.Label) // 归属地
    private labLocation: cc.Label = null;
    @property(cc.Label) // 游戏版本
    private labGameVer: cc.Label = null;
    @property(cc.Node) // 复制
    private BtnCopy: cc.Node = null;

    protected start(): void {
        UtilGame.Click(this.BtnCopy, () => {
            const rn = i18n.tt(Lang.setting_roleNick);
            const rs = i18n.tt(Lang.setting_roleServer);
            const rid = i18n.tt(Lang.setting_roleId);
            const str = `${rn}:${RoleMgr.I.info.getAreaNick(NickShowType.Nick)} ${rs}:${RoleMgr.I.d.ShowAreaId} ${rid}:${RoleMgr.I.d.AccountId}`;
            MsgToastMgr.Show(i18n.tt(Lang.setting_copy));
            UtilCopy.CopyTextEvent(str);
        }, this);
        RoleMgr.I.on(this._updateName, this, RoleAN.N.Nick);// 改名后更新
    }

    protected onDestroy(): void {
        RoleMgr.I.off(this._updateName, this, RoleAN.N.Nick);
    }
    private _updateName(): void {
        this.labName.string = RoleMgr.I.info.getAreaNick(NickShowType.Nick);
    }

    protected onLoad(): void {
        this.labName.string = RoleMgr.I.info.getAreaNick(NickShowType.Nick);
        this.labServer.string = `${RoleMgr.I.d.AreaName}`;
        this.labRoleId.string = `${RoleMgr.I.d.UserId}`;
        this.labLocation.string = RoleMgr.I.d.RegionName; // 后端提供一个归属地 省会
        this.labGameVer.string = `1.0.0`;
    }
}
