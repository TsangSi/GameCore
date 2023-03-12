/*
 * @Author: zs
 * @Date: 2022-09-20 11:15:57
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\gamePass\GamePassModel.ts
 * @Description:
 *
 */
import { EventClient } from '../../../app/base/event/EventClient';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { Config } from '../../base/config/Config';
import { ConfigPassLevelIndexer } from '../../base/config/indexer/ConfigPassLevelIndexer';
import { TabData } from '../../com/tab/TabData';
import { E } from '../../const/EventName';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';
import { RedDotCheckMgr } from '../reddot/RedDotCheckMgr';
import { IListenInfo, REDDOT_ADD_LISTEN_INFO, RID } from '../reddot/RedDotConst';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { RoleAN } from '../role/RoleAN';
import { RoleMgr } from '../role/RoleMgr';
import { EGamePassRewardType } from './GamePassConst';

const { ccclass, property } = cc._decorator;

@ccclass('GamePassModel')
export class GamePassModel extends BaseModel {
    public clearAll(): void {
        // throw new Error('Method not implemented.');
    }

    // public init(): void {
    //     // 版署版本先去掉监听
    //     // RedDotCheckMgr.I.on(RID.Stage.Main.Pass.Id, this.onCheckPassRed, this);
    //     // RedDotCheckMgr.I.on(RID.Stage.Main.Pass.Chapter, this.onCheckAllRed, this);
    // }

    public onRedDotEventListen(): void {
        RedDotCheckMgr.I.on(RID.Stage.Main.Pass.Id, this.onCheckPassRed, this);
        RedDotCheckMgr.I.on(RID.Stage.Main.Pass.Chapter, this.onCheckAllRed, this);
    }

    public offRedDotEventListen(): void {
        RedDotCheckMgr.I.off(RID.Stage.Main.Pass.Id, this.onCheckPassRed, this);
        RedDotCheckMgr.I.off(RID.Stage.Main.Pass.Chapter, this.onCheckAllRed, this);
    }

    public registerRedDotListen(): void {
        const rid = RID.Stage.Main.Pass.Chapter;
        const info: IListenInfo = {
            // 通行证信息协议
            ProtoId: [ProtoId.S2CStagePassInfo_ID],
            /** 玩家属性：关卡 */
            RoleAttr: [RoleAN.N.Stage],
            // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
            CheckVid: [ViewConst.GamePassWin],
            // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走rid个协议监听
            ProxyRid: [RID.Stage.Main.Pass.Id],
        };
        RedDotMgr.I.emit(REDDOT_ADD_LISTEN_INFO, { rid, info });
    }

    /** 检查每一个章节 */
    public onCheckAllRed(): void {
        this.checkRed();
    }

    /** 检查只要有一个章节有红点就停止 */
    private onCheckPassRed() {
        this.checkRed(false);
    }

    private info: S2CStagePassInfo = cc.js.createMap(true);
    public setInfo(d: S2CStagePassInfo): void {
        this.info = d;
        EventClient.I.emit(E.GamePass.UpdateInfo);
    }

    /**
     * 根据奖励类型和id获取是否已领取奖励状态
     * @param type 奖励类型，GamePassModel.RewardType
     * @param key 唯一id
     * @returns
     */
    public isYlqReward(type: EGamePassRewardType, key: number): boolean {
        switch (type) {
            case EGamePassRewardType.Nor:
                return this.info?.ComRewardList?.indexOf(key) >= 0;
            case EGamePassRewardType.Buy:
                return this.info?.BuyRewardList?.indexOf(key) >= 0;
            default:
                return false;
        }
    }

    /** 获取关卡奖励购买状态 */
    public getPassRewardBuyStatus(passId: number): boolean {
        return this.info?.PassIdBuyList?.indexOf(passId) >= 0;
    }

    /** 获取通行证名称 */
    public getPassRewardName(passId: number): string {
        return Config.Get(Config.Type.Cfg_Stage_PassName).getValueByKey(passId, 'Name');
    }

    /**
     * 获取对应通行证索引的配置
     * @param passId 通行证id
     * @param index 索引
     * @returns
     */
    public getPassRewardCfg(passId: number, index: number): Cfg_Stage_PassLevel {
        const config = Config.Get(Config.Type.Cfg_Stage_PassLevel);
        // const indexs = config.getValueByKey(passId);
        return config.getValueByIndex(index);
    }

    // private maxPassId: number = 0;
    // /** 获取开锁的最大通行证id */
    // public getUnLockMaxPassId(): number {
    //     return this.maxPassId;
    // }

    private checkRed(isCheckAll: boolean = true): void {
        const stage = RoleMgr.I.d.Stage;
        const cfgPassLevel: ConfigPassLevelIndexer = Config.Get(Config.Type.Cfg_Stage_PassLevel);
        let allRedStatus: boolean = false;
        const pages = this.pageConfig();
        pages.forEach((cfg: TabData) => {
            const indexs: number[] = cfgPassLevel.getValueByKey(cfg.id);
            let passRedStatus: boolean = false;
            /** 是否已购买 */
            const isBuy = this.getPassRewardBuyStatus(cfg.id);
            for (let i = 0, n = indexs.length; i < n; i++) {
                const obj = cfgPassLevel.getValueByIndex(indexs[i], {
                    Key: 0, MaxStageNum: 0, Prize1: '', Prize2: '',
                });
                if (stage > obj.MaxStageNum) {
                    // 已经达到可领取关卡，再判断是否已领取
                    // eslint-disable-next-line max-len
                    if ((obj.Prize1 && !this.isYlqReward(EGamePassRewardType.Nor, obj.Key)) || (obj.Prize2 && isBuy && !this.isYlqReward(EGamePassRewardType.Buy, obj.Key))) {
                        // 未领取，要显示红点
                        passRedStatus = true;
                        break;
                    }
                } else {
                    // 未达到该关卡，那么后面的关卡估计也是没达到
                    passRedStatus = false;
                    break;
                }
            }
            allRedStatus = allRedStatus || passRedStatus;
            // 更新单个章节的红点
            RedDotMgr.I.updateRedDot(RID.Stage.Main.Pass.Chapter + cfg.id, passRedStatus);
            if (!isCheckAll && allRedStatus) {
                // 停止继续检测
                return false;
            }
            // 继续检测
            return true;
        });
        /** 更新整个通行证的 */
        RedDotMgr.I.updateRedDot(RID.Stage.Main.Pass.Chapter, allRedStatus);
    }
    public pageConfig(): TabData[] {
        const items: TabData[] = [];
        const stage = RoleMgr.I.d.Stage;
        Config.Get(Config.Type.Cfg_Stage_PassName).forEach((cfg: Cfg_Stage_PassName) => {
            if (stage >= cfg.MinStage) {
                items.push({
                    id: cfg.PassId,
                    title: cfg.Name,
                    uiPath: UI_PATH_ENUM.GamePassView,
                    redId: RID.Stage.Main.Pass.Chapter + cfg.PassId,
                });
                return true;
            } else {
                return false;
            }
        });
        return items;
    }
}
