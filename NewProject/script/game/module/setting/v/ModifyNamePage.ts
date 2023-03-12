import { EventClient } from '../../../../app/base/event/EventClient';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../app/base/utils/UtilString';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import MsgToastMgr from '../../../base/msgtoast/MsgToastMgr';
import { NickShowType, UtilGame } from '../../../base/utils/UtilGame';
import UtilItem from '../../../base/utils/UtilItem';
import WinBase from '../../../com/win/WinBase';
import { E } from '../../../const/EventName';
import { ViewConst } from '../../../const/ViewConst';
import ControllerMgr from '../../../manager/ControllerMgr';
import ModelMgr from '../../../manager/ModelMgr';
import { BagMgr } from '../../bag/BagMgr';
import { RoleAN } from '../../role/RoleAN';
import { RoleMgr } from '../../role/RoleMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class ModifyNamePage extends WinBase {
    @property(cc.Node)
    private NdClose: cc.Node = null;

    @property(cc.Node)
    private BtnModifyName: cc.Node = null;

    @property(cc.EditBox)
    private editBox: cc.EditBox = null;

    @property(cc.Label)
    private labHas: cc.Label = null;

    @property(cc.Label)
    private need: cc.Label = null;

    @property(DynamicImage)
    private sprIcon: DynamicImage = null;

    @property(cc.Toggle) // 音乐关
    private CkBoy: cc.Toggle = null;
    @property(cc.Toggle) // 音乐关
    private CkGirl: cc.Toggle = null;

    protected start(): void {
        super.start();
        const item: Cfg_Item = ModelMgr.I.SettingModel.getCfgItem();// 改名卡
        EventClient.I.on(`${E.Bag.ItemChangeOfId}${item.Id}`, this.onItemChange, this);
        UtilGame.Click(this.NodeBlack, () => {
            this.close();
        }, this, { scale: 1 });
        UtilGame.Click(this.NdClose, () => {
            this.close();
        }, this);

        UtilGame.Click(this.BtnModifyName, () => {
            const item: Cfg_Item = ModelMgr.I.SettingModel.getCfgItem();// 改名卡
            const num = BagMgr.I.getItemNum(item.Id);
            if (!num) {
                WinMgr.I.open(ViewConst.ItemSourceWin, item.Id);
                // MsgToastMgr.Show(`${item.Name}${i18n.tt(Lang.build_num_notenough)}`);
                return;
            }

            const curSex = RoleMgr.I.d.Sex;// 1男2女
            if (this.editBox.string.trim()) { // 有字符串
                if (this.editBox.string.trim() === RoleMgr.I.info.getAreaNick(NickShowType.Nick)) {
                    if (curSex === (this.CkBoy.isChecked ? 1 : 2)) { // 性别有变化
                        // 性别也没有变化
                        MsgToastMgr.Show(i18n.tt(Lang.setting_unchangeboth));
                    } else {
                        ControllerMgr.I.SettingController.reqC2SChangeNick(this.CkBoy.isChecked ? 1 : 2, '');
                    }
                } else {
                    this._sendReq();
                }
            } else { // 没有字符串判断性别是否有变化
                // eslint-disable-next-line no-lonely-if
                if ((curSex === 1 && this.CkBoy.isChecked) || (curSex === 2 && this.CkGirl.isChecked)) {
                    MsgToastMgr.Show(i18n.tt(Lang.setting_unchange));
                } else {
                    ControllerMgr.I.SettingController.reqC2SChangeNick(this.CkBoy.isChecked ? 1 : 2, '');
                }
            }
        }, this);

        this.CkBoy.node.on('toggle', () => { this._onToggle(true); }, this);
        this.CkGirl.node.on('toggle', () => { this._onToggle(false); }, this);
        EventClient.I.on(E.SysSetting.ModifyName, this._onModyfySuccess, this);
        RoleMgr.I.on(this._onSexChange, this, RoleAN.N.Sex);
    }

    private _onSexChange() {
        this._setDefaultSex();
    }
    // 改名成功 更新性别  物品数量
    private _onModyfySuccess() {
        MsgToastMgr.Show(i18n.tt(Lang.setting_modify_success));
        this._setItemIcon();
    }

    /** 校验姓名格式 &  改名卡数量  */
    private _sendReq() {
        const _nickStr = this.editBox.string;
        if (!_nickStr) { // 昵称不能为空
            MsgToastMgr.Show(i18n.tt(Lang.login_nick_null));
            return;
        }
        const inZh = UtilString.IsChinese(_nickStr);
        const isEn = UtilString.IsEnglish(_nickStr);
        if (inZh || isEn) { // 名字中包括中英文
            const item: Cfg_Item = ModelMgr.I.SettingModel.getCfgItem();// 改名卡
            const num = BagMgr.I.getItemNum(item.Id);
            if (num) {
                ControllerMgr.I.SettingController.reqC2SChangeNick(this.CkBoy.isChecked ? 1 : 2, _nickStr);
            } else {
                WinMgr.I.open(ViewConst.ItemSourceWin, item.Id);
                // MsgToastMgr.Show(`${item.Name}${i18n.tt(Lang.build_num_notenough)}`);
            }
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.login_nick_err));
        }
    }

    private _onToggle(sex: boolean) {
        this.CkBoy.isChecked = sex;
        this.CkGirl.isChecked = !sex;
    }

    private _setDefaultSex() {
        const curSex = RoleMgr.I.d.Sex;
        this.CkBoy.isChecked = curSex === 1;
        this.CkGirl.isChecked = curSex === 2;
    }

    protected onDestroy(): void {
        EventClient.I.off(E.SysSetting.ModifyName, this._onModyfySuccess, this);
        RoleMgr.I.off(this._onSexChange, this, RoleAN.N.Sex);
        const item: Cfg_Item = ModelMgr.I.SettingModel.getCfgItem();// 改名卡
        EventClient.I.off(`${E.Bag.ItemChangeOfId}${item.Id}`, this.onItemChange, this);
    }

    public init(params: any[]): void {
        this._setDefaultSex();
        this._setItemIcon();
        const item: Cfg_Item = ModelMgr.I.SettingModel.getCfgItem();// 改名卡
        this.sprIcon.loadImage(UtilItem.GetItemIconPath(item.PicID, 1), 1, true);
    }

    private onItemChange() {
        this._setItemIcon();
    }

    private _setItemIcon() {
        const item: Cfg_Item = ModelMgr.I.SettingModel.getCfgItem();// 改名卡
        const num = BagMgr.I.getItemNum(item.Id);
        this.labHas.string = `${UtilNum.Convert(num)}`;
        const c = num >= 1 ? UtilColor.Green() : UtilColor.Red();
        this.labHas.node.color = c;
    }
}
