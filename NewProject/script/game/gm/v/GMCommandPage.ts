/* eslint-disable no-case-declarations */
/* eslint-disable dot-notation */

import { UtilTime } from '../../../app/base/utils/UtilTime';
import WinMgr from '../../../app/core/mvc/WinMgr';
import ListView from '../../base/components/listview/ListView';
import { Config } from '../../base/config/Config';
import MsgToastMgr from '../../base/msgtoast/MsgToastMgr';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { UtilGame } from '../../base/utils/UtilGame';
import { BattleMgr } from '../../battle/BattleMgr';
import { WinTabPage } from '../../com/win/WinTabPage';
import ControllerMgr from '../../manager/ControllerMgr';
import NetMgr from '../../manager/NetMgr';
import { RoleMgr } from '../../module/role/RoleMgr';
import { GmLabelItem } from './GmLabelItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class GMCommandPage extends WinTabPage {
    @property(cc.EditBox)
    private EditCommand: cc.EditBox = null;

    @property(cc.Node)
    private NdSendButton: cc.Node = null;

    @property(cc.Node)/** 一键增加四个常用指令 */
    private VIP_LEVEL_ARMY_GAMELV: cc.Node = null;

    @property(cc.Label)
    private labTime: cc.Label = null;

    @property(ListView)
    private listView: ListView = null;
    private data = [
        ['date@2023-02-20 10:00:00', '改服务器时间的命令'],
        ['additem@道具ID@道具数量', '        发送道具'],
        ['sendmail@邮件id@道具id:数量', '    发送邮件'],
        ['resetalltimes', '     重置个人&至尊首领挑战次数'],
        ['setattr@属性id@', '   属性参数'],

        ['setattr@2560@10', 'VIP等级      修改VIP等级'],
        ['setattr@2524@200', '等级     修改人物等级（2524是属性id）'],
        ['setattr@2556@5@2', '     修改军衔 阶@级 这两个统一方便使用'],
        ['setattr@2557@151', '    修改通关关卡151'],

        ['setattr@2530@', '称号id   修改称号'],
        ['setattr@2554@2', '        设置月卡特权'],
        ['arena@times', '       个人竞技场恢复次数'],
        ['arena@settle', '      个人竞技场 今日结算'],
        ['arena@setrank@10000', '       个人竞技场 设置排名为10000名'],
        ['arena@clearsettletime', '     个人竞技场 重置自身结算时间'],
        ['arena@clearallrank', '        个人竞技场 清空上榜玩家'],
        ['testTitle@AddTitleServerNum@10001@100', '   增加全服激活称号人数@称号id@数量'],
        ['onDayChange', '    每日刷新'],
        ['sendnotice', '   发送一条测试的系统通知'],
        ['setTempAttr', '   临时设置成宗主状态，测试活动时装用'],
        ['fight@1', '   【战斗】自己打自己'],
        ['fight@2@userid', '   【战斗】自己打别人'],
        ['fight@userid1@userid2', '   【战斗】别人打别人'],
        ['mall@refresh', '   刷新神秘商城'],

        ['ftask@', '任务id   完成指定任务'],
        ['task@3@', '任务id  引导直接跳转到某个任务'],
        ['resetActiveTime@1@12:00-12:10', '活动id  偏移活动时间'],
        ['bosshome@SetEnergyVal@100', '烽火连城 加体力'],
        ['printfight@1', '打印后端战报'],
        ['roleSkin@Active@1001', '获取时装'],

        ['printClientFight', '[打印上一场战报协议数据]'],
        ['printCfg@', ' [打印配置数据 @后填配置表名]'],
        ['sendMsg@', ' 协议请求@后填 [协议id#协议参数json数据结构]'],
        ['printRoleAttr', ' 打印角色属性数据'],
        ['rankMatch@SetScore@2000', '【排位赛】设置自己的分数'],
        ['rankMatch@NextSession', '【排位赛】结束本赛季'],
        ['explore@setstage@5', '【三国探险】设置关卡'],
        ['explore@ondaychange', '【三国探险】每日重置'],

    ];

    public test(): void {
        //
        const a = 12;
        console.log(a);
    }

    protected start(): void {
        super.start();
        /** 1次发送4条指令 */
        UtilGame.Click(this.VIP_LEVEL_ARMY_GAMELV, () => {
            const str1 = 'setattr@2560@10';
            const str2 = 'setattr@2524@200';
            const str3 = 'setattr@2556@5@2';
            const str4 = 'setattr@2557@151';
            const arr = [str1, str2, str3, str4];
            for (let i = 0; i < 4; i++) {
                const str = arr[i];
                const [cmd, data] = UtilGame.ParseGMStr(str);
                ControllerMgr.I.GMController.reqC2SGm(cmd, data);
            }
        }, this);

        UtilGame.Click(this.NdSendButton, () => {
            const key = this.EditCommand.string;
            if (!key) {
                MsgToastMgr.Show('没有输入命令');
                return;
            }
            const [cmd, data] = UtilGame.ParseGMStr(key);
            switch (cmd) {
                case 'bowuzhi1':
                    // 添加所有博物志
                    Config.Get(Config.Type.Cfg_CollectionBook).forEach((c: Cfg_CollectionBook) => {
                        // const [cmd, data] = UtilGame.ParseGMStr(key);
                        if (c.Class > 1) {
                            ControllerMgr.I.GMController.reqC2SGm('additem', `${c.Unlockitem}@${2000}`);
                        }
                        return true;
                    });
                    break;
                case 'printClientFight':
                    // eslint-disable-next-line no-unused-expressions, dot-notation, no-case-declarations
                    const jsonStr = BattleMgr.I['_debugfightRepot'];
                    console.log(jsonStr);
                    break;
                case 'printCfg':
                    let cfg = Config.Get(Config.Type.Cfg_Item)['CfgmI'].CfgData[data];
                    if (!cfg) {
                        cfg = Config.Get(Config.Type.Cfg_Item)['CfgmI']['jsonData']['Items'][data];
                    }
                    console.log(cfg);
                    break;
                case 'sendMsg':
                    const arr = data.split('#');
                    const netId = +arr[0];
                    const msg = arr[1] || '{}';
                    console.log(`协议id: ${netId} 参数: ${msg}`);
                    NetMgr.I.sendMessage(netId, JSON.parse(msg));
                    break;
                case 'printRoleAttr':
                    // RoleMgr.I.d
                    console.log(RoleMgr.I.d);
                    break;
                default:

                    ControllerMgr.I.GMController.reqC2SGm(cmd, data);
                    break;
            }

            WinMgr.I.setViewStashParam(this.winId, [1]);
        }, this);
        this.listView.setNumItems(this.data.length, 0);
    }

    public init(param: any): void {
        this.listView.setNumItems(this.data.length, 0);

        this.labTime.string = `开服天数:${UtilFunOpen.serverDays} 当前时间:${UtilTime.FormatToDate(UtilTime.NowSec() * 1000)}`;
        this.schedule(() => {
            this.labTime.string = `开服天数:${UtilFunOpen.serverDays} 当前时间:${UtilTime.FormatToDate(UtilTime.NowSec() * 1000)}`;
        }, 1);
    }

    private scrollEvent(node: cc.Node, index: number) {
        const item: GmLabelItem = node.getComponent(GmLabelItem);
        item.setData(this.data[index][0], this.data[index][1]);
        node.targetOff(this);
        UtilGame.Click(node, (node: cc.Node) => {
            this.EditCommand.string = this.data[index][0];
        }, this);
    }
}
