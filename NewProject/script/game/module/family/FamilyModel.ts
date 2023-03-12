/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable consistent-return */
/* eslint-disable dot-notation */
/* eslint-disable no-lonely-if */
import { data } from '../../../../resources/i18n/en-US';
import { EventClient } from '../../../app/base/event/EventClient';
import { UtilString } from '../../../app/base/utils/UtilString';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { AttrBase } from '../../base/attribute/AttrBase';
import { IAttrBase } from '../../base/attribute/AttrConst';
import { AttrInfo } from '../../base/attribute/AttrInfo';
import { AttrModel } from '../../base/attribute/AttrModel';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { UtilAttr } from '../../base/utils/UtilAttr';
import { E } from '../../const/EventName';
import { EntityUnitType } from '../../entity/EntityConst';
import ModelMgr from '../../manager/ModelMgr';
import MapMgr from '../../map/MapMgr';
import ActivityMgr from '../activity/timerActivity/ActivityMgr';
import { ETimerActId } from '../activity/timerActivity/TimerActivityConst';
import { BeautyInfo } from '../beauty/BeautyInfo';
import { GeneralMsg } from '../general/GeneralConst';
import { RoleInfo } from '../role/RoleInfo';
import { RoleMgr } from '../role/RoleMgr';
import {
    EntityData, FamilyDGConstId, ModifyPageType, TaskState,
} from './FamilyConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class FamilyModel extends BaseModel {
    public clearAll(): void {
        //
    }
    public clear(): void {
        //
    }

    /** 世家基础信息 */
    private _familyInfo: S2CFamilyInfo;
    private _allNum: number = 0;// 总世家成员
    private _onLineNum: number = 0;// 总在线世家成员
    public setFamilyInfo(data: S2CFamilyInfo): void {
        this._familyInfo = data;
        this._allNum = data.AllNum;
        this._onLineNum = data.OnlineNum;
        EventClient.I.emit(E.Family.FamilyInfo, data);
    }

    public getFamilyInfo(): S2CFamilyInfo {
        return this._familyInfo;
    }

    /** 更新世家名称 */
    public updateFamilyName(name: string): void {
        this._familyInfo.Name = name;
        EventClient.I.emit(E.Family.FamilyNameUpdate, ModifyPageType.Name);
    }

    /** 世家宣言修改成功-更新世家宣言 */
    public updateFamilyWord(word: string): void {
        this._familyInfo.Word = word;
        EventClient.I.emit(E.Family.FamilyNameUpdate, ModifyPageType.Word);
    }
    /** 世家宣言修改成功，更新宣言cd时间 */
    public updateFamilyWordTime(RenameWordTime: number): void {
        this._FamilyRoleInfo.RenameWordTime = RenameWordTime;
        EventClient.I.emit(E.Family.FamilyNameUpdate, ModifyPageType.Word);
    }

    /** ---------世家成员--------- */
    // 成员列表
    private _familyMemberList: FamilyMember[];
    public setMemberList(data: S2CFamilyMemberList): void {
        this._familyMemberList = data.FamilyMemberList;
        EventClient.I.emit(E.Family.FamilyMemberList, data);
    }
    // 获取世家成员列表
    public getMemberList(): FamilyMember[] {
        if (this._familyMemberList && this._familyMemberList.length) {
            this._familyMemberList.sort((l, r) => {
                if (r.Position !== l.Position) {
                    return l.Position - r.Position;
                } else {
                    return r.FightValue - l.FightValue;
                }
            });
        }

        return this._familyMemberList;
    }
    // 获取在线成员数量
    public getOnlineMember(): number {
        return this._onLineNum;
    }
    public getAllNum(): number {
        return this._allNum;
    }

    // 初始模型信息
    private _modelData: S2CFamilyTopPlayerData;
    public initModelInfo(data: S2CFamilyTopPlayerData): void {
        this._modelData = data;
        EventClient.I.emit(E.Family.FamilyHomeHeroData, data);
    }

    public getModelData(): S2CFamilyTopPlayerData {
        return this._modelData;
    }

    /** 改名cd 奖励俸禄等领取情况 */
    private _FamilyRoleInfo: S2CFamilyRoleInfo;
    public initFamilyRoleInfo(data: S2CFamilyRoleInfo): void {
        this._FamilyRoleInfo = data;
        EventClient.I.emit(E.Family.FamilyRoleInfo, data);
        // int32 DailySalary = 1; //每日俸禄
        // int32 Worship = 2; //每日膜拜次数
        // int32 Position = 3; //世家职位
        // int32 renameNum = 4; //族长改名次数
        // int64 renameTime = 5; //族长改名时间戳
        // data.RenameWordTime
    }

    // 修改昵称成功，更新世家改名次数 时间
    public updateReNameInfo(n: number, t: number): void {
        this._FamilyRoleInfo.RenameNum = n;
        this._FamilyRoleInfo.RenameTime = t;
    }
    // 修改宣言成功，更新宣言信息
    public updateWordInfo(n: number, t: number): void {
        this._FamilyRoleInfo.RenameNum = n;
        this._FamilyRoleInfo.RenameTime = t;
    }

    public getFamilyRoleInfo(): S2CFamilyRoleInfo {
        return this._FamilyRoleInfo;
    }

    /** 根据世家职位表 */
    public getPosNameById(pos: number): string {
        const indexer = Config.Get(ConfigConst.Cfg_FamilyPos);
        const cfg: Cfg_FamilyPos = indexer.getValueByKey(pos);
        return cfg.PosName;
    }

    /** 获取世家职位的品质颜色 */
    public getPosQuality(pos: number): number {
        const indexer = Config.Get(ConfigConst.Cfg_FamilyPos);
        return indexer.getValueByKey(pos, 'Star');
    }

    // 更新膜拜次数
    public updateFamilyWorship(num: number): void {
        this._FamilyRoleInfo.Worship = num;
        EventClient.I.emit(E.Family.FamilyWorship, data);
    }
    // 更新俸禄是否领取
    public updateDailySalary(dailySalary: number): void {
        this._FamilyRoleInfo.DailySalary = dailySalary;
        EventClient.I.emit(E.Family.FamilySalary, data);
    }
    /** ------------族长争夺----------------------*/
    private _familyPatriInfo: S2CFamilyPatriInfo;
    public initFamilyPatriInfo(data: S2CFamilyPatriInfo): void {
        this._familyPatriInfo = data;
        EventClient.I.emit(E.Family.FamilyPatriInfo, data);
    }
    // 测试代码
    public updateFamilyPatriInfo(): void {
        this._familyPatriInfo.ActId = 102;
    }

    /** 族长争夺基础信息 */
    public getFamilyPatriInfo(): S2CFamilyPatriInfo {
        return this._familyPatriInfo;
    }

    /** 活动结束，需要清除活动信息 倒计时用nextOpenTime && lastEndTime */
    public clearFamilyActInfo(): void {
        this._familyPatriInfo.ActId = 0;
        this._familyPatriInfo.StartTime = 0;
        this._familyPatriInfo.EndTime = 0;
    }

    private _myRankInfo: S2CFamilyPatriGetMyRank;
    public initMyRankInfo(data: S2CFamilyPatriGetMyRank): void {
        this._myRankInfo = data;
        EventClient.I.emit(E.Family.FamilyGetMyRank, data);
    }
    public getMyRankInfo(): S2CFamilyPatriGetMyRank {
        return this._myRankInfo;
    }

    /** 族长争夺-二阶段基础信息 */
    private _familyPatriLeaderInfo: S2CFamilyPatriLeaderInfo;
    public initFamilyPatriLeaderInfo(data: S2CFamilyPatriLeaderInfo): void {
        this._familyPatriLeaderInfo = data;
        EventClient.I.emit(E.Family.FamilyPatriLeaderInfo, data);
    }

    public getFamilyPatriLeaderInfo(): S2CFamilyPatriLeaderInfo {
        return this._familyPatriLeaderInfo;
    }

    /** 有族长 或者候选人,则代表族长争夺赛开始 */
    /** 否则就是 候选人争夺赛 */
    public isBossFight(): boolean {
        // 族长或者候选人，只要有一个，则代表族长争夺赛开始
        const info: S2CFamilyPatriLeaderInfo = this.getFamilyPatriLeaderInfo();
        if (!(info?.CandidateShowInfo?.length || info?.LeaderShowInfo?.length)) {
            return true;
        }
        return false;
    }

    /** 判断自己是否是候选人 */
    public isSelectPeople(): boolean {
        const userId: number = RoleMgr.I.d.UserId;//
        const info: S2CFamilyPatriLeaderInfo = this.getFamilyPatriLeaderInfo();
        if (info?.CandidateShowInfo?.length) { // 有候选人
            if (info.CandidateShowInfo[0].UserId === userId) { // 候选人===自己
                return true;
            }
        }
        return false;
    }

    /** 判断自己是否是族长 是族长会连任 */
    public isSelfIsChif(): boolean {
        const modelData: S2CFamilyTopPlayerData = this.getModelData();// 族长
        const info: S2CFamilyPatriLeaderInfo = this.getFamilyPatriLeaderInfo();// 候选人
        if (info?.CandidateShowInfo?.length && modelData?.UserShowInfo?.length) { // 有候选人
            // const roleInfoNow = new RoleInfo(modelData.UserShowInfo[0]);
            // const roleInfo = new RoleInfo(info.CandidateShowInfo[0]);
            if (info.CandidateShowInfo[0].UserId === modelData.UserShowInfo[0].UserId) { // 候选人===自己
                return true;
            }
        }
        return false;
    }

    /** 是否可以共鸣 */
    public isCanResonance(): boolean {
        const lv = this.getResonateLev();
        const bol = this.checkResonateCondition(lv + 1);
        return bol;
    }

    //
    /** -------事务列表 & 刷新次数--------- */
    // 事务基本信息
    private _familyTaskInfo: S2CFamilyTaskInfo;
    private _UserPartnerId: string[];// 派遣中的伙伴
    private _startNum = 0;// 今日事务令使用次数
    public FamilyTaskInfo(data: S2CFamilyTaskInfo): void {
        this._familyTaskInfo = data;
        this._familyTaskList = data.FamilyTaskList;
        this.updateUserPartnerId(data.UsePartnerId);
        this._startNum = data.StartNum;// 解除注释 事务令使用个数
        this.resetPartnerList();
        EventClient.I.emit(E.Family.FamilyTaks, data);
        // 事务列表：FamilyTaskList: Array<FamilyTask>;
        // 刷新次数：RefreshNum: number;
        // 派遣伙伴ID:UsePartnerId: Array<string>;
        // 设置协助伙伴ID:HelpPartnerList: Array<SetPartner>;
        // 设置协助CD:SetPartnerToHelpTime: number;
        // 协助奖励次数：HelpNum: number;
        // 今日事务令使用次数：StartNum: number;
        // 初始化协助伙伴列表
    }

    public getDropItemInfo(taskId: number): ItemInfo[] {
        for (let i = 0; i < this._familyTaskList.length; i++) {
            if (this._familyTaskList[i].TaskId === taskId) {
                return this._familyTaskList[i].DropItem;
            }
        }
        return null;
    }

    /** 协助伙伴列表 */
    public updateUserPartnerId(partnerIds: string[]): void {
        this._UserPartnerId = partnerIds;
    }
    // 获取事务列表
    public getTaskList(): { item: FamilyTask, state: number }[] {
        const arr: { item: FamilyTask, state: number }[] = [];
        for (let i = 0, len = this._familyTaskList.length; i < len; i++) {
            const taskItem: FamilyTask = this._familyTaskList[i];
            // state
            let state = -1;
            // 领取状态>派遣状态>加速状态>
            if (taskItem.TaskState === TaskState.notBegin) {
                state = 1;
            } else if (taskItem.TaskState === TaskState.doing) {
                state = 0;
            } else {
                state = 2;
            }
            arr.push({ item: taskItem, state });
        }

        arr.sort((l, r) => {
            if (l.state !== r.state) {
                return r.state - l.state;
            }
            if (l.item.Quality !== r.item.Quality) {
                return r.item.Quality - l.item.Quality;
            }
            return r.item.TaskId - l.item.TaskId;
        });
        return arr;
    }

    public updateTaskList(familyTask: FamilyTask): void {
        if (this._familyTaskList && this._familyTaskList.length) {
            for (let i = 0, len = this._familyTaskList.length; i < len; i++) {
                if (this._familyTaskList[i].TaskId === familyTask.TaskId) {
                    this._familyTaskList[i] = familyTask;
                    break;
                }
            }
        }
    }

    /** 加速CD成功 */
    public updateTaskState(taskId: number, state: TaskState): void {
        for (let i = 0, len = this._familyTaskList.length; i < len; i++) {
            if (this._familyTaskList[i].TaskId === taskId) { // 更新当前某个任务的奖励状态
                this._familyTaskList[i].TaskState = state;// 领取奖励
                break;
            }
        }
    }

    /** 一键派遣成功 更新数据 */
    public FamilyTaskStartOneKey(data: S2CFamilyTaskStartOneKey): void {
        // console.log(data);
        // 任务列表变了 刷新事务列表 这里派遣状态也发生改变了
        this._familyTaskList = data.FamilyTaskList;
        // 派遣出去的伙伴变了
        this.updateUserPartnerId(data.UsePartnerId);

        // 删除当前可派遣列表 更新一键派遣列表
        const successList: number[] = data.TaskIdL;
        if (successList && successList.length) {
            for (let i = 0, len = successList.length; i < len; i++) {
                const taskId: number = successList[i];
                this.deleteCanStartList(taskId);// 删除可派遣列表
            }
        }
        // 事务令
        this._startNum = data.StartNum;//  事务令使用个数
        EventClient.I.emit(E.Family.FamilyOneKeySuccess, data);
    }
    // 单独派遣刷新数据
    public SingleFamilyTaskStart(data: S2CFamilyTaskStart): void {
        // 单独派遣成功
        console.log(data);

        this.updateTaskList(data.FamilyTask);// 更新当前任务状态
        this.updateUserPartnerId(data.UsePartnerId);// 更新已派遣列表
        this._startNum = data.StartNum;// 事务令使用个数
        this.deleteCanStartList(data.TaskId);// 删除一键派遣列表
        this.clearHeadDataArr();// 删除选中的头像列表
        EventClient.I.emit(E.Family.FamilySingleSendSuccess, data);
    }

    /** 检测缘分条件是否成立 */
    /** 注意：这里传入的Id是配置表里的 1002 1001 这种，也就是武将的IId 或者 红颜Id */
    /** 但是 头像列表 _headDataArr 里存放的是 红颜Id & 武将的onlyId */
    public checkFateCondition(Id: string, type: number): boolean {
        for (let i = 0; i < this._headDataArr.length; i++) {
            // 外部传入的是 武将 并且，当前头像里的也要是武将
            if (type === EntityUnitType.General && this._headDataArr[i].PartnerType === EntityUnitType.General) {
                const onlyId = this._headDataArr[i].Id;
                const otherData: HelpPartner = this.getOtherGeneralBeautyInfo(onlyId);
                if (otherData) {
                    if (Number(otherData.IId) === Number(Id)) {
                        return true;
                    }
                } else {
                    const general: GeneralMsg = ModelMgr.I.GeneralModel.generalData(onlyId);
                    if (Number(general.generalData.IId) === Number(Id)) {
                        return true;
                    }
                }
            } else if (type === EntityUnitType.Beauty && this._headDataArr[i].PartnerType === EntityUnitType.Beauty) { // 红颜只需要对比Id
                if (this._headDataArr[i].Id === Id) {
                    return true;
                }
            }
            // 军师
            // 待开发
            // 待开发
            // 待开发
            // 待开发
            // 待开发
        }
        return false;
    }

    // 是否在已选列表
    private inHeadDataArr(Id: string): boolean {
        if (this._headDataArr && this._headDataArr.length) {
            for (let i = 0; i < this._headDataArr.length; i++) {
                if (this._headDataArr[i].Id === Id) {
                    return true;// 已经被当前列表选中了
                }
            }
        }
        return false;
    }

    // 未达到需要数量
    private _checkNeedNum(): boolean {
        if (this._headDataArr && this._headDataArr.length) {
            // 数量超出
            if (this._headDataArr.length >= this._needNum) {
                return false;
            }
        }
        return true;
    }

    // 所有列表检测是否有符合缘分条件
    private _checkAllDataFateCondition(Id: string): boolean {
        // 武将开始
        const allGen: EntityData[] = this.getGeneralAllData();
        for (let i = allGen.length - 1; i > 0; i--) {
            // 1 符合红颜 Id
            // 2 不在已选列表
            // 3 不在已派遣列表
            // 4 当前派遣数量小于需要的数量
            const eData: EntityData = allGen[i];// 所有的武将
            if (eData.IId === Number(Id)
                && !this.inHeadDataArr(eData.StrId)
                && !this.getIsInSender(Id)
                && this._checkNeedNum()
            ) {
                if (!eData.self) { // 不是自己
                    // 其他伙伴只能选一个,其他伙伴还未选过
                    if (!this._isSelectOther) {
                        const set: SetPartner = {
                            Id: eData.StrId,
                            PartnerType: eData.PartnerType,
                        };
                        this.addHeadItemArr(set);
                        this._isSelectOther = true;
                        return true;
                    }
                } else { // 是自己
                    const set: SetPartner = {
                        Id: eData.StrId,
                        PartnerType: eData.PartnerType,
                    };
                    this.addHeadItemArr(set);
                    return true;
                }
            }
        }
        // 红颜
        const allBeauty: EntityData[] = this.getBeautyAllData();
        for (let i = allBeauty.length - 1; i > 0; i--) {
            // 1 符合红颜 Id
            // 2 不在已选列表
            // 3 不在已派遣列表
            // 4 当前派遣数量小于需要的数量
            const eData: EntityData = allBeauty[i];
            if (eData.StrId === Id
                && !this.inHeadDataArr(Id)
                && !this.getIsInSender(Id)
                && this._checkNeedNum()
            ) {
                if (!eData.self) { // 不是自己
                    // 其他伙伴只能选一个,其他伙伴还未选过
                    if (!this._isSelectOther) {
                        const set: SetPartner = {
                            Id,
                            PartnerType: eData.PartnerType,
                        };
                        this.addHeadItemArr(set);
                        this._isSelectOther = true;

                        return true;
                    }
                } else {
                    const set: SetPartner = {
                        Id,
                        PartnerType: eData.PartnerType,
                    };
                    this.addHeadItemArr(set);

                    return true;
                }
            }
        }
        // 军师
        // 待开发
        // 待开发
        // 待开发
        // 待开发
        return false;
    }

    // 某个武将是否满足这条条件
    public checkAllDataCondition(cfgTc: Cfg_TaskCondition, eData: EntityData): boolean {
        const partnerId: string = eData.StrId;// 伙伴id
        const type: number = eData.PartnerType;// 伙伴类型 武将 军师 红颜
        // 配置需求
        const c = cfgTc.Camp;// 判断阵营
        const r = cfgTc.Rarity;// 稀有度
        const t = cfgTc.Title;// 头衔
        const q = cfgTc.Quality;// 品质

        if (this.getOtherGeneralBeautyInfo(partnerId)) { // 是他人
            const helper: HelpPartner = this.getOtherGeneralBeautyInfo(partnerId);
            const hc = helper['Camp'];// 红颜不一定有这些信息
            const hr = helper['Rarity'];
            const ht = helper['Title'];
            const hq = helper.Quality;
            // 判断阵营
            if (c && c !== hc) { return false; }
            // 判断稀有度
            if (r && r > hr) { return false; }
            // 判断头衔
            if (t && t > ht) { return false; }
            // 判断品质
            if (q && q > hq) { return false; }
            return true;
        } else { // 自己
            // 武将 红颜 军师是
            if (type === cfgTc.PartnerType && type === EntityUnitType.General) { // 武将
                const gm: GeneralMsg = ModelMgr.I.GeneralModel.generalData(partnerId);
                const gc = gm.cfg.Camp;
                const gr = gm.cfg.Rarity;
                const gt = gm.generalData.Title;
                const gq = gm.cfg.Quality;
                // 判断阵营
                if (c && c !== gc) { return; }
                // 判断稀有度
                if (r && r > gr) { return false; }
                // 判断头衔
                if (t && t > gt) { return false; }
                // 判断品质
                if (q && q > gq) { return false; }
                return true;
            } else if (type === cfgTc.PartnerType && type === EntityUnitType.Beauty) { // 红颜
                const beautyInfo: BeautyInfo = ModelMgr.I.BeautyModel.getBeauty(Number(partnerId));
                const cfgBeauty = beautyInfo.cfg.getValueByKey(beautyInfo.BeautyId, { Quality: 0, AnimId: 0, Name: '' });
                const bc = -1;// 红颜没有阵营
                const br = -1;// 不必对稀有度
                const bt = -1;// 不必对头衔
                const bq = cfgBeauty.Quality;// 不必对稀有度
                // 判断品质
                if (q && q > bq) { return false; }
                return true;
            }
            // else if (type === cfgTc.PartnerType && type === EntityUnitType.General) {
            // if (this.isInSendHelpPartnerList(partnerId)) { // 是他人
            //     //
            // 待开发
            // 待开发
            // 待开发
            // 待开发
            // } else { // 自己
            // }
            // }
            // 符合条件
        }
        return false;
    }

    /** 自动选择武将红颜 */
    private _needNum: number;
    private _isSelectOther: boolean = false;// 是否已经选了其他协助伙伴，其他协助伙伴只能1个
    public setAutoSelect(familyTask: FamilyTask): void {
        // 总共需要多少个
        this._isSelectOther = false;
        const quality: number = familyTask.Quality;
        const needNum: number = this.getCfgNeedNumByQuality(quality);
        this._needNum = needNum;

        // 缘分条件
        const fateId: number = familyTask.TaskFateId;// 缘分ID
        if (fateId) {
            const cfgTaskFateCondition: Cfg_TaskFateCondition = this.CfgTaskFateCondition(fateId);
            const partnerNum: number = cfgTaskFateCondition.PartnerNum;// 缘分数量
            const partnerIds = cfgTaskFateCondition.PartnerIds.split('|');
            for (let i = 0; i < partnerNum; i++) {
                this._checkAllDataFateCondition(partnerIds[i]);
            }
        }

        // 普通条件
        const conditionIds: number[] = familyTask.TaskConditionIds;
        for (let i = 0, len = conditionIds.length; i < len; i++) {
            const cid: number = conditionIds[i];
            const cfgTaskCondition: Cfg_TaskCondition = this.CfgTaskCondition(cid);

            // 武将 里满足这些条件的先判断
            const allGen: EntityData[] = this.getGeneralAllData();
            const cfgNum = cfgTaskCondition.PartnerNum;// 一共需要上阵这样的伙伴有几个
            for (let i = 0; i < cfgNum; i++) { // 可能需要多个相同武将
                for (let i = allGen.length - 1; i > 0; i--) {
                    const eData: EntityData = allGen[i];
                    // 相同武将要多个
                    const bol: boolean = this.checkAllDataCondition(cfgTaskCondition, eData);// 某个武将是否满足这条条件
                    // 1不在已选列表
                    // 2 不在已派遣列表
                    // 3 当前派遣数量小于需要的数量
                    const Id = eData.StrId;
                    if (bol
                        && !this.inHeadDataArr(Id)
                        && !this.getIsInSender(Id)
                        && this._checkNeedNum()
                    ) {
                        if (!eData.self) { // 不是自己
                            // 其他伙伴只能选一个,其他伙伴还未选过
                            if (!this._isSelectOther) {
                                const set: SetPartner = {
                                    Id,
                                    PartnerType: eData.PartnerType,
                                };
                                this.addHeadItemArr(set);
                                this._isSelectOther = true;
                                break;// 找到了条件达成
                            }
                        } else {
                            const set: SetPartner = {
                                Id,
                                PartnerType: eData.PartnerType,
                            };
                            this.addHeadItemArr(set);
                            break;// 找到了条件达成
                        }
                    }
                }
            }
            // 红颜
            // 武将 里满足这些条件的先判断
            const allBeauty: EntityData[] = this.getBeautyAllData();
            for (let i = allBeauty.length - 1; i > 0; i--) {
                const eData: EntityData = allBeauty[i];
                // 相同武将要多个
                const cfgNum = cfgTaskCondition.PartnerNum;// 一共需要上阵这样的伙伴有几个
                for (let i = 0; i < cfgNum; i++) { // 可能需要多个相同武将
                    const bol: boolean = this.checkAllDataCondition(cfgTaskCondition, eData);// 某个武将是否满足这条条件
                    // 1不在已选列表
                    // 2 不在已派遣列表
                    // 3 当前派遣数量小于需要的数量
                    const Id = eData.StrId;
                    if (bol
                        && !this.inHeadDataArr(Id)
                        && !this.getIsInSender(Id)
                        && this._checkNeedNum()
                    ) {
                        if (!eData.self) { // 不是自己
                            // 其他伙伴只能选一个,其他伙伴还未选过
                            if (!this._isSelectOther) {
                                const set: SetPartner = {
                                    Id,
                                    PartnerType: eData.PartnerType,
                                };
                                this.addHeadItemArr(set);
                                this._isSelectOther = true;
                            }
                        } else {
                            const set: SetPartner = {
                                Id,
                                PartnerType: eData.PartnerType,
                            };
                            this.addHeadItemArr(set);
                        }
                    }
                }
            }
            // 军师
            // 待开发
            // 待开发
            // 待开发
            // 待开发
            // 待开发
        }

        // 条件都满足的情况下。// 人员还不够
        if (this._headDataArr.length < needNum) {
            // 武将 里满足这些条件的先判断
            const allGen: EntityData[] = this.getGeneralAllData();
            for (let i = allGen.length - 1; i > 0; i--) {
                const eData: EntityData = allGen[i];
                const Id = eData.StrId;
                if (!this.inHeadDataArr(Id)
                    && !this.getIsInSender(Id)
                    && this._checkNeedNum()
                ) {
                    if (!eData.self) { // 不是自己
                        // 其他伙伴只能选一个,其他伙伴还未选过
                        if (!this._isSelectOther) {
                            const set: SetPartner = {
                                Id,
                                PartnerType: eData.PartnerType,
                            };
                            this.addHeadItemArr(set);
                            this._isSelectOther = true;
                        }
                    } else {
                        const set: SetPartner = {
                            Id,
                            PartnerType: eData.PartnerType,
                        };
                        this.addHeadItemArr(set);
                    }
                }
            }
            // 红颜
            const allBeauty: EntityData[] = this.getBeautyAllData();
            for (let i = allBeauty.length - 1; i > 0; i--) {
                const eData: EntityData = allBeauty[i];
                const Id = eData.StrId;
                if (!this.inHeadDataArr(Id)
                    && !this.getIsInSender(Id)
                    && this._checkNeedNum()
                ) {
                    if (!eData.self) { // 不是自己
                        // 其他伙伴只能选一个,其他伙伴还未选过
                        if (!this._isSelectOther) {
                            const set: SetPartner = {
                                Id,
                                PartnerType: eData.PartnerType,
                            };
                            this.addHeadItemArr(set);
                            this._isSelectOther = true;
                        }
                    } else {
                        const set: SetPartner = {
                            Id,
                            PartnerType: eData.PartnerType,
                        };
                        this.addHeadItemArr(set);
                    }
                }
            }

            // 军师
        }
    }

    // 单独派遣条件判断
    //  | cfgTaskFateCondition
    public checkSelectCondition(cfgTc: any): boolean {
        let num: number = 0;// 满足数量需要
        const cfgNum = cfgTc.PartnerNum;// 一共需要上阵这样的伙伴有几个
        let pass: boolean = false;
        // 当前选中头像的，是否满足条件
        for (let i = 0; i < this._headDataArr.length; i++) {
            const item: SetPartner = this._headDataArr[i];
            const partnerId: string = item.Id;// 伙伴id
            const type: number = item.PartnerType;// 伙伴类型 武将 军师 红颜

            const c = cfgTc.Camp;// 判断阵营
            const r = cfgTc.Rarity;// 稀有度
            const t = cfgTc.Title;// 头衔
            const q = cfgTc.Quality;// 品质

            if (this.getOtherGeneralBeautyInfo(partnerId)) { // 是他人
                const helper: HelpPartner = this.getOtherGeneralBeautyInfo(partnerId);
                if (cfgTc.PartnerType === helper.PartnerType) {
                    const hc = helper['Camp'];// 红颜不一定有这些信息
                    const hr = helper['Rarity'];
                    const ht = helper['Title'];
                    const hq = helper.Quality;
                    // 判断阵营
                    if (c && c !== hc) { continue; }
                    // 判断稀有度
                    if (r && r > hr) { continue; }
                    // 判断头衔
                    if (t && t > ht) { continue; }
                    // 判断品质
                    if (q && q > hq) { continue; }
                    pass = true;
                }
            } else { // 自己
                // 武将 红颜 军师是
                if (type === cfgTc.PartnerType && type === EntityUnitType.General) { // 武将
                    const gm: GeneralMsg = ModelMgr.I.GeneralModel.generalData(partnerId);
                    const gc = gm.cfg.Camp;
                    const gr = gm.cfg.Rarity;
                    const gt = gm.generalData.Title;
                    const gq = gm.cfg.Quality;
                    // 判断阵营
                    if (c && c !== gc) { continue; }
                    // 判断稀有度
                    if (r && r > gr) { continue; }
                    // 判断头衔
                    if (t && t > gt) { continue; }
                    // 判断品质
                    if (q && q > gq) { continue; }
                    pass = true;
                } else if (type === cfgTc.PartnerType && type === EntityUnitType.Beauty) { // 红颜
                    const beautyInfo: BeautyInfo = ModelMgr.I.BeautyModel.getBeauty(Number(partnerId));
                    const cfgBeauty = beautyInfo.cfg.getValueByKey(beautyInfo.BeautyId, { Quality: 0, AnimId: 0, Name: '' });
                    const bc = -1;// 红颜没有阵营
                    const br = -1;// 不必对稀有度
                    const bt = -1;// 不必对头衔
                    const bq = cfgBeauty.Quality;// 不必对稀有度
                    // 判断品质
                    if (q && q > bq) { continue; }
                    pass = true;
                }
                // else if (type === cfgTc.PartnerType && type === EntityUnitType.General) {
                // if (this.isInSendHelpPartnerList(partnerId)) { // 是他人
                //     //
                // 待开发
                // 待开发
                // 待开发
                // 待开发
                // } else { // 自己
                // }
                // }
                // 符合条件
            }
            num++;
        }
        // 有符合并且数量达标
        if (pass && num >= cfgNum) {
            return true;
        }
        return false;
    }

    // 刷新事务列表成功
    private _familyTaskList: FamilyTask[];
    public refreshTask(data: S2CFamilyTaskRefresh): void {
        this._familyTaskList = data.FamilyTaskList;// 更新事务列表
        this._familyTaskInfo.RefreshNum = data.RefreshNum;// 更新刷新次数
        EventClient.I.emit(E.Family.FamilyRefreshTask, data);
    }
    // 事务刷新次数
    public getCurRefreshNum(): number {
        return this._familyTaskInfo.RefreshNum || 0;
    }

    /** 获取某一条任务的具体信息 */
    public getFamilyTask(taskId: number): FamilyTask {
        for (let i = 0, len = this._familyTaskList.length; i < len; i++) {
            if (taskId === this._familyTaskList[i].TaskId) {
                return this._familyTaskList[i];
            }
        }
        return null;
    }
    // 删除已领取的任务
    public deleteFamilyTaskListItem(taskId: number): void {
        for (let i = 0; i < this._familyTaskList.length; i++) {
            if (taskId === this._familyTaskList[i].TaskId) {
                // 删除已领取的任务
                this._familyTaskList.splice(i, 1);
            }
        }
    }

    /** 获取当前已经使用事务令数量 */
    public getCurItemCost(): number {
        return this._startNum;
    }

    /** ---------一键派遣--------- */
    // 初始一键派遣列表
    private _canStartList: CanStartTask[];
    public initFamilyOneKeyList(data: S2CFamilyTaskGetAllCanStart): void {
        this._canStartList = [];
        this._canStartList = data.CanStartTaskL;
        EventClient.I.emit(E.Family.FamilyCanStartList, data);
    }
    // 获取可派遣列表
    public getCanStarList(): CanStartTask[] {
        return this._canStartList;
    }

    /** 获取某一条可派遣列表 */
    public getCanStarListItem(taskId: number): CanStartTask {
        if (this._canStartList && this._canStartList.length) {
            for (let i = 0; i < this._canStartList.length; i++) {
                const item: CanStartTask = this._canStartList[i];
                if (item.TaskId === taskId) {
                    return item;
                }
            }
        }
        return null;
    }

    /** 删除列表 */
    public deleteCanStartList(taskId: number): void {
        if (this._canStartList && this._canStartList.length) {
            for (let i = 0; i < this._canStartList.length; i++) {
                const item: CanStartTask = this._canStartList[i];
                if (item.TaskId === taskId) {
                    this._canStartList.splice(i, 1);
                }
            }
        }
    }

    /** 临时头像列表 */
    private _headDataArr: SetPartner[];
    public initHeadTempArr(taskId: number): SetPartner[] {
        this._headDataArr = [];
        const canStartTask = this.getCanStarListItem(taskId);
        for (let i = 0; i < canStartTask.SetPartnerL.length; i++) {
            this._headDataArr.push(canStartTask.SetPartnerL[i]);
        }
        // console.log(this._headDataArr);
        return this._headDataArr;
    }
    public clearHeadDataArr(): void {
        this._headDataArr = [];
    }
    public getHeadDataArr(): SetPartner[] {
        return this._headDataArr;
    }

    /** 目前已经选中几个头像 */
    public getgetHeadTempArrLen(): number {
        if (this._headDataArr) {
            return this._headDataArr.length;
        }
        return 0;
    }

    // 删除某个头像
    public deleteHeadItemById(Id: string): void {
        if (this._headDataArr && this._headDataArr.length) {
            for (let i = 0; i < this._headDataArr.length; i++) {
                if (this._headDataArr[i].Id === Id) {
                    this._headDataArr.splice(i, 1);
                }
            }
        }
    }

    public addHeadItemArr(partner: SetPartner): void {
        if (!this._headDataArr) {
            this._headDataArr = [];
        }
        this._headDataArr.push(partner);
    }

    /** 是否在选中的头像中 */
    /** 在则需要勾选 */
    public isCheckInHeadArr(StrId: string): boolean {
        if (this._headDataArr && this._headDataArr.length) {
            for (let i = 0; i < this._headDataArr.length; i++) {
                if (this._headDataArr[i].Id === StrId) { // 唯一ID beautyId && 武将onlyId
                    return true;
                }
            }
        }
        return false;
    }

    /** 判断是否头像里已经有其他人 */
    public hasOtherHeadArrHelper(): boolean {
        if (this._headDataArr && this._headDataArr.length) {
            for (let i = 0; i < this._headDataArr.length; i++) {
                if (this.getOtherGeneralBeautyInfo(this._headDataArr[i].Id)) {
                    return true;
                }
            }
        }
        return false;
    }

    /** 是否在派遣列表 */
    public getIsInSender(id: string): number {
        const isUsed: number = 0;
        if (this._UserPartnerId && this._UserPartnerId.length) {
            for (let i = 0; i < this._UserPartnerId.length; i++) {
                if (this._UserPartnerId[i] === id) {
                    return 1;
                }
            }
        }
        return isUsed;
    }

    /** 获取武将信息 */
    public getGeneralInfo(data: EntityData): GeneralMsg {
        const _data: GeneralMsg = ModelMgr.I.GeneralModel.generalData(data.StrId);
        return _data;
    }

    /**
     * 获取协助列表里的武将红颜军师信息
     * StrId ：自己的武将onlyId 他人的武将id  红颜id 军师id
     */
    public getOtherGeneralBeautyInfo(StrId: string): HelpPartner {
        if (this._sendHelpPartnerList && this._sendHelpPartnerList.length) {
            for (let i = 0, len = this._sendHelpPartnerList.length; i < len; i++) {
                if (this._sendHelpPartnerList[i].Id === StrId) {
                    return this._sendHelpPartnerList[i];
                }
            }
        }
        return null;
    }

    private _finallAllGeneral: EntityData[];// 武将数据
    private _finallAllBeauTy: EntityData[];// 红颜数据
    // private _finallAllBeauTy: EntityData[];// 军师数据

    public getGeneralAllData(): EntityData[] { // 自己的武将
        this._finallAllGeneral = [];
        const generalData: GeneralMsg[] = ModelMgr.I.GeneralModel.getGeneralListByRarity(0);
        for (let i = 0; i < generalData.length; i++) {
            const data: GeneralMsg = generalData[i];

            const inSender: number = this.getIsInSender(data.generalData.OnlyId);
            const obj: EntityData = {
                IId: data.generalData.IId, // 用来排序 这个值等于 武将里的IId  等于红颜BeautyId
                self: 1, // 自己还是他人做个排序
                PartnerType: EntityUnitType.General, // 武将军师还是红颜
                Qaulity: data.generalData.Quality, // 品质
                StrId: data.generalData.OnlyId, // 唯一id
                inSender,
            };
            this._finallAllGeneral.push(obj);
        }

        // 别人的武将列表
        for (let i = 0; i < this._sendHelpPartnerList.length; i++) {
            const data = this._sendHelpPartnerList[i];
            if (data.PartnerType === EntityUnitType.General) {
                const inSender: number = this.getIsInSender(data.Id);
                const obj: EntityData = {
                    IId: data.IId, // 用来排序 这个值等于 武将里的IId  等于红颜BeautyId
                    self: 0, // 自己还是他人做个排序
                    PartnerType: EntityUnitType.General, // 武将军师还是红颜
                    Qaulity: data.Quality, // 品质
                    StrId: data.Id, // 唯一id
                    inSender, // 已派遣未派遣
                };
                this._finallAllGeneral.push(obj);
            }
        }

        this.sortFinalAllData();
        // eslint-disable-next-line array-callback-return
        this._finallAllGeneral.sort((l, r) => {
            // 1 已派遣 未派遣
            // 2 品质
            // 3 Id大小
            // 4 自己优先于别人
            if (l.inSender !== r.inSender) {
                return l.inSender - r.inSender;
            }
            if (l.Qaulity !== r.Qaulity) {
                return r.Qaulity - l.Qaulity;
            }
            if (l.IId !== r.IId) {
                return r.IId - l.IId;
            }
            return r.self - l.self;
        });

        return this._finallAllGeneral;
    }

    // 待军师功能完成后，统一做处理
    private sortFinalAllData(): void {
        // 装备背包中，按装备的基础战力 由大→小排序 （基础战力=基础属性+附加属性）
        // if (a.fightValue !== b.fightValue) {
        //     return b.fightValue - a.fightValue;
        // }

        // // 战力相同时，按装备的品质大小 由大→小排序 （品质大小为： 红→橙→紫→蓝→绿）
        // if (a.cfg.Quality !== b.cfg.Quality) {
        //     return b.cfg.Quality - a.cfg.Quality;
        // }

        // // 品质相同时，按装备的军衔等级大小 由大→小排序
        // if (a.cfg.ArmyLevel === b.cfg.ArmyLevel) {
        //     return b.cfg.ArmyLevel - a.cfg.ArmyLevel;
        // }

        // // 军衔相同时，由军衔星级大小 由大→小排序
        // if (a.cfg.Star === b.cfg.Star) {
        //     return b.cfg.Star - a.cfg.Star;
        // }
        // // 星级相同时，按装备部位ID 由小→大排序 1→2→···→···8
        // return a.cfg.EquipPart - b.cfg.EquipPart;

    }

    /** 获取红颜信息 */
    public getBeautyData(beautyId: number): BeautyInfo {
        return ModelMgr.I.BeautyModel.getBeauty(Number(beautyId));
    }

    /** 获取其他人的红颜信息 */
    public getHelperBeautyInfo(strId: string): HelpPartner {
        for (let i = 0, len = this._sendHelpPartnerList.length; i < len; i++) {
            if (this._sendHelpPartnerList[i].Id === strId) {
                return this._sendHelpPartnerList[i];
            }
        }
        return null;
    }

    public getBeautyAllData(): EntityData[] {
        this._finallAllBeauTy = [];
        const beauTyData: BeautyInfo[] = ModelMgr.I.BeautyModel.getSortActiveBeautys();

        for (let i = 0; i < beauTyData.length; i++) {
            const data: BeautyInfo = beauTyData[i];
            const cfgBeauty = data.cfg.getValueByKey(data.BeautyId, { Quality: 0, AnimId: 0, Name: '' });
            const inSender: number = this.getIsInSender(`${data.BeautyId}`);
            const obj: EntityData = {
                IId: data.BeautyId, // 用来排序 这个值等于 武将里的IId  等于红颜BeautyId
                self: 1, // 自己还是他人做个排序
                PartnerType: EntityUnitType.Beauty, // 武将军师还是红颜
                Qaulity: cfgBeauty.Quality, // 品质
                StrId: `${data.BeautyId}`, // 唯一id
                inSender,
            };
            this._finallAllBeauTy.push(obj);
        }

        // 别人的红颜列表
        for (let i = 0; i < this._sendHelpPartnerList.length; i++) {
            const data = this._sendHelpPartnerList[i];
            if (data.PartnerType === EntityUnitType.Beauty) {
                const inSender: number = this.getIsInSender(`${data.Id}`);
                const obj: EntityData = {
                    IId: data.IId, // 用来排序 这个值等于 武将里的IId  等于红颜BeautyId
                    self: 0, // 自己还是他人做个排序
                    PartnerType: EntityUnitType.Beauty, // 武将军师还是红颜
                    Qaulity: data.Quality, // 品质
                    StrId: data.Id, // 唯一id
                    inSender,
                };
                this._finallAllBeauTy.push(obj);
            }
        }
        this.sortFinalAllData();
        this._finallAllBeauTy.sort((l, r) => {
            // 1 已派遣 未派遣
            // 2 品质
            // 3 Id大小
            // 4 自己优先于别人
            if (l.inSender !== r.inSender) {
                return l.inSender - r.inSender;
            }
            if (l.Qaulity !== r.Qaulity) {
                return r.Qaulity - l.Qaulity;
            }
            if (l.IId !== r.IId) {
                return r.IId - l.IId;
            }
            // if (l.self !== r.self) {
            return r.self - l.self;
            // }
        });
        return this._finallAllBeauTy;
    }

    /** -----------普通派遣-----------*/
    // 可以用来派遣的伙伴列表
    private _sendHelpPartnerList: HelpPartner[];
    public initSenderHelperPartnerL(data: S2CFamilyTaskHelpPartner): void {
        this._sendHelpPartnerList = [];
        this._sendHelpPartnerList = data.HelpPartnerL;

        EventClient.I.emit(E.Family.FamilyGetHelpPL, data);
    }
    //
    //
    /** ----------设置协助------- */
    // 初始设置协助列表
    public resetPartnerList(): void {
        this._helpPartnerList = [];
        const arr: SetPartner[] = this._familyTaskInfo.HelpPartnerList;
        if (arr.length) {
            for (let i = 0, len = arr.length; i < len; i++) {
                this._helpPartnerList.push(arr[i]);
            }
        }
    }
    // 更新设置协助CD
    public updateSetPartnerToHelp(data: S2CFamilyTaskSetPartnerToHelp): void {
        console.log(data);

        this._familyTaskInfo.SetPartnerToHelpTime = data.SetPartnerToHelpTime;
        this._familyTaskInfo.HelpPartnerList = this._helpPartnerList;
        EventClient.I.emit(E.Family.FamilySetAssist, data);
    }
    // 设置协助时间
    public getHelpTime(): number {
        const time: number = this._familyTaskInfo.SetPartnerToHelpTime;
        return time;
    }
    // 协助伙伴列表
    private _helpPartnerList: SetPartner[];// 各种操作点击 都针对这个list进行删除增加
    public getPartnerList(): SetPartner[] {
        return this._helpPartnerList;
    }
    // 武将 军师 红颜id是否在协助列表
    public isInHelpList(id: string): boolean {
        if (!this._helpPartnerList.length) return false;
        for (let i = 0, len = this._helpPartnerList.length; i < len; i++) {
            if (this._helpPartnerList[i].Id === id) {
                return true;// 在列表
            }
        }
        return false;// 不在
    }
    // 退出清除临时设置协助列表
    public clearHelpPartnerList(): void {
        this._helpPartnerList = [];
    }
    // 删除某个协助伙伴
    public deleteHelpPartnerList(id: string): void {
        for (let i = 0, len = this._helpPartnerList.length; i < len; i++) {
            if (this._helpPartnerList[i].Id === id) {
                this._helpPartnerList.splice(i, 1);
                return;
            }
        }
    }
    // 加入协助伙伴列表
    public addHelpPartner(id: string, type: number): void {
        if (!(this._helpPartnerList && this._helpPartnerList.length)) {
            this._helpPartnerList = [];
        }
        const SetPartner: SetPartner = { Id: id, PartnerType: type };
        this._helpPartnerList.push(SetPartner);
    }
    // 获取设置协助次数
    public getSetAssistRewardNum(): number {
        const num: number = this._familyTaskInfo.HelpNum;
        return num;
    }
    // 获取设置协助CD时间
    public getSetAssistCdTime(): number {
        const time: number = this._familyTaskInfo.SetPartnerToHelpTime;
        return time;
    }

    // 伤害排行
    private familyPatriHurtRankList: Array<FamilyPatriHurtRank>;
    public initDamageList(data: Array<FamilyPatriHurtRank>): void {
        this.familyPatriHurtRankList = data;
        EventClient.I.emit(E.Family.FamilyDamageRank, data);
    }

    public getFamilyPatriHurtRankList(): Array<FamilyPatriHurtRank> {
        return this.familyPatriHurtRankList;
    }
    /** -----------------校场----------------- */

    // 校场基础信息
    private _drillGroundMap: Map<number, number> = new Map<number, number>();
    private _resonateLv: number;// 共鸣
    public initDrillGroundInfo(data: S2CGetDrillGroundInfo): void {
        for (let i = 0; i < data.DrillGroundA.length; i++) {
            this._drillGroundMap.set(data.DrillGroundA[i].Id, data.DrillGroundA[i].Lv);
        }
        this._resonateLv = data.ResonateLv;
        EventClient.I.emit(E.Family.FamilyDrillGroundInfo, data);
    }

    /** 共鸣等级 */
    public getResonateLev(): number {
        return this._resonateLv || 0;
    }
    public updateDrillGroundResonate(data: S2CDrillGroundResonateLevelUp): void {
        this._resonateLv = data.ResonateLv;
        EventClient.I.emit(E.Strength.UpRsonateSuccess, data);// 升阶成功
    }

    public updateDrillGroundMap(data: S2CDrillGroundLevelUp): void {
        this._drillGroundMap.set(data.Id, data.Lv);
        EventClient.I.emit(E.Family.FamilyDrillGroundLvUp);
    }

    public getDrillGroundMap(): Map<number, number> {
        return this._drillGroundMap;
    }

    /** 获取校场等级 */
    public getDgLvById(dgId: number): number {
        return this._drillGroundMap.get(dgId) || 1;
    }

    public idsArr = [
        FamilyDGConstId.LI,
        FamilyDGConstId.MING,
        FamilyDGConstId.ZHI,
        FamilyDGConstId.YONG,
        FamilyDGConstId.WU, FamilyDGConstId.TONG];

    /** 共鸣升阶 检测所有校场是否达到要求 */
    public checkResonateCondition(lv: number): boolean {
        // 注意不能放入最大等级
        // 根据当前等级 判断
        const limitLevel = this.getCfgDgLevelLimitByLv(lv);// 等级限制
        const bol = this.isDrillGroundLimitLvCheck(limitLevel, this.idsArr);
        return bol;
    }

    public getDrillAllFightVal(): number {
        const ids = this.idsArr;// 所有校场Id
        const attrIds: number[] = [];

        let fv: number = 0;
        for (let i = 0, len = ids.length; i < len; i++) {
            const dgId: number = ids[i];
            const items: Cfg_DrillGroundLevel[] = this.getCfgDrillGroundLevel(dgId); // 根据当前校场Id 获取 当前校场的所有列表
            const len = items.length;// 5条数据
            const level: number = this.getDgLvById(dgId);

            if (level <= len) { // 小于5级
                for (let i = 0; i < level; i++) {
                    const item = items[i];
                    const attrInfo: AttrInfo = AttrModel.MakeAttrInfo(item.AttrId);// 当前这条属性
                    fv += attrInfo.fightValue;
                    attrIds.push(item.AttrId);// 后续改动AttrDetailTips，需要将这个id数组返回。
                }
            } else { // 大于5级
                const times = Math.floor(level / len) || 1;// 几倍
                // 分两部分 1-5 的 根据倍数
                // 假如是11级,那么 倍数就是2  余数是1
                // 处理倍数以内
                for (let i = 0; i < times; i++) { // 假如是11级,那么 倍数就是2  余数是1
                    for (let j = 0; j < len; j++) { // len = 5, 那么这里就会执行两次  j的循环
                        const item = items[j];
                        const attrInfo: AttrInfo = AttrModel.MakeAttrInfo(item.AttrId);// 当前这条属性
                        attrIds.push(item.AttrId);// 后续改动AttrDetailTips，需要将这个id数组返回。
                        fv += attrInfo.fightValue;
                    }
                }
                // 处理余数
                const leftNum = level % len;// 余数
                if (leftNum) {
                    for (let j = 0; j < len; j++) { // len = 5, 那么这里就会执行两次  j的循环
                        const item = items[j];
                        if (item.Level <= leftNum) {
                            const attrInfo: AttrInfo = AttrModel.MakeAttrInfo(item.AttrId);// 当前这条属性
                            attrIds.push(item.AttrId);// 后续改动AttrDetailTips，需要将这个id数组返回。
                            fv += attrInfo.fightValue;
                        }
                    }
                }
            }
        }
        return fv;
    }

    /** 根据1级到5级 返回里面所有存在的key */
    public getDrillAllKeyMap(cfgs: Cfg_DrillGroundLevel[]): Map<number, number> {
        const attrMap: Map<number, number> = new Map<number, number>();
        for (let j = 0; j < cfgs.length; j++) {
            const cfg = cfgs[j];
            const attrInfo: AttrInfo = AttrModel.MakeAttrInfo(cfg.AttrId);// 当前这条属性

            const attrs: AttrBase[] = attrInfo.attrs;
            for (let ii = 0; ii < attrs.length; ii++) {
                const type: number = attrs[ii].attrType;// 'Attr_1'
                // let value = attrs[ii].value;// 值
                // const savedVal = attrMap.get(type);
                // if (savedVal) {
                //     value += savedVal;
                // }
                attrMap.set(type, 0);// 没有，则存入
            }
        }
        return attrMap;
    }

    /** 获取所有属性 值 */
    public getDrillAllAttrMap(ids: number[]): Map<number, number> {
        // const ids = this.idsArr;// 所有校场Id
        const attrIds: number[] = [];

        const attrMap: Map<number, number> = new Map<number, number>();
        for (let i = 0, len = ids.length; i < len; i++) {
            const dgId: number = ids[i];
            const items: Cfg_DrillGroundLevel[] = this.getCfgDrillGroundLevel(dgId); // 根据当前校场Id 获取 当前校场的所有列表
            const len = items.length;// 5条数据
            const level: number = this.getDgLvById(dgId);

            if (level <= len) { // 小于5级
                for (let i = 0; i < level; i++) {
                    const item = items[i];
                    const attrInfo: AttrInfo = AttrModel.MakeAttrInfo(item.AttrId);// 当前这条属性
                    attrIds.push(item.AttrId);// 后续改动AttrDetailTips，需要将这个id数组返回。
                    const attrs: AttrBase[] = attrInfo.attrs;
                    for (let ii = 0; ii < attrs.length; ii++) {
                        const type: number = attrs[ii].attrType;// 'Attr_1'
                        // const name = attrs[ii].name;// 名称
                        let value = attrs[ii].value;// 值
                        // const savedVal = attrMap.get(name);
                        const savedVal = attrMap.get(type);
                        if (savedVal) {
                            value += savedVal;
                        }
                        attrMap.set(type, value);// 没有，则存入
                    }
                }
            } else { // 大于5级
                const times = Math.floor(level / len) || 1;// 几倍
                // 分两部分 1-5 的 根据倍数
                // 假如是11级,那么 倍数就是2  余数是1
                // 处理倍数以内
                for (let i = 0; i < times; i++) { // 假如是11级,那么 倍数就是2  余数是1
                    for (let j = 0; j < len; j++) { // len = 5, 那么这里就会执行两次  j的循环
                        const item = items[j];
                        const attrInfo: AttrInfo = AttrModel.MakeAttrInfo(item.AttrId);// 当前这条属性
                        attrIds.push(item.AttrId);// 后续改动AttrDetailTips，需要将这个id数组返回。

                        const attrs: AttrBase[] = attrInfo.attrs;
                        for (let ii = 0; ii < attrs.length; ii++) {
                            const type: number = attrs[ii].attrType;// 'Attr_1'
                            let value = attrs[ii].value;// 值
                            const savedVal = attrMap.get(type);
                            if (savedVal) {
                                value += savedVal;
                            }
                            attrMap.set(type, value);// 没有，则存入
                        }
                    }
                }
                // 处理余数
                const leftNum = level % len;// 余数
                if (leftNum) {
                    for (let j = 0; j < len; j++) { // len = 5, 那么这里就会执行两次  j的循环
                        const item = items[j];
                        if (item.Level <= leftNum) {
                            const attrInfo: AttrInfo = AttrModel.MakeAttrInfo(item.AttrId);// 当前这条属性
                            attrIds.push(item.AttrId);// 后续改动AttrDetailTips，需要将这个id数组返回。

                            const attrs: AttrBase[] = attrInfo.attrs;
                            for (let ii = 0; ii < attrs.length; ii++) {
                                const type: number = attrs[ii].attrType;// 'Attr_1'
                                let value = attrs[ii].value;// 值
                                const savedVal = attrMap.get(type);
                                if (savedVal) {
                                    value += savedVal;
                                }
                                attrMap.set(type, value);// 没有，则存入
                            }
                        }
                    }
                }
            }
        }
        return attrMap;
    }

    /** --------------图腾-------------- */
    // private _totemList: Totem[];

    private _totemList: Map<number, Totem> = new Map<number, Totem>();

    public initTotemInfo(data: S2CTotemInfo): void {
        // 服务端返回的数据 有可能不是全量的
        if (data.TotemList?.length) {
            for (let i = 0, len = data.TotemList.length; i < len; i++) {
                const t: Totem = data.TotemList[i];
                this._totemList.set(t.Id, t);
            }
        }
        EventClient.I.emit(E.Family.FamilyTotemInfo);
    }
    /** 返回某个图腾信息 */
    public getTotemInfo(Id: number): Totem {
        const t: Totem = this._totemList.get(Id);
        return t;
    }

    /** 试炼副本-------- */
    // 试炼副本基础信息
    private _TrialCanNum: number;// 剩余挑战次数
    private _TrialBuyNum: number;// 已购买次数
    private _TrialRewardList: CommonType[];// 通关奖励的领取状态
    private _TrialRedPackList: CommonType2[];// 红包列表信息
    private _TrialHurtList: IntAttr[];
    public initTrialCopyInfo(data: S2CTrialCopyInfo): void {
        console.log('--------------');

        console.log(data);

        this._TrialBuyNum = data.BuyNum;// 剩余挑战次数
        this._TrialCanNum = data.CanNum;// 购买次数
        this._TrialRewardList = data.RewardList;// 通关奖励的领取状态
        if (!this._TrialRewardList) {
            this._TrialRewardList = [];
        }

        this._TrialHurtList = data.HurtList; // 伤害记录 用于判断是否可以扫荡

        this._TrialRedPackList = data.RedPacketList;// 红包信息A:id B:是否开启 C:金额

        EventClient.I.emit(E.Family.FamilyTrialCopyInfo, data);
    }

    /** 判断试炼副本红包是否存在未打开 */
    public hasCanOpenRedPack(): boolean {
        // 当前挑战的关卡
        const trialId: number = this.getTrialId();// 关卡
        const trialIds: number[] = this.getCfgTrialHasRedPackTrial();// 所有有红包的关卡
        for (let i = 0; i < trialIds.length; i++) {
            // console.log(trialIds);
            const tid = trialIds[i];
            if (trialId > tid) { // 当前关卡 大于等于配置表
                const isOpen: boolean = this.isOpenTrialRedPack(tid);
                if (!isOpen) {
                    return true;
                }
            }
        }
        return false;
    }

    /** 判断是否有奖励可以领取 */
    public hasCanGetReward(): boolean {
        const len = this.getCfgTrialCopyMonsterLen();
        const trialId: number = this.getTrialId();
        for (let i = 0; i < len; i++) {
            const cfg: Cfg_TrialCopyMonster = ModelMgr.I.FamilyModel.CfgTrialCopyMonsterByIndex(i);
            if (cfg.ID < trialId) { // 通关了，才能领取
                // 判断当前关卡是否被领取了
                const state: boolean = ModelMgr.I.FamilyModel.getTrialRewardState(cfg.ID);
                if (!state) {
                    return true;
                }
            }
        }
        return false;
    }

    public getCfgTrialCopyMonster(): Cfg_TrialCopyMonster[] {
        const indexer = Config.Get(ConfigConst.Cfg_TrialCopyMonster);
        const arr: Cfg_TrialCopyMonster[] = [];
        for (let i = 0; i < indexer.length; i++) {
            const cfg: Cfg_TrialCopyMonster = indexer.getValueByIndex(i);
            arr.push(cfg);
        }
        return arr;
    }

    private _TrialCopyRankList: TrialCopyRank[];
    public initTrialRankInfo(data: S2CTrialCopyRank): void {
        this._TrialCopyRankList = data.TrialCopyRankList;

        EventClient.I.emit(E.Family.FamilyTrialRankInfo);
    }

    public getTrialRankInfo(): TrialCopyRank[] {
        return this._TrialCopyRankList;
    }

    public updateTrialBuyNumCanNum(data: any, type: number = 0): void {
        if (type === 0) {
            this._TrialBuyNum = data.BuyNum;// 剩余挑战次数
            this._TrialCanNum = data.CanNum;// 购买次数
        } else {
            this._TrialCanNum = data.CanNum;// 购买次数
        }
        EventClient.I.emit(E.Family.FamilyTiralBuyNm);
    }
    // 伤害记录 用于判断是否可以扫荡
    public getTrialHurtList(): IntAttr[] {
        return this._TrialHurtList;
    }
    public deleteTrialHurtList(): void {
        this._TrialHurtList = [];
    }

    /** 红包列表 */
    public getTrialRedPackList(): CommonType2[] {
        return this._TrialRedPackList;
    }
    /** 已领取  */
    public updateTrialRedPackList(data: S2CTrialCopyRedPacket): void {
        if (!this._TrialRedPackList) {
            this._TrialRedPackList = [];
        }
        this._TrialRedPackList.push({ A: data.TrialId, B: 1, C: data.RedPacketNum });
        EventClient.I.emit(E.Family.FamilyRedPacketReward);
    }
    /** 试炼副本 通关奖励领取状态 */
    public getTrialRewardState(Id: number): boolean {
        if (this._TrialRewardList && this._TrialRewardList.length) {
            for (let i = 0, len = this._TrialRewardList.length; i < len; i++) {
                const item = this._TrialRewardList[i];
                if (Number(item.A) === Id) {
                    return !!item.B;
                }
            }
        }
        return false;
    }
    /** 试炼副本-领取通关奖励成功  更新奖励领取状态 */
    public updateFamilyTrialRewardList(trialId: number): void {
        this._TrialRewardList.push({ A: trialId, B: 1 });
        EventClient.I.emit(E.Family.FamilyTrialGetReward, trialId);
    }
    // 已经购买了几次
    public getTrialBuyNum(): number {
        return this._TrialBuyNum;
    }
    // 根据已经购买次数 获取下次购买需要什么消耗
    public getBuyCostBuyNum(times: number): number[] {
        const str = this.getCfgTrialCopyCountCost();
        const arr = str.split('|');// 时间与次数

        for (let i = 0; i < arr.length; i++) {
            const itemArr = arr[i].split(':');
            const t: number = Number(itemArr[0]);
            const itemId: number = Number(itemArr[1]);
            const itemNum: number = Number(itemArr[2]);
            if (t === times) {
                return [itemId, itemNum];
            }
        }
        const lastItem = arr[arr.length - 1];
        const lastItemArr = lastItem.split(':');

        return [Number(lastItemArr[1]), Number(lastItemArr[2])];
    }
    // 还剩余多少次可挑战
    public getTrialCanNum(): number {
        return this._TrialCanNum;
    }

    // 试炼副本-boss信息
    private _bossHp: number;// Boss当前血量
    private _trialId: number;// 当前挑战关卡
    public initTrialBossInfo(data: S2CTrialCopyBossInfo): void {
        this._bossHp = data.Hp;// 血量
        this._trialId = data.TrialId;// 当前挑战关卡
        EventClient.I.emit(E.Family.FamilyTrialBossInfo, data);
    }

    // 当前挑战关卡
    public getTrialId(): number {
        return this._trialId || 1;
    }
    // Boss当前血量
    public getBossHp(): number {
        return this._bossHp || 0;
    }

    // 试炼副本-红包
    private _RedPacketRankList: RedPacketRank[];
    public trialCopyRedPackRank(data: RedPacketRank[]): void {
        this._RedPacketRankList = data;
        EventClient.I.emit(E.Family.FamilyRedPacketRankList);
    }
    // 试炼副本-红包
    public getRedPackRankList(tid: number): RedPacketRank[] {
        const arrRank: RedPacketRank[] = [];

        if (this._RedPacketRankList?.length) {
            for (let i = 0, len = this._RedPacketRankList.length; i < len; i++) {
                const item = this._RedPacketRankList[i];
                if (item.TrialId === tid) {
                    arrRank.push(item);
                }
            }
        }
        return arrRank;
    }

    /** 判断某层关卡是否已经打开 */
    public isOpenTrialRedPack(tid: number): boolean {
        // this._TrialRedPackList = data.RedPacketList;// 红包信息A:id B:是否开启 C:金额
        if (this._TrialRedPackList?.length) {
            for (let i = 0, len = this._TrialRedPackList.length; i < len; i++) {
                const item: CommonType2 = this._TrialRedPackList[i];
                if (item.A === tid) {
                    return !!item.B;
                }
            }
        }
        return false;
    }

    /** 获取某层关卡红包领取情况数据 */
    public getTrialRedPackInfo(tid: number): CommonType2 {
        if (this._TrialRedPackList?.length) {
            for (let i = 0, len = this._TrialRedPackList.length; i < len; i++) {
                const item: CommonType2 = this._TrialRedPackList[i];
                if (item.A === tid) {
                    return item;
                }
            }
        }
        return null;
    }

    /** ------------ 配置表操作--------- */
    /** 试炼副本 */

    /** 试炼副本 排行奖励表 */
    public getCfgTrialCopyRankLen(): number {
        const indexer = Config.Get(ConfigConst.Cfg_TrialCopyRank);
        const len = indexer.length;
        return len;
    }
    /** 试炼副本 排行奖励表 */
    public getCfgTrialCopyRankByIdx(idx: number): Cfg_TrialCopyRank {
        const indexer = Config.Get(ConfigConst.Cfg_TrialCopyRank);
        return indexer.getValueByIndex(idx);
    }
    /** 获取有红包的关卡集合 */
    public getCfgTrialHasRedPackTrial(): number[] {
        const indexer = Config.Get(ConfigConst.Cfg_TrialCopyMonster);
        const len = indexer.length;

        const trialArr: number[] = [];
        for (let i = 0; i < len; i++) {
            const cfg: Cfg_TrialCopyMonster = indexer.getValueByIndex(i);
            if (cfg.RedRewardID) { // 存在红包
                trialArr.push(cfg.ID);
            }
        }
        return trialArr;
    }
    /** 获取试炼副本开始时间 */
    public getCfgTrialCopyRedSection1(): string { // 开始时间
        const str: string = this.CfgFamilyNormalItem('TrialCopyRedSection1').CfgValue;
        return str;
    }
    /** 获取试炼副本开始时间 */
    public getCfgTrialCopyCountCost(): string { // 开始时间
        const str: string = this.CfgFamilyNormalItem('TrialCopyCountCost').CfgValue;
        return str;
    }
    /** 获取试炼副本开始时间 */
    public getCfgTrialCopyST(): string { // 开始时间
        const str: string = this.CfgFamilyNormalItem('TrialCopyST').CfgValue;
        return str;
    }
    public getCfgTrialCopyET(): string { // 结束时间
        const str: string = this.CfgFamilyNormalItem('TrialCopyET').CfgValue;
        return str;
    }

    /** 获取试炼副本 通关奖励的多语言描述 */
    public getCfgTrialCopyTaskDesc(): string { // 开始时间
        const str: string = this.CfgFamilyNormalItem('TrialCopyTaskDesc').CfgValue2;
        return str;
    }

    /** 获取怪物血量   */
    public getCfgTrialBossHp(trialId: number): number {
        let tid = trialId;
        const len = this.CfgTrialCopyMonsterLen();
        if (trialId > len) {
            tid = len;
        }

        // 1 试炼副本怪物表
        const cfg: Cfg_TrialCopyMonster = this.CfgTrialCopyMonster(tid);
        const refId: number = cfg.RefreshId;

        // 2 读取刷新表
        const cfgRefresh: Cfg_Refresh = MapMgr.I.CfgRefresh(refId);// 刷新表
        // const monsterId: number = Number(cfgRefresh.MonsterIds.split('|')[0]);// 怪物Id

        // // 3 怪物表
        // const cfgMonster: Cfg_Monster = MapMgr.I.CfgMonster(monsterId);// 怪物表

        // 4 怪物属性表
        const attrId: number = cfgRefresh.AttrId_Boss;
        const cfgAttrMonster: Cfg_Attr_Monster = ModelMgr.I.BossModel.CfgAttrMonster(attrId, cfgRefresh.MonsterLevel);

        const blood = Number(cfgAttrMonster.Attr_1);// 基础血量
        if (trialId > len) {
            const blood1 = Math.floor(blood * 1.15 ** (trialId - len));
            return blood1;
        }
        return blood;
    }

    /** 获取怪物名称 */
    public getCfgTrialBossName(trialId: number): string {
        // 1 试炼副本怪物表
        const cfg: Cfg_TrialCopyMonster = this.CfgTrialCopyMonster(trialId);
        const refId: number = cfg.RefreshId;

        // 2 读取刷新表
        const cfgRefresh: Cfg_Refresh = MapMgr.I.CfgRefresh(refId);// 刷新表
        const monsterId: number = Number(cfgRefresh.MonsterIds.split('|')[0]);// 怪物Id

        // 3 怪物表
        const cfgMonster: Cfg_Monster = MapMgr.I.CfgMonster(monsterId);// 怪物表
        return cfgMonster.Name;
    }

    public getCfgTrialBossId(trialId: number): number {
        // 1 试炼副本怪物表
        const cfg: Cfg_TrialCopyMonster = this.CfgTrialCopyMonster(trialId);
        const refId: number = cfg.RefreshId;
        return refId;
        // 2 读取刷新表
        // const cfgRefresh: Cfg_Refresh = MapMgr.I.CfgRefresh(refId);// 刷新表
        // const monsterId: number = Number(cfgRefresh.MonsterIds.split('|')[0]);// 怪物Id
        // return monsterId;
    }

    /** 试炼副本怪物表 */
    public CfgTrialCopyMonster(trialId: number): Cfg_TrialCopyMonster {
        const indexer = Config.Get(ConfigConst.Cfg_TrialCopyMonster);
        let tid = trialId;
        const len = this.CfgTrialCopyMonsterLen();
        if (trialId > len) {
            tid = len;
        }
        return indexer.getValueByKey(tid);
    }

    public CfgTrialCopyMonsterLen(): number {
        const indexer = Config.Get(ConfigConst.Cfg_TrialCopyMonster);
        return indexer.length;
    }

    /** 根据索引获取怪物表 */
    public CfgTrialCopyMonsterByIndex(idx: number): Cfg_TrialCopyMonster {
        const indexer = Config.Get(ConfigConst.Cfg_TrialCopyMonster);
        return indexer.getValueByIndex(idx);
    }

    /** 挑战次数上限 */
    public getCfgTrialCopyTimes(): number {
        const n: number = Number(this.CfgFamilyNormalItem('TrialCopyFightTimes').CfgValue);
        return n;
    }
    /** 挑战奖励 */
    public getCfgTrialRewards(): string[][] { /** 获取协助奖励列表 */
        const str: string = this.CfgFamilyNormalItem('TrialCopyFightReward').CfgValue;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return UtilString.SplitToArray(str);
    }

    public getCfgTrialCopyMonsterLen(): number {
        const indexer = Config.Get(ConfigConst.Cfg_TrialCopyMonster);
        return indexer.length;
    }

    /** -----图腾------ */
    public CfgTotem(): Cfg_Totem[] {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_Totem);
        const arr: Cfg_Totem[] = [];
        indexer.forEach((e: Cfg_Totem) => {
            arr.push(e);
            return true;
        });
        return arr;
    }

    public getCfgTotemById(Id: number): Cfg_Totem {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_Totem);
        const cfg: Cfg_Totem = indexer.getValueByKey(Id);
        return cfg;
    }
    /** 图腾表长度 */
    public getCfgTotemLen(): number {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_Totem);
        return indexer.length;
    }

    public getCfgTotemByIndex(idx: number): Cfg_Totem {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_Totem);
        const item: Cfg_Totem = indexer.getValueByIndex(idx);
        return item;
    }

    /** 图腾等级表 */
    public getCfgTotomLevel(toTemlevel: number): Cfg_TotemLevel {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_TotemLevel);
        const item: Cfg_TotemLevel = indexer.getValueByKey(toTemlevel);
        return item;
    }

    /** 根据图腾等级表 获取没一级技能开启图腾等级 */
    private _mapSkill_Totem: Map<number, number> = new Map<number, number>();
    public getSkillTotemLevelMap(): Map<number, number> {
        if (this._mapSkill_Totem.size) {
            return this._mapSkill_Totem;
        }
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_TotemLevel);
        const n = indexer.keysLength;

        for (let i = 0; i < n; i++) {
            const cfg: Cfg_TotemLevel = indexer.getValueByIndex(i);
            const SkillLevel = cfg.SkillLevel;// 技能等级
            if (SkillLevel) { // 有技能等级
                if (!this._mapSkill_Totem.get(SkillLevel)) {
                    this._mapSkill_Totem.set(SkillLevel, cfg.Level);
                }
            }
        }
        return this._mapSkill_Totem;
    }

    /** 常量表 */
    public CfgFamilyNormalItem(key: string): Cfg_FamilyNormal {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_FamilyNormal);
        const item: Cfg_FamilyNormal = indexer.getValueByKey(key);
        return item;
    }
    /** 奖励表 */
    public CfgTaskReward(Id: number): Cfg_TaskReward {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_TaskReward);
        const item: Cfg_TaskReward = indexer.getValueByKey(Id);
        return item;
    }
    /** 事务表 */
    public CfgTaskName(NameId: number): Cfg_TaskName {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_TaskName);
        const item: Cfg_TaskName = indexer.getValueByKey(NameId);
        return item;
    }

    /** 事务表 -派遣表 */
    public CfgTaskCondition(Id: number): Cfg_TaskCondition {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_TaskCondition);
        const item: Cfg_TaskCondition = indexer.getValueByKey(Id);
        return item;
    }
    /** 派遣-缘分表 */
    public CfgTaskFateCondition(FateId: number): Cfg_TaskFateCondition {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_TaskFateCondition);
        const item: Cfg_TaskFateCondition = indexer.getValueByKey(FateId);
        return item;
    }

    /** 事务-等级 */
    public CfgFNTask(level: number): Cfg_FNTask {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_FNTask);
        let item: Cfg_FNTask = indexer.getValueByKey(level);
        if (!item) {
            const len = indexer.keysLength;// 表格长度
            item = indexer.getValueByIndex(len - 1);
        }
        return item;
    }

    /** 是否达到满级 */
    public CfgFNTaskIsMax(level: number): boolean {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_FNTask);
        const item: Cfg_FNTask = indexer.getValueByKey(level);
        if (!item) {
            return true;
        }
        return false;
    }

    /** 等级 经验 */
    public CfgFamily(Level: number): Cfg_Family {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_Family);
        const item: Cfg_Family = indexer.getValueByKey(Level);
        // if (!item) {
        //     // 返回最后一条
        //     const len = indexer.keysLength;// 总条数
        //     item = indexer.getValueByIndex(len - 1);
        //     return item;
        // }
        return item;
    }

    /** 根据共鸣等级 获取共鸣属性ID */
    public getCfgDrillGroundMaster(maLevel: number): Cfg_DrillGroundMaster {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_DrillGroundMaster);
        return indexer.getValueByKey(maLevel);
    }

    /** 获取共鸣的属性ID */
    public getCfgDgAttrIdByLv(maLevel: number): number {
        const cfg = this.getCfgDrillGroundMaster(maLevel);
        return cfg.AttrId;
    }

    /** 其他部位等级限制 */
    public getCfgDgLevelLimitByLv(maLevel: number): number {
        if (maLevel === 0) {
            maLevel = 1;
        }
        const cfg = this.getCfgDrillGroundMaster(maLevel);
        return cfg.LevelLimit;
    }

    /** 获取最大等级 */
    public getCfgMaxLevel(): number {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_DrillGroundMaster);
        const keys = indexer.getKeys();
        const lastKey: number = keys[keys.length - 1];
        const cfg: Cfg_DrillGroundMaster = indexer.getValueByKey(lastKey);
        return cfg.MasterLevel;
    }

    /** 获取协助奖励列表 */
    public getCfgRewardData(): number[][] {
        const str: string = this.CfgFamilyNormalItem('FNTAssistReward').CfgValue;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return UtilString.SplitToArray(str);
    }

    public getCfgActTime(type: ETimerActId): string {
        const cfg: Cfg_Active = ActivityMgr.I.getActData(type);
        return cfg.ActTime;
    }

    /** bossID */
    public getCfgPatriBOSS(): string {
        const str: string = this.CfgFamilyNormalItem('FNPatriBOSS').CfgValue;
        return str;
    }

    /** 伤害上榜条件 */
    public getCfgPatriLimit(): number {
        const n: number = Number(this.CfgFamilyNormalItem('FNPatriLimit').CfgValue);
        return n;
    }

    public getCfgAttrBuffByType(type: number, times: number): number {
        const indexer = Config.Get(Config.Type.Cfg_FNPatrBuff);
        const indexArr: number[] = indexer.getValueByKey(type);

        if (indexArr.length) {
            indexArr.sort();// 升序排列索引
            for (let i = 0, len = indexArr.length; i < len; i++) {
                //
                const idx = indexArr[i];
                const cfg: Cfg_FNPatrBuff = indexer.getValueByIndex(idx);
                const timeArr = cfg.Times.split(':');
                const min = Number(timeArr[0]);
                let max;
                if (timeArr[1]) {
                    max = Number(timeArr[1]);
                } else {
                    max = min;
                }

                // 小于最小 则无需对比
                if (i === 0 && times < min) {
                    return 0;
                }

                // 大于最大
                if (i === len - 1 && times >= max) {
                    return cfg.InspireBuffId;
                }

                // 普通对比
                if (times >= min && times <= max) {
                    return cfg.InspireBuffId;
                }
            }
        }
        return 0;
    }

    /** 事务令消耗 */
    public getCfgItemCost(): string[] {
        const str: string = this.CfgFamilyNormalItem('FNTCost').CfgValue;
        const arr = str.split(':');

        return arr;
    }
    /** 加速消耗 */
    public getCfgSpeedUpCost(quality: number): number[] {
        const str: string = this.CfgFamilyNormalItem('FNTSpeedUpCost').CfgValue;
        const arr = str.split('|');

        for (let i = 0; i < arr.length; i++) {
            const itemArr = arr[i].split(':');
            const q: number = Number(itemArr[0]);
            const itemId: number = Number(itemArr[1]);
            const itemNum: number = Number(itemArr[2]);
            if (q === quality) {
                return [itemId, itemNum];
            }
        }
        const lastItem = arr[arr.length - 1];
        const lastItemArr = lastItem.split(':');

        return [Number(lastItemArr[1]), Number(lastItemArr[2])];
    }
    /** 当前品质需要多少派遣伙伴 */
    public getCfgNeedNumByQuality(quality: number): number {
        const str: string = this.CfgFamilyNormalItem('FNTPTN').CfgValue;
        const arr: any[][] = UtilString.SplitToArray(str);
        for (let i = 0; i < arr.length; i++) {
            if (Number(arr[i][0]) === quality) {
                return Number(arr[i][1]);
            }
        }
        return 0;
    }
    /** 跨天时间 */
    public getCfgResetTime(): number {
        const str: string = this.CfgFamilyNormalItem('FNTResetTime').CfgValue;
        return Number(str);
    }

    /** 事务令消耗上限 */
    public getCfgItemCostLimit(): number {
        const limit: string = this.CfgFamilyNormalItem('FNTCostLimit').CfgValue;
        return Number(limit);
    }
    /** 事务品质获取CD */
    public getCfgDispatchCD(taskQuality: number): number {
        const strDispatchCD: string = this.CfgFamilyNormalItem('FNTDispatchCD').CfgValue;
        const arr: string[][] = UtilString.SplitToArray(strDispatchCD);
        let timeNum: number = 0;
        for (let i = 0; i < arr.length; i++) {
            if (taskQuality === Number(arr[i][0])) {
                timeNum = Number(arr[i][1]);
                break;
            }
        }
        return timeNum;
    }
    /**
     * 根据刷新次数 获取消耗数量
      * 潜规则：次数大于最后一个（7） 始终用最后一个消耗（7:1:10）
     * @param curNum 当前刷新次数
     * @returns [次数,itemId,itemNum]
     */
    public getCfgRefreshCost(curNum: number): number[] {
        const cfg: Cfg_FamilyNormal = this.CfgFamilyNormalItem('FNTRefreshCost');
        const str: string = cfg.CfgValue;
        const arrStr: string[] = str.split('|');

        // 第一个
        if (curNum === 0) { // 当前次数是0
            const arrFirst: string[] = arrStr[0].split(':');//  "1:3:100000"
            return [Number(arrFirst[0]), Number(arrFirst[1]), Number(arrFirst[2])];
        }

        // 最后一个
        const len = arrStr.length;
        const lastCost: string = arrStr[len - 1];//     "7:1:10"
        const lastArr: string[] = lastCost.split(':');
        if (curNum >= Number(lastArr[0])) { // 次数大于等于最后一个 使用最后一个
            return [Number(lastArr[0]), Number(lastArr[1]), Number(lastArr[2])];
        }

        let big = false;
        for (let i = 0; i < len; i++) {
            const arrItem: string[] = arrStr[i].split(':');
            if (curNum >= Number(arrItem[0])) {
                big = true;
            } else {
                big = false;
            }
            if (!big) {
                if (i === 0) {
                    return [Number(arrItem[0]), Number(arrItem[1]), Number(arrItem[2])];
                } else {
                    const arrItem: string[] = arrStr[i - 1].split(':');
                    return [Number(arrItem[0]), Number(arrItem[1]), Number(arrItem[2])];
                }
            }
        }
        return [];
    }
    /** 设置协助间隔时间 秒（s） */
    public getCfgAssistCD(): number {
        const deltTime: string = this.CfgFamilyNormalItem('FNTAssistCD').CfgValue;
        return Number(deltTime);
    }

    /**
     * 1 Id 职位
     * 2 colKey 字段
     */
    public getCfgFamilyPosReward(Id: number, colKey: string): any[][] {
        const indexer = Config.Get(ConfigConst.Cfg_FamilyPos);
        const cfg: Cfg_FamilyPos = indexer.getValueByKey(Id);
        return UtilString.SplitToArray(cfg[colKey]);
    }

    /** 根据Id获取配置 */
    public getCfgFamilyPos(Id: number): Cfg_FamilyPos {
        const indexer = Config.Get(ConfigConst.Cfg_FamilyPos);
        const cfg: Cfg_FamilyPos = indexer.getValueByKey(Id);
        return cfg;
    }

    /** 获取世家改名间隔时间 */
    public getCfgFNNameCD(): number {
        const str: string = this.CfgFamilyNormalItem('FNNameCD').CfgValue;
        return Number(str);
    }
    /** 获取世家宣言间隔时间 */
    public getCfgFNDescCD(): number {
        const str: string = this.CfgFamilyNormalItem('FNDescCD').CfgValue;
        return Number(str);
    }

    /** 修改名称消耗 */
    public getCfgFNNameCost(times: number): number[] {
        const str: string = this.CfgFamilyNormalItem('FNNameCost').CfgValue;
        const arr = str.split('|');// 时间与次数

        for (let i = 0; i < arr.length; i++) {
            const itemArr = arr[i].split(':');
            const t: number = Number(itemArr[0]);
            const itemId: number = Number(itemArr[1]);
            const itemNum: number = Number(itemArr[2]);
            if (t === times) {
                return [itemId, itemNum];
            }
        }
        const lastItem = arr[arr.length - 1];
        const lastItemArr = lastItem.split(':');

        return [Number(lastItemArr[1]), Number(lastItemArr[2])];
    }

    /** ------------校场------------ */
    // 获取校场升级表
    public getCfgDrillGroundLevel(dgId: number): Cfg_DrillGroundLevel[] {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_DrillGroundLevel);
        const arr: number[] = indexer.getValueByKey(dgId);
        const tempArr: Cfg_DrillGroundLevel[] = [];
        for (let i = 0, len = arr.length; i < len; i++) {
            const index: number = arr[i];
            const cfg: Cfg_DrillGroundLevel = indexer.getValueByIndex(index);
            tempArr.push(cfg);
        }
        return tempArr;
    }
    // 获取校场表
    public getCfgDrillGround(dgId: number): Cfg_DrillGround {
        const indexer: ConfigIndexer = Config.Get(ConfigConst.Cfg_DrillGround);
        const cfg: Cfg_DrillGround = indexer.getValueByKey(dgId);
        return cfg;
    }

    /** 返回当前校场的最大等级 */
    public getMaxLevelByDgId(dgId: number): number {
        const cfg: Cfg_DrillGround = this.getCfgDrillGround(dgId);
        return cfg.MaxLv;
    }

    public getDrillGroundCostId(dgId: number): number {
        const cfg: Cfg_DrillGround = this.getCfgDrillGround(dgId);
        return cfg.CostId;
    }

    /** 根据当前等级，返回当前等级需要的 */
    public getDrillGroundCostStr(dgId: number, level: number): string {
        const costId = this.getDrillGroundCostId(dgId);
        const indexer = Config.Get(ConfigConst.Cfg_DrillGroundCost);
        const idxArr: number[] = indexer.getValueByKey(costId);
        const maxLevel = this.getMaxLevelByDgId(dgId);
        for (let i = 0; i < idxArr.length; i++) {
            const idx = idxArr[i];
            const cfg: Cfg_DrillGroundCost = indexer.getValueByIndex(idx);

            const min = cfg.Min;
            const max = cfg.Max;

            if (level >= min && level < max) { // 当前区间
                return cfg.Cost;
            }
            // 等于最大值，并且未达到最大
            if (level === max && max !== maxLevel) {
                const idxNex = idxArr[i + 1];
                const cfg: Cfg_DrillGroundCost = indexer.getValueByIndex(idxNex);
                return cfg.Cost;
            }
        }
        return '';
    }

    public getResonateAttrByLv(lv: number): IAttrBase[] {
        const attrId: number = this.getCfgDgAttrIdByLv(lv);
        const attr: IAttrBase[] = UtilAttr.GetAttrBaseListById(attrId);
        return attr;
    }

    /**
     *校场信息 item
     *校场等级 dgLevel
     *总共有几条数据 len
    */
    public calcDrillBaseAttr(item: Cfg_DrillGroundLevel, level: number, len: number): number {
        const times = Math.floor(level / len) || 1;// 几倍
        const leftNum = level % len;// 余数
        // 基础属性 = 基础值 * 倍数 + （余数>=当前等级level 则加一次 基础值）
        const attrInfo: AttrInfo = AttrModel.MakeAttrInfo(item.AttrId);
        const baseValue = attrInfo.attrs[0].value;
        if (level <= len) {
            return baseValue;
        }
        let baseNum = baseValue * times;
        if (leftNum >= item.Level) {
            baseNum += baseValue;
        }
        return baseNum;
    }

    /** 根据当前等级 返回加成值 */
    public calcDrillAddAttr(item: Cfg_DrillGroundLevel, type: number): number {
        const attrInfo: AttrInfo = AttrModel.MakeAttrInfo(item.AttrId);// 有多条属性
        for (let i = 0; i < attrInfo.attrs.length; i++) {
            const attr = attrInfo.attrs[i];
            if (attr.attrType === type) {
                return attr.value;
            }
        }
        return 0;
    }

    /** 获取校场限制 */
    public getCfgDrillGroundLimit(level: number): Cfg_DrillGroundLimit {
        const indexer = Config.Get(ConfigConst.Cfg_DrillGroundLimit);
        const cfg: Cfg_DrillGroundLimit = indexer.getValueByKey(level);
        return cfg;
    }

    /** 检测获取校场限制 */
    public isDrillGroundLimitLvCheck(limitLevel: number, arrIds: number[]): boolean {
        for (let i = 0; i < arrIds.length; i++) {
            const dgId: number = arrIds[i];
            const lv = this.getDgLvById(dgId);
            if (lv < limitLevel) {
                return false;
            }
        }
        return true;
    }

    /** 获取id中，最小的等级 */
    public getDrillGroundMinLv(arrIds: number[]): number {
        let lv = 1;// 默认等级=1
        for (let i = 0; i < arrIds.length; i++) {
            const dgId: number = arrIds[i];
            const level = this.getDgLvById(dgId);
            if (i === 0) {
                lv = level;
            } else {
                if (level < lv) {
                    lv = level;
                }
            }
        }
        return lv;
    }
}
