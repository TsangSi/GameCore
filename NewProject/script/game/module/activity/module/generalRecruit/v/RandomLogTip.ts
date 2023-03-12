import { EventClient } from '../../../../../../app/base/event/EventClient';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import ListView from '../../../../../base/components/listview/ListView';
import { ConfigConst } from '../../../../../base/config/ConfigConst';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import WinBase from '../../../../../com/win/WinBase';
import { E } from '../../../../../const/EventName';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { ClientFlagEnum } from '../GeneralRecruitConst';
import { RandomItem } from './RandomItem';

const { ccclass, property } = cc._decorator;

export enum ServerType {
    personal = 1,
    local = 2,
}

@ccclass
export class RandomLogTip extends WinBase {
    @property(cc.Node)
    private NdSprMask: cc.Node = null;
    @property(cc.Node)
    private BtnClose: cc.Node = null;

    // 标题
    @property(cc.Label)
    private labTitle: cc.Label = null;

    /** 概率列表 */
    @property(ListView)
    private randomList: ListView = null;
    @property(cc.Node)
    private NdGLTitle: cc.Node = null;
    @property(cc.Node)
    private NdLog: cc.Node = null;

    /** 日志列表 */
    @property(ListView)
    private logList: ListView = null;

    @property(cc.Node)
    private NdBg: cc.Node = null;

    // list箭头
    @property(cc.Sprite)
    private SprTop: cc.Sprite = null;
    @property(cc.Sprite)
    private SprBottom: cc.Sprite = null;
    @property(cc.Toggle)
    private CkThisServer: cc.Toggle = null;
    @property(cc.Toggle)
    private CkPersonalServer: cc.Toggle = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => this.close(), this, { scale: 1 });
        UtilGame.Click(this.BtnClose, () => this.close(), this);
        // 获得招募日志

        // 日志请求 本服记录  个人记录
        this.CkThisServer.node.on('toggle', () => {
            if (!this.CkThisServer.isChecked) {
                this.CkThisServer.isChecked = true;
                return;
            }
            console.log('发送请求');

            this.CkPersonalServer.isChecked = false;
            this._onReqLogInfo(ServerType.local);// 本地记录
        }, this);
        this.CkPersonalServer.node.on('toggle', () => {
            if (!this.CkPersonalServer.isChecked) {
                this.CkPersonalServer.isChecked = true;
                return;
            }
            console.log('发送请求');
            this.CkThisServer.isChecked = false;
            this._onReqLogInfo(ServerType.personal);// 个人记录
        }, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
        EventClient.I.off(E.GeneralRecruit.getZhaoMuLog, this._onGetZhaoMuLog, this);
    }

    private _onReqLogInfo(server: ServerType): void {
        // 请求本服 或者个人 服记录
        // 判断本地已经有数据，无需再发起请求
        this._initReqLog(server);
    }

    // 返回招募日志
    private _logArr: string[] = [];
    private _onGetZhaoMuLog(data: S2CZhaoMuOpenLog) {
        if (data.FuncId !== this._actFuncId) return;

        this._logArr = [];
        this._logArr = ModelMgr.I.GeneralRecruitModel.getZhaoMuLog(this._actFuncId, data.Type);

        // if (!this._logArr.length) {
        //     // 测试数据
        //     for (let i = 0; i < 30; i++) {
        //         this._logArr.push('<color=${UtilColor.NorV}>恭喜</c><color=${UtilColor.GreenD}>S999.这是测试数据</color><color=${UtilColor.NorV}>在武将招募中招募到</color><color=#D53838>【吕布】</color>');
        //     }
        // }
        this.logList.setNumItems(this._logArr.length, 0);
        this.logList.scrollTo(0);// 滑动到顶部
    }

    private isLog: boolean = false;
    private _actFuncId: number;
    public init(params: [{ isLog: boolean, actId: number }]): void {
        EventClient.I.on(E.GeneralRecruit.getZhaoMuLog, this._onGetZhaoMuLog, this);

        this._actFuncId = params[0].actId;
        this.isLog = params[0].isLog;
        this.randomList.node.active = !this.isLog;
        this.logList.node.active = this.isLog;

        this.NdGLTitle.active = !this.isLog;
        this.NdLog.active = this.isLog;

        if (this.isLog) {
            this.labTitle.string = i18n.tt(Lang.general_titleLog);
            this.NdBg.height = 532;
            this.CkPersonalServer.isChecked = false;
            this.CkThisServer.isChecked = true;
            this._initReqLog(ServerType.local);

            this.SprTop.node.y = 372;
            this.SprBottom.node.y = -150;
        } else {
            this.labTitle.string = i18n.tt(Lang.general_titleRandom);
            this.NdBg.height = 651;
            this._initGL();

            this.SprTop.node.y = 330;
            this.SprBottom.node.y = -265;
        }
    }

    private _initReqLog(server: ServerType): void {
        ControllerMgr.I.GeneralRecruitController.reqC2SZhaoMuOpenLog(this._actFuncId, server, ClientFlagEnum.ClientInner);
    }

    private glArr: Cfg_Server_GeneralZhaoMu[];
    private _initGL(): void {
        // ModelMgr.I.ActivityModel.getConfig(this._actFuncId, ConfigConst.Cfg_Server_GeneralZhaoMu, () => {
        this.glArr = ModelMgr.I.GeneralRecruitModel.getCfgActZhaoMuGLCfg(this._actFuncId);
        this.randomList.setNumItems(this.glArr.length, 0);
        this.randomList.scrollTo(0);// 滑动到顶部
        // }, this);
    }

    private scrollEvent(node: cc.Node, index: number) {
        // if (index <= 5) {
        //     this.SprTop.node.active = false;
        //     this.SprBottom.node.active = true;
        // } else if (index >= this._allCfg.length - 6) {
        //     this.SprTop.node.active = true;
        //     this.SprBottom.node.active = false;
        // } else {
        //     this.SprTop.node.active = true;
        //     this.SprBottom.node.active = true;
        // }
        // 读取配置
        if (this.isLog) {
            // 日志另外处理
            const item: RandomItem = node.getComponent(RandomItem);
            item.setData(this._logArr[index], true);
        } else {
            const cfg: Cfg_Server_GeneralZhaoMu = this.glArr[index];
            const item: RandomItem = node.getComponent(RandomItem);
            item.setData(cfg, false, index);
        }
    }
}
