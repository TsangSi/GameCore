/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import {
    _decorator, Size, js, size,
} from 'cc';
import { BundleType } from '../global/GConst';
import { i18n } from '../i18n/i18n';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = UIConfig
 * DateTime = Thu Sep 23 2021 21:30:37 GMT+0800 (中国标准时间)
 * Author = knuth520
 * FileBasename = UIConfig.ts
 * FileBasenameNoExtension = UIConfig
 * URL = db://assets/scripts/ui/UIConfig.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

/** ui类型 */
export const enum UIType {
    /** 窗口 一般指大窗口 */
    Win,
    /** 面板 一般指非大窗口/弹窗框 */
    Panel,
    /** 子页签 子窗口，大窗口下可以有N个子窗口 */
    Page,
    Dialog,
    Tips,
}

export const enum BtnHelpStyle {
    /** 默认帮助按钮样式 */
    Normall,
    /** 其它，暂未用到 */
    Other
}

export const enum BtnCloseStyle {
    /** 默认关闭按钮样式 */
    Normall,
    /** 活动界面样式的关闭按钮 */
    Activity,
}

/** 关闭类型 */
export const enum CloseType {
    /** 关闭 */
    Close,
    /** 隐藏 */
    Hide
}

export const enum PrefabName {
    Page1 = 'Page1',

}

export const enum PAGE_NAME {
    Page1 = 'Page1',
    Page2 = 'Page2',
    Page3 = 'Page3',
    /** 背包 */
    Bag = 'Bag',
    /** 邮件 */
    Mail = 'Mail',
    /** 合成 */
    Synth = 'Synth',
    /** 分解 */
    Decomp = 'Decomp',
    /** 吞金 */
    TSwallow = 'TSwallow',
}

export const enum UI_NAME {
    /** 登陆 */
    Login = 'Login',
    /** 热更新界面 */
    UpdateWin = 'UpdateWin',
    /** 创角 */
    CreateRole = 'CreateRole',
    /** 账号登录 */
    AccountLogin = 'AccountLogin',
    /** 账号注册 */
    AccountReg = 'AccountReg',
    /** 服务器选中 */
    ServerChose = 'ServerChose',
    /** 操作杆 */
    Joystick = 'Joystick',
    /** 主界面 */
    MainUI = 'MainUI',
    /** 角色面板 */
    Role = 'Role',
    /** 任务界面 */
    Task = 'Task',
    /** 飘字 */
    MsgToast = 'MsgToast',
    /** 剑魂 */
    Sword = 'Sword',
    /** 战斗界面 */
    Battle = 'Battle',
    /** 背包 */
    BagMain = 'BagMain',
    /** 城市操作 */
    CityOper = 'CityOper',
    Bottom = 'Bottom',
    Test = 'Test',
    Test2 = 'Test2',
    Test3 = 'Test3',
}

export interface PageInfo {
    /** prefab名字 */
    name?: PAGE_NAME;
    /** 页签按钮名字 */
    btnName: string,
    /** 路径 */
    path?: string;
    /** bundle名字 */
    bundle?: BundleType;
    /** 页签按钮资源 */
    pageBtn?: string[];
    /** 帮助id */
    helpId?: number;
    /** 关闭类型 */
    closeType?: CloseType;
}

/** 窗口配置信息 */
export interface WinInfo {
    /** 标题 */
    title: string;
    /** 路径 */
    path?: string;
    /** bundle包名 */
    bundle?: BundleType;
    /** key名字 */
    name?: UI_NAME;
    /** 关闭类型 */
    closeType?: CloseType;
    /** 窗口大小 */
    size?: Size;
    /** 窗口类型 */
    uiType?: UIType;
    /** 页签id列表 */
    pages?: PAGE_NAME[];
    /** 是否隐藏返回按钮 */
    hideBack?: boolean;
    /** 是否隐藏关闭按钮 */
    hideClose?: boolean;
    /** 点击空白区域关闭 */
    hideTips?: boolean;
    /** 帮助id */
    helpId?: number;
}

/** ui配置信息 */
export type UIInfo = WinInfo;

@ccclass('UIConfig')
export abstract class UIConfig {
    /** 组装成uiInfo */
    private uiInfo: { [name: string]: UIInfo; } = js.createMap(true);
    protected getUIInfo(name: UI_NAME): UIInfo {
        if (this.uiInfo[name]) {
            return this.uiInfo[name];
        }
        this.uiInfo[name] = js.createMap(true);
        if (this.uiConfig[name]) {
            for (const k in this.uiConfig[name]) {
                this.uiInfo[name][k] = this.uiConfig[name][k];
            }
            this.uiInfo[name].name = name;
            this.uiConfig[name] = undefined;
        }
        return this.uiInfo[name];
    }

    public getPageInfo(name: PAGE_NAME): PageInfo {
        return this.pageConfig[name];
    }

    /**
     * 页签界面都在这里定义
     * 所谓的页签就指通过页签按钮点击显示的页签界面
     */
    private pageConfig: { [name: string]: PageInfo; } = {
        //         [PAGE_NAME.Page1]: {
        //  btnName: i18n.t('ui_title_page1'), helpId: 21304, path: 'prefabs/ui/role/Page1', bundle: BundleType.gamelogic, pageBtn: ['res/ui/role/img_btn_longmai01', 'res/ui/role/img_btn_longmai02'],
        // },
        //         [PAGE_NAME.Page2]: {
        //  btnName: i18n.t('ui_title_page2'), path: 'prefabs/ui/role/Page2', bundle: BundleType.gamelogic, pageBtn: ['res/ui/role/img_btn_shengxian01', 'res/ui/role/img_btn_shengxian02'],
        // },
        //         [PAGE_NAME.Page3]: {
        //  btnName: i18n.t('ui_title_page3'), helpId: 21304, path: 'prefabs/ui/role/Page3', bundle: BundleType.gamelogic, pageBtn: ['res/ui/role/img_btn_xiantongqn01', 'res/ui/role/img_btn_xiantongqn02'],
        // },
        //         [PAGE_NAME.Bag]: {
        //  btnName: i18n.t('ui_bag'), path: 'prefabs/ui/bag/Bag', bundle: BundleType.gamelogic, pageBtn: ['res/ui/bag/img_btn_beibao01', 'res/ui/bag/img_btn_beibao02'],
        // },
        //         [PAGE_NAME.Decomp]: {
        //  btnName: i18n.t('ui_decomp'), path: 'prefabs/ui/bag/Decomp', bundle: BundleType.gamelogic, pageBtn: ['res/ui/bag/img_btn_fenjie01', 'res/ui/bag/img_btn_fenjie02'],
        // },
        //         [PAGE_NAME.Mail]: {
        //  btnName: i18n.t('ui_mail'), path: 'prefabs/ui/bag/Mail', bundle: BundleType.gamelogic, pageBtn: ['res/ui/bag/img_btn_youjian01', 'res/ui/bag/img_btn_youjian02'],
        // },
        //         [PAGE_NAME.Synth]: {
        //  btnName: i18n.t('ui_synth'), path: 'prefabs/ui/bag/Synth', bundle: BundleType.gamelogic, pageBtn: ['res/ui/bag/img_btn_hecheng01', 'res/ui/bag/img_btn_hecheng02'],
        // },
        //         [PAGE_NAME.TSwallow]: {
        //  btnName: i18n.t('ui_tswallow'), path: 'prefabs/ui/bag/TSwallow', bundle: BundleType.gamelogic, pageBtn: ['res/ui/bag/img_btn_tunjin01', 'res/ui/bag/img_btn_tunjin02'],
        // },

    };

    /**
     * 大界面，小界面，大窗口，小窗口 都在这定义
     * 有页签界面的，基本不需要主界面prefab的，所以没有path
     */
    private uiConfig: { [name: string]: WinInfo; } = {
        [UI_NAME.Role]: { title: i18n.t('ui_title_role_win'), pages: [PAGE_NAME.Page1, PAGE_NAME.Page2, PAGE_NAME.Page3] },
        [UI_NAME.UpdateWin]: { title: i18n.t('ui_title_updatewin'), path: 'prefabs/ui/update/UpdateWin' },
        [UI_NAME.ServerChose]: { title: i18n.t('ui_title_serverchose'), path: 'prefabs/ui/login/ServerChose' },
        [UI_NAME.Login]: { title: i18n.t('ui_title_login'), path: 'prefabs/ui/login/LoginView' },
        [UI_NAME.AccountLogin]: { title: i18n.t('ui_title_account_login'), path: 'prefabs/ui/login/AccountLogin', size: size(647, 414), hideClose: true, uiType: UIType.Win },
        [UI_NAME.AccountReg]: { title: i18n.t('ui_title_account_reg'), path: 'prefabs/ui/login/AccountReg', size: size(647, 414), uiType: UIType.Win },
        [UI_NAME.CreateRole]: { title: i18n.t('ui_title_create_role'), path: 'prefabs/ui/login/CreateRoleView' },
        [UI_NAME.Joystick]: { title: '', path: 'prefabs/ui/main/Joystick', bundle: BundleType.gamelogic },
        [UI_NAME.MainUI]: { title: i18n.t('ui_title_main_ui'), path: 'prefabs/ui/main/MainUI', bundle: BundleType.gamelogic },
        [UI_NAME.MsgToast]: { title: i18n.t('ui_title_msg_toast'), path: 'prefabs/com/MsgToast', uiType: UIType.Tips },
        [UI_NAME.Sword]: { title: i18n.t('ui_title_sword'), path: 'prefabs/ui/sword/Sword', bundle: BundleType.gamelogic, helpId: 21304, uiType: UIType.Win, size: size(500, 600), hideBack: true },
        [UI_NAME.Battle]: { title: '', path: 'prefabs/battle/Battle', bundle: BundleType.gamelogic },
        [UI_NAME.BagMain]: { title: i18n.t('ui_bag'), pages: [PAGE_NAME.Bag] },
        [UI_NAME.CityOper]: { title: i18n.t('ui_bag'), path: 'prefabs/ui/main/CityOper', bundle: BundleType.gamelogic },
        [UI_NAME.Bottom]: { title: '', path: 'prefabs/ui/main/Bottom', bundle: BundleType.gamelogic },
        [UI_NAME.Test]: { title: '', path: 'prefabs/ui/main/Test', bundle: BundleType.gamelogic },
        [UI_NAME.Test2]: { title: '', path: 'prefabs/ui/main/Test2', bundle: BundleType.gamelogic },
        [UI_NAME.Test3]: { title: '', path: 'prefabs/ui/main/Test3', bundle: BundleType.gamelogic },
    };
}
