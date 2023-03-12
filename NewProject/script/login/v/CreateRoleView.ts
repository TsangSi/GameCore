/*
 * @Author: hrd
 * @Date: 2022-04-18 10:38:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-17 12:22:49
 * @FilePath: \SanGuo2.4\assets\script\login\v\CreateRoleView.ts
 * @Description:
 */
import { EventClient } from '../../app/base/event/EventClient';
import { AudioMgr } from '../../app/base/manager/AudioMgr';
import { UtilString } from '../../app/base/utils/UtilString';
import BaseUiView from '../../app/core/mvc/view/BaseUiView';
import WinMgr from '../../app/core/mvc/WinMgr';
import { DynamicImage } from '../../game/base/components/DynamicImage';
import MsgToastMgr from '../../game/base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../game/base/utils/UtilGame';
import { E } from '../../game/const/EventName';
import { RES_ENUM } from '../../game/const/ResPath';
import { ViewConst } from '../../game/const/ViewConst';
import ModelMgr from '../../game/manager/ModelMgr';
import { i18n, Lang } from '../../i18n/i18n';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CreateRoleView extends BaseUiView {
    /** 性别 */
    @property(cc.ToggleContainer)
    private SexRadio: cc.ToggleContainer = null;
    /** 随机名字按钮 */
    @property(cc.Node)
    private BtnGetName: cc.Node = null;
    /** 名字 */
    @property(cc.EditBox)
    private EditBoxName: cc.EditBox = null;
    /** 开始游戏 */
    @property(cc.Node)
    private BtnStartGame: cc.Node = null;
    /** 倒计时节点 */
    @property(cc.Node)
    private NdAutoStart: cc.Node = null;
    @property(DynamicImage)
    private NdMain: DynamicImage = null;

    private _curSex: number = 1;
    private autoStatr: number = 0;
    public init(param: unknown[]): void {
        this.addEvent();
        this.initUI();
        this.playCreateRoleMusic();
    }
    public playCreateRoleMusic(): void {
        AudioMgr.I.playCreateRoleMusic();
    }

    private addEvent() {
        EventClient.I.on(E.Login.ResultRoleNick, this.onResultRoleNick, this);
    }

    private delEvent() {
        EventClient.I.off(E.Login.ResultRoleNick, this.onResultRoleNick, this);
    }

    private initUI() {
        // 开始游戏
        UtilGame.Click(this.BtnStartGame, () => {
            this.startGame();
        }, this);

        // 获取名字
        UtilGame.Click(this.BtnGetName, () => {
            this.getRandomNick();
        }, this);

        // 男女
        const _sex1 = this.SexRadio.node.getChildByName('Toggle1'); // 男
        const _sex2 = this.SexRadio.node.getChildByName('Toggle2');// 女

        UtilGame.Click(_sex1, () => {
            this.sexSetChose(1);
        }, this);
        UtilGame.Click(_sex2, () => {
            this.sexSetChose(2);
        }, this);
        // 随机选中一个性别
        const roNum = Math.round(Math.random());
        this.sexSetChose(roNum + 1);
        this.getRandomNick();
        // 是否需要自动开始
        this.NdAutoStart.active = true;
    }

    private startGame() {
        const _nickStr = this.EditBoxName.string;
        if (!_nickStr) {
            // 昵称不能为空
            MsgToastMgr.Show(i18n.tt(Lang.login_nick_null));
            return;
        }

        const inZh = UtilString.IsChinese(_nickStr);
        const isEn = UtilString.IsEnglish(_nickStr);

        if (inZh || isEn) {
            // 名字中包括中英文
            EventClient.I.emit(E.Login.ReqCreateRole, _nickStr, this.autoStatr);
        } else if (this.autoStatr === 1) {
            // 超时自动随机名
            this.getRandomNick();
        } else {
            MsgToastMgr.Show(i18n.tt(Lang.login_nick_err));
        }
    }

    private getRandomNick() {
        const sex = this._curSex;
        ModelMgr.I.LoginModel.sex = this._curSex;
        EventClient.I.emit(E.Login.ReqRoleNick, sex);
    }

    private onResultRoleNick(nick: string) {
        if (!nick) return;
        this.EditBoxName.string = nick;
        if (this.autoStatr === 1) {
            // 超时后返回的随机名
            EventClient.I.emit(E.Login.ReqCreateRole, nick, this.autoStatr);
        }
    }

    private sexSetChose(sex: number) {
        const _sex1 = this.SexRadio.node.getChildByName('Toggle1'); // 男
        const _sex2 = this.SexRadio.node.getChildByName('Toggle2');// 女
        // 背景框
        // const CheckmarkImg = [RES_ENUM.CreateRole_Btn_Cjjs_Xinggeweixuanzhong_02, RES_ENUM.CreateRole_Btn_Cjjs_Xinggexuanzhong_02];
        // 背景图片[未选择，选中]
        const bgImg: string[] = [RES_ENUM.CreateRole_Btn_Cjjs_Xinggeweixuanzhong_01, RES_ENUM.CreateRole_Btn_Cjjs_Xinggexuanzhong_01];
        // 主角立绘[男，女]
        const mainImg: string[] = [RES_ENUM.CreateRole_Img_Cjjs_Juese_01, RES_ENUM.CreateRole_Img_Cjjs_Juese_02];
        let sex1N: number = 0;
        let sex2N: number = 0;
        if (sex === 1) {
            // 男
            sex1N = 1;
            sex2N = 0;
        } else if (sex === 2) {
            // 女
            sex1N = 0;
            sex2N = 1;
        }
        // 头像背景
        _sex1.getChildByName('Background').getComponent(DynamicImage).loadImage(bgImg[sex1N], 1, true);
        _sex2.getChildByName('Background').getComponent(DynamicImage).loadImage(bgImg[sex2N], 1, true);
        // 头像装饰框
        // _sex1.getChildByName('Checkmark').getComponent(DynamicImage).loadImage(CheckmarkImg[sex1N], 1, true);
        // _sex2.getChildByName('Checkmark').getComponent(DynamicImage).loadImage(CheckmarkImg[sex2N], 1, true);
        // 立绘
        this.NdMain.loadImage(mainImg[sex - 1], 1, true);
        this.NdMain.node.setPosition(sex === 1 ? cc.v2(20, -30) : cc.v2(45, -42));
        this._curSex = sex;
        ModelMgr.I.LoginModel.sex = this._curSex;
    }

    private isAutoStart(): void {
        MsgToastMgr.Show('自动开始');
        this.autoStatr = 1;
        this.NdAutoStart.active = false;
        this.startGame();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.delEvent();
    }
}
