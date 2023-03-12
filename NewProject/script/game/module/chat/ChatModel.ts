/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { EventClient } from '../../../app/base/event/EventClient';
import { UtilChar } from '../../../app/base/utils/UtilChar';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { UtilString } from '../../../app/base/utils/UtilString';
import { UtilTime } from '../../../app/base/utils/UtilTime';
import BaseModel from '../../../app/core/mvc/model/BaseModel';
import { i18n, Lang } from '../../../i18n/i18n';
import { data } from '../../../i18n/zh-CN';
import { Config } from '../../base/config/Config';
import { ConfigConst } from '../../base/config/ConfigConst';
import { ConfigBeautyIndexer } from '../../base/config/indexer/ConfigBeautyIndexer';
import { ConfigIndexer } from '../../base/config/indexer/ConfigIndexer';
import { ConfigItemIndexer } from '../../base/config/indexer/ConfigItemIndexer';
import { ConfigSAQualityIndexer } from '../../base/config/indexer/ConfigSAQualityIndexer';
import { ConfigStageIndexer } from '../../base/config/indexer/ConfigStageIndexer';
import { ConfigTeamBossIndexer } from '../../base/config/indexer/ConfigTeamBossIndexer';
import { ConfigTitleIndexer } from '../../base/config/indexer/ConfigTitleIndexer';
import UtilFunOpen from '../../base/utils/UtilFunOpen';
import { NickShowType, UtilGame } from '../../base/utils/UtilGame';
import UtilItem from '../../base/utils/UtilItem';
import UtilRedDot from '../../base/utils/UtilRedDot';
import { E } from '../../const/EventName';
import { FuncId } from '../../const/FuncConst';
import ModelMgr from '../../manager/ModelMgr';
import { RedDotMgr } from '../reddot/RedDotMgr';
import { RoleMgr } from '../role/RoleMgr';
import { SealAmuletType } from '../roleOfficial/RoleSealAmulet/SealAmuletConst';
import { ChatCdMgr, EChatSetType } from './ChatCdMgr';
import {
    NoticeMsg, CHAT_CHANNEL_ENUM, ChatShowRang, ChatItemObjKey, ChatShowItemType, EChatExt, IChatCommonData, ChatStoreData,
} from './ChatConst';
import ChatDataMgr from './ChatDataMgr';

const { ccclass } = cc._decorator;
@ccclass('ChatModel')
export class ChatModel extends BaseModel {
    /** 最新修改  改用字典存储 */
    public chatListData1: ChatStoreData = {};
    /** 索引数据存储 */
    public indexMap: { [k: number]: string[] } = {};
    /** 红点数据 */
    public redMap: { [k: number]: number } = {};

    /** 因为列表存储没有上限 所以需要单独计算索引值 */
    private _chatDataIndex = 0;
    public get chatDataIndex(): number {
        return this._chatDataIndex;
    }

    public set chatDataIndex(v: number) {
        this._chatDataIndex = v;
    }

    private _currentChatChannel = CHAT_CHANNEL_ENUM.World;
    public set currentChatChannel(v: number) {
        this._currentChatChannel = v;
    }
    public get currentChatChannel(): number {
        return this._currentChatChannel;
    }

    // public chatListData: Array<ChatData | NoticeMsg> = [];

    public blackListData: Array<BlackInfo> = [];
    public sysListData: Array<NoticeMsg> = [];
    public blackListIds: number[] = [];
    // public setListData(list: Array<ChatData>): void {
    //     for (let i = 0; i < list.length; i++) {
    //         const cdata = list[i];
    //         const uid = cdata.SenderInfo.UserId;
    //         const idx = this.blackListIds.indexOf(uid);
    //         if (idx < 0) {
    //             if (!UtilFunOpen.isOpen(FuncId.FamilyHome) && cdata.ChatType === CHAT_CHANNEL_ENUM.Current) {
    //                 //
    //             } else {
    //                 this.chatListData.push(cdata);
    //             }
    //         }
    //     }
    //     if (this.isFirstNotice) {
    //         for (let j = 0; j < this.sysListData.length; j++) {
    //             const sysMsg = this.sysListData[j];
    //             this.chatListData.push(sysMsg);
    //             this.isFirstNotice = false;
    //         }
    //     }
    // }

    private componentRecord: Map<string, IChatCommonData> = new Map();
    public setListData(list: Array<ChatData>): void {
        for (let i = 0; i < list.length; i++) {
            const cdata = list[i];
            const uid = cdata.SenderInfo.UserId;
            const idx = this.blackListIds.indexOf(uid);
            if (idx < 0) {
                // if (!UtilFunOpen.isOpen(FuncId.FamilyHome) && cdata.ChatType === CHAT_CHANNEL_ENUM.Current) {
                //     //
                // } else {
                this._chatDataIndex++;
                const key = ChatDataMgr.ChatDataKey(cdata.SendTime, this._chatDataIndex);
                // 默认设置成已读状态
                this.chatListData1[key] = { data: cdata, state: true };
                // this.chatListData.push(cdata);
                // }
                // 添加用户消息的索引信息
                const typeIds = this.indexMap[cdata.ChatType] || [];
                typeIds.push(key);
                this.indexMap[cdata.ChatType] = typeIds;
            }
        }
        if (this.isFirstNotice) {
            for (let j = 0; j < this.sysListData.length; j++) {
                const sysMsg = this.sysListData[j];
                // this.chatListData.push(sysMsg);
                const key = ChatDataMgr.ChatDataKey(sysMsg.SendTime || UtilTime.NowSec() * 1000, this._chatDataIndex);
                // 默认设置成已读状态
                this.chatListData1[key] = { data: sysMsg, state: true };
                this.isFirstNotice = false;
                this._chatDataIndex++;

                // 添加系统消息的索引信息
                const typeIds = this.indexMap[CHAT_CHANNEL_ENUM.Sys] || [];
                typeIds.push(key);
                this.indexMap[CHAT_CHANNEL_ENUM.Sys] = typeIds;
            }
        }
    }

    public addListData(items: ChatData | ChatData[]): void {
        let callMeData: ChatData = null;
        if (items instanceof Array) {
            for (let k = 0; k < items.length; k++) {
                const cdata = items[k];

                this._chatDataIndex++;
                const key = ChatDataMgr.ChatDataKey(cdata.SendTime, this._chatDataIndex);
                this.chatListData1[key] = { data: cdata, state: false };

                const typeIds = this.indexMap[cdata.ChatType] || [];
                typeIds.push(key);
                this.indexMap[cdata.ChatType] = typeIds;
                if (!this.redMap[cdata.ChatType]) {
                    this.redMap[cdata.ChatType] = 0;
                }
                this.redMap[cdata.ChatType]++;
            }

            for (let i = 0; i < items.length; i++) {
                const cdata = this.checkCallMe(items[i]);
                if (cdata !== null) {
                    callMeData = cdata;
                }
            }
            EventClient.I.emit(E.Chat.RedUpdate);
        } else {
            const itm = items;
            if (this.blackListIds.indexOf(itm.SenderInfo.UserId) < 0) {
                // this.chatListData.push(items);
                this._chatDataIndex++;
                const key = ChatDataMgr.ChatDataKey(itm.SendTime, this._chatDataIndex);
                this.chatListData1[key] = { data: itm, state: false };

                const typeIds = this.indexMap[itm.ChatType] || [];
                typeIds.push(key);
                this.indexMap[itm.ChatType] = typeIds;
            }
            if (itm && itm.SenderInfo) {
                callMeData = this.checkCallMe(itm);
            }
        }

        if (callMeData) {
            // 发送通知有人@我
            EventClient.I.emit(E.Chat.ConnectUser, callMeData);
        }
    }

    /** 判断一个msg是否可以添加进聊天列表中 */
    public msgCanAdd(d: ChatData): boolean {
        if (this.blackListIds.indexOf(d.SenderInfo.UserId) < 0) { // 不在黑名单
            if (d.ChatType === CHAT_CHANNEL_ENUM.Current && !UtilFunOpen.isOpen(FuncId.FamilyHome)) { // 世家需要做判断是否开启
                // 世家未开启
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    /** 检查是否有人@我 */
    private checkCallMe(data: ChatData): ChatData {
        const atInfo: AtInfo = data.AtInfo;
        if (atInfo && atInfo.UserId === RoleMgr.I.info.userID) {
            return data;
        }
        return null;
    }

    /** 过滤  特别注意 变量的修改问题 */
    public searchListType(type: CHAT_CHANNEL_ENUM): Array<ChatData | NoticeMsg> {
        if (type === CHAT_CHANNEL_ENUM.All) {
            // 不能拿当前的变量直接返回  否则会造成外部的数据出现错乱
            // return this.chatListData.concat();
            const arr: Array<ChatData | NoticeMsg> = [];
            for (const key in this.chatListData1) {
                const e = this.chatListData1[key];
                const eData = e.data;
                if (eData instanceof NoticeMsg) {
                    // 处理系统信息是否世家信息  系统公告如果有收到就接收进列表
                    arr.push(eData);
                } else if (this.msgCanAdd(eData)) {
                    arr.push(eData);
                }
            }
            // 处理只显示限制数量的数据
            const num = Math.min(Number(ChatCdMgr.I.getValue(EChatSetType.MultipleMsgSave)), arr.length);
            arr.sort((a, b) => a.SendTime - b.SendTime);
            arr.slice(arr.length - num, arr.length);
            // 清空所有红点
            for (const redK in this.redMap) {
                this.redMap[redK] = 0;
            }
            EventClient.I.emit(E.Chat.RedUpdate);
            return arr;
        }
        const resultList: Array<ChatData | NoticeMsg> = [];

        const map = this.indexMap[type] || [];
        for (let m = 0; m < map.length; m++) {
            const k = map[m];
            const dta = this.chatListData1[k];
            const eData = dta.data;
            if (eData) {
                if (eData instanceof NoticeMsg) {
                    // 系统消息 则需要按照配置表进行过滤
                    const item0 = eData;
                    const range = item0.cfg.Range_Client.split('|');
                    switch (type) {
                        case CHAT_CHANNEL_ENUM.World:
                            if (range.indexOf(ChatShowRang.World) >= 0) {
                                resultList.push(item0);
                            }
                            break;
                        case CHAT_CHANNEL_ENUM.Current:
                            if (range.indexOf(ChatShowRang.Current) >= 0) {
                                resultList.push(item0);
                            }
                            break;
                        default:
                            break;
                    }
                } else if (this.msgCanAdd(eData)) {
                    resultList.push(eData);
                }
            }
        }
        let limitNum = 0;
        if (type === CHAT_CHANNEL_ENUM.Sys) {
            limitNum = resultList.length;
        } else if (type === CHAT_CHANNEL_ENUM.World) {
            limitNum = Number(ChatCdMgr.I.getValue(EChatSetType.WorldMsgSave));
        } else if (type === CHAT_CHANNEL_ENUM.Current) {
            limitNum = Number(ChatCdMgr.I.getValue(EChatSetType.SingleMsgLimit));
        }
        const rNum = Math.min(limitNum, resultList.length);
        resultList.sort((a, b) => a.SendTime - b.SendTime);
        resultList.slice(resultList.length - rNum, resultList.length);
        this.redMap[type] = 0;
        EventClient.I.emit(E.Chat.RedUpdate);
        // for (let i = 0; i < this.chatListData.length; i++) {
        //     // 按照条件过滤
        //     const item = this.chatListData[i] as ChatData;
        //     if (item.SenderInfo) {
        //         // 正常消息正常过滤
        //         if (item.ChatType === type) {
        //             resultList.push(item);
        //         }
        //     } else {
        //         // 系统消息 则需要按照配置表进行过滤
        //         const item0 = this.chatListData[i] as NoticeMsg;
        //         const range = item0.cfg.Range_Client.split('|');
        //         switch (type) {
        //             case CHAT_CHANNEL_ENUM.World:
        //                 if (range.indexOf(ChatShowRang.World) >= 0) {
        //                     resultList.push(item0);
        //                 }
        //                 break;
        //             case CHAT_CHANNEL_ENUM.Current:
        //                 if (range.indexOf(ChatShowRang.Current) >= 0) {
        //                     resultList.push(item0);
        //                 }
        //                 break;
        //             default:
        //                 break;
        //         }
        //     }
        // }
        return resultList;
    }

    public getRed(): { [k: number]: number } {
        return this.redMap;
    }
    /** 判断数据是否在黑名单 */
    public dataInBlack(data: ChatData[] | NoticeMsg[]): boolean {
        for (let i = 0; i < data.length; i++) {
            const item = data[i] as ChatData;
            if (item.SenderInfo) {
                return this.blackListIds.indexOf(item.SenderInfo.UserId) >= 0;
            }
        }
        return false;
    }

    public clearAll(): void {
        //
    }
    private isFirstNotice = true;
    public addSysNoticeData(dta: NoticeMsg): void {
        this.sysListData.push(dta);
        this._chatDataIndex++;
        // 系统消息不计入红点
        const key = ChatDataMgr.ChatDataKey(dta.SendTime, this._chatDataIndex);
        this.chatListData1[key] = { data: dta, state: false };

        // this.chatListData.push(dta);
    }

    public addSysNoticeToList(dta: NoticeMsg): void {
        // this.chatListData.push(dta);
        this._chatDataIndex++;
        const key = ChatDataMgr.ChatDataKey(dta.SendTime, this._chatDataIndex);
        this.chatListData1[key] = { data: dta, state: false };
    }

    public setBlackList(data: S2CGetBlackList): void {
        const bl: BlackInfo[] = data.BlackList;
        this.blackListData = bl;
        this.blackListIds = []; // 清空
        this.blackListData.forEach((itm) => {
            this.blackListIds.push(itm.UserId);
        });
    }

    public dataCanInsertList(d: ChatData | NoticeMsg, type: CHAT_CHANNEL_ENUM): boolean {
        if (type === CHAT_CHANNEL_ENUM.All) {
            if (d instanceof NoticeMsg) {
                return true;
            }
            return this.msgCanAdd(d);
        }
        if (d instanceof NoticeMsg) {
            const range = d.cfg.Range_Client.split('|');
            switch (type) {
                case CHAT_CHANNEL_ENUM.World:
                    if (range.indexOf(ChatShowRang.World) >= 0) {
                        return true;
                    }
                    break;
                case CHAT_CHANNEL_ENUM.Current:
                    if (range.indexOf(ChatShowRang.Current) >= 0) {
                        return true;
                    }
                    break;
                default:
                    break;
            }
        } else if (d.ChatType === type) {
            return true;
        }
        return false;
    }

    /**
    * 根据服务端返回属性获取到展示的信息
    * @param val 展示内容
    * @param isDark  界面颜色模式（深色 浅色）
    * @returns
    * name0 物品名称之外的显示信息（如果没有则写为''）
    * name 物品名称
    * color 物品颜色
    */
    // eslint-disable-next-line max-len
    public getObjInfo(val: IntAttr[], stringVal: StrAttr[], isDark: boolean = true): { name0: string, name: string, color: string, exParam?: string } {
        // if (val.length < 1) return null;
        const va = val[0];
        let k: ChatItemObjKey;
        let v: number;
        if (va) {
            k = va.K;
            v = va.V;
        }
        let exParam = '';
        if (k === ChatItemObjKey.default) {
            const id = v;
            const indexer: ConfigItemIndexer = Config.Get(ConfigConst.Cfg_Item);
            const itm: Cfg_Item = indexer.getValueByKey(id);
            const Quality = itm.Quality;
            const a = UtilItem.GetItemQualityColor(Quality, isDark);
            return { name0: i18n.tt(Lang.com_btn_show), name: itm.Name, color: a };
        } else if (k === ChatItemObjKey.pet) {
            const id = v;
            const indexer1: ConfigIndexer = Config.Get(ConfigConst.Cfg_General);
            const itm: Cfg_General = indexer1.getValueByKey(id);
            const Quality = itm.Quality;
            const a = UtilItem.GetItemQualityColor(Quality, isDark);
            return { name0: i18n.tt(Lang.com_btn_show), name: itm.Name, color: a };
        } else if (k === ChatItemObjKey.seal) {
            const id = v;
            const indexer2: ConfigSAQualityIndexer = Config.Get(ConfigConst.Cfg_SAQuality);
            const itm: Cfg_SAQuality = indexer2.getSealAmuletQualityBy(SealAmuletType.Seal, id, 1);
            const Quality = itm.Star;
            const a = UtilItem.GetItemQualityColor(Quality, isDark);
            return { name0: i18n.tt(Lang.com_btn_show), name: `${i18n.tt(Lang.seal_title)}`, color: a };
        } else if (k === ChatItemObjKey.amulet) {
            const id = v;
            const indexer2: ConfigSAQualityIndexer = Config.Get(ConfigConst.Cfg_SAQuality);
            const itm: Cfg_SAQuality = indexer2.getSealAmuletQualityBy(SealAmuletType.Amulet, id, 1);
            const Quality = itm.Star;
            const a = UtilItem.GetItemQualityColor(Quality, isDark);
            return { name0: i18n.tt(Lang.com_btn_show), name: `${i18n.tt(Lang.amulet_title)}`, color: a };
        } else if (k === ChatItemObjKey.title) {
            const id = v;
            const indexer2: ConfigTitleIndexer = Config.Get(ConfigConst.Cfg_Title);
            const { Name, Quality } = indexer2.getValueByKey(id, { Name: '', Quality: 0 });
            const a = UtilItem.GetItemQualityColor(Quality, isDark);
            return { name0: i18n.tt(Lang.com_btn_show), name: Name, color: a };
        } else if (k === ChatItemObjKey.beauty) {
            const id = v;
            const indexer: ConfigBeautyIndexer = Config.Get(ConfigConst.Cfg_Beauty);
            const { Name, Quality } = indexer.getValueByKey(id, { Quality: 1, Name: '' });
            const a = UtilItem.GetItemQualityColor(Quality, isDark);
            return { name0: i18n.tt(Lang.com_btn_show), name: Name, color: a };
        } else if (k === ChatItemObjKey.plot) {
            const id = v;
            exParam = `${ChatShowItemType.plot},${id}`;
            const cfgCollBook: Cfg_CollectionBook = Config.Get(Config.Type.Cfg_CollectionBook).getValueByKey(id);
            const name = RoleMgr.I.info.getAreaNick(NickShowType.ArenaNick);

            // 用户关卡改变
            const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
            // 最新章节
            const newStage = indexer.getChapterInfo(cfgCollBook.UnlockParam).chapter;
            const cfgStage: Cfg_Stage = Config.Get(Config.Type.Cfg_Stage).getValueByKey(newStage);
            const stageName = cfgStage.MapName;
            let ikonName = '';
            if (cfgCollBook) {
                ikonName = cfgCollBook.Name;
            }
            const cfg: Cfg_Notice = Config.Get(Config.Type.Cfg_Notice).getValueByKey(501);
            const str = cfg.MSG.replace('{name0}', name);
            const str1 = str.replace('{1}', '');
            return {
                name0: UtilString.FormatArgs(str1, stageName), name: ikonName, color: UtilColor.OrangeV, exParam,
            };
        } else {
            const ss = stringVal[0].V.split(',');
            const fbId: number = +ss[0];
            exParam = `${ChatShowItemType.team},${stringVal[0].V}`;
            let fbTypeName = '';
            let level = 1;
            const cfg = Config.Get<ConfigTeamBossIndexer>(Config.Type.Cfg_TeamBoss);
            const cfgTBLevel: Cfg_TeamBoss_Level = cfg.getValueByKeyFromLevel(fbId);
            if (cfgTBLevel) {
                const cfgTB: Cfg_TeamBoss = cfg.getValueByKey(cfgTBLevel.FBId);
                if (cfgTB) {
                    fbTypeName = cfgTB.Name;
                }
                level = cfgTBLevel.LevelLimit;
            }
            return {
                name0: UtilString.FormatArgs(i18n.tt(Lang.team_share_text), fbTypeName, level),
                name: i18n.tt(Lang.team_share_click_text),
                color: UtilColor.OrangeV,
                exParam,
            };
        }
    }

    public testLink(): string {
        return '<color=#fff click="111"> 测试点击</c>';
    }

    /** 系统公告id */
    public GetNotice(data: S2CSendNotice, colorStr: string = UtilColor.WhiteD): NoticeMsg {
        const result: NoticeMsg = new NoticeMsg(null, '', UtilTime.NowSec() * 1000);
        let str = '';
        if (data && data.Id) {
            result.cfg = Config.Get(Config.Type.Cfg_Notice).getValueByKey(data.Id);
            // 当前系统消息个功能链接 （若没有则不添加）
            const MSG1 = result.cfg && result.cfg.MSG1 ? result.cfg.MSG1 : '';
            // 整合为整条消息
            str = result.cfg ? `<color=${colorStr}>${result.cfg.MSG}</c>${MSG1}` : '';
            // if (result)
            // if (data.Id === 258 || data.Id === 384) {
            //     if (data.LinkParam.length) {
            //         let addS = '';
            //         for (let index = 0; index < data.LinkParam.length; index++) {
            //             const element = data.LinkParam[index];
            //             if (!addS) {
            //                 addS = element;
            //             } else {
            //                 addS += `,${element}`;
            //             }
            //         }
            //         // switch (data.Id) {
            //         //     case 258:
            //         //         MSG1 = `<color=#02ae00 click='|11057,${addS}|'>【<u>前往助战</u>】</c>`;
            //         //         break;
            //         //     case 384:
            //         //         MSG1 = `<color=#02ae00 click='|${addS}|'>【<u>我也要神兽</u>】</c>`;
            //         //         break;
            //         //     default:
            //         //         break;
            //         // }
            //     }
            // } else if (result.cfg) {
            //     MSG1 = result.cfg.MSG1;
            // }
            // { str = result.cfg ? `<color=${colorStr}>${result.cfg.MSG}</c>${MSG1}` : ''; }

            /** *********     处理内容数据       ******** */
            // 用户
            let names = '';
            // 超链接 用户名
            let cnames = '';
            // 跨服用户名
            let knames = '';
            // 展示item
            let items = '';
            // 展示超链接item
            let citems = '';
            // 额外信息的值
            let carnames = '';
            // 技能
            const skills = '';
            // 宠物
            const pets = '';
            // 宠物信息
            const petsinfo = '';
            const petsinfo1 = '';
            const justNum = '';

            if (data.Users && data.Users.length) {
                for (let index = 0; index < data.Users.length; index++) {
                    const name = `${UtilGame.ShowNick(data.Users[index].AreaId, data.Users[index].Nick)}`;
                    const nameId = data.Users[index].UserId;
                    if (str.indexOf('{name') !== -1) {
                        const regexp = `{name${index}}`;
                        names += `${name},`;
                        str = str.replace(new RegExp(regexp, 'g'), name);
                    }
                    if (str.indexOf('{cname') !== -1) {
                        const regexp2 = `{cname${index}}`;
                        const cname = `<u><color=${UtilColor.GreenD} click='|121,${nameId}|'>${name}</c></u>`;
                        cnames += `${cname},`;
                        str = str.replace(new RegExp(regexp2, 'g'), cname);
                    }
                    if (str.indexOf('{kname') !== -1) {
                        const regexp3 = `{kname${index}}`;
                        const kname = data.Users[index].Nick;
                        str = str.replace(new RegExp(regexp3, 'g'), kname);
                        knames += `${kname},`;
                    }
                }
            }

            // 伤害等其他纯数值数值
            if (data.Params && data.Params.length) {
                for (let i = 0; i < data.Params.length; i++) {
                    if (str.indexOf(`{${i}}`) !== -1) {
                        const regexpa = `{${i}}`;
                        str = str.replace(regexpa, `${data.Params[i]}`);
                    }
                    if (str.indexOf(`{family${i}}`) !== -1) {
                        const regexpa = `{family${i}}`;
                        const colorname = i18n.tt(Lang[`general_quality_se${data.Params[i]}`]);
                        str = str.replace(regexpa, `<color=${UtilItem.GetItemQualityColor(Number(data.Params[i]))}>${colorname}${i18n.tt(Lang.family_task)}</c>`);
                    }
                }
            }

            //  // 伤害世家
            // if (data.family && data.family.length) {
            //     for (let i = 0; i < data.family.length; i++) {
            //         if (str.indexOf(`{${i}}`) !== -1) {
            //             const regexpa = `{${i}}`;
            //             str = str.replace(regexpa, `${data.family[i]}`);
            //         }
            //     }
            // }

            // 物品
            if (data.Items && data.Items.length) {
                for (let index = 0; index < data.Items.length; index++) {
                    if (index >= 10) {
                        str += '...';
                        break;
                    }
                    let itemIId = 1;
                    const itemId = '';
                    const itemData = data.Items[index];
                    if (itemData && itemData.ItemId) {
                        itemIId = itemData.ItemId ? itemData.ItemId : 1;
                        // itemId = itemData.Id ? itemData.Id : `${itemData.ItemId}_${new Date().getTime()}`;
                        // // 缓存一下道具信息
                        // this.equipData[itemId] = itemData;
                    } else {
                        itemIId = data.Items[index].ItemId;
                    }

                    const num = data.Items[index].ItemNum;
                    const itemCfg: Cfg_Item = Config.Get(Config.Type.Cfg_Item).getValueByKey(itemIId);// Config.I.GetCfgItem(itemIId);
                    const item_name = itemCfg.Name;
                    // if (FuncType.PetEquip == itemCfg.ObjType) {
                    //     item_name = PetEqM.I.getMakeName(itemData, item_name);
                    // }
                    const Quality = itemCfg.Quality;
                    const a = UtilItem.GetItemQualityColor(Quality, true); // BgItem.getLNamecolor(Quality);

                    const num_S = num > 1 ? `x${num}` : '';
                    if (str.indexOf('{item') !== -1) {
                        const regexp = `{item${index}}`;
                        let item = '';
                        item = `<color=${a}>${item_name}${num_S}</c>`;
                        items += `${item},`;
                        str = str.replace(new RegExp(regexp, 'g'), item);
                    }
                    if (str.indexOf('{citem') !== -1) {
                        const regexp2 = `{citem${index}}`;
                        let citem = '';
                        citem = `<u><color=${a} click='|19,${itemIId},${num},${itemId}|'>${item_name}${num_S}</c></u>`;

                        citems += `${citem},`;
                        str = str.replace(new RegExp(regexp2, 'g'), citem);
                    }
                }
            }

            if (data.ExtParam) {
                for (let index = 0; index < data.ExtParam.length; index++) {
                    switch (data.ExtParam[index].K) {
                        case EChatExt.Car: {
                            const carQualityId = +data.ExtParam[index].V;
                            const cfgEscort: Cfg_Escort = ModelMgr.I.EscortModel.CfgEscort.getValueByKey(carQualityId);
                            const a = UtilItem.GetItemQualityColor(cfgEscort.Quality, true);

                            if (str.indexOf('{car') !== -1) {
                                const regexp = `{car${index}}`;
                                const car = `<color=${a}>${cfgEscort.Name}</c>`;
                                carnames += `${car},`;
                                str = str.replace(new RegExp(regexp, 'g'), carnames);
                            }
                        }
                            break;
                        case EChatExt.Huarongdao: {
                            const genId = +data.ExtParam[index].V;
                            const cfgGen: Cfg_HuarongdaoGen = ModelMgr.I.HuarongdaoModel.getGenValueByKey(genId);
                            const a = UtilItem.GetItemQualityColor(cfgGen.OddsTime, true);

                            if (str.indexOf('{hrdname') !== -1) {
                                const regexp = `{hrdname${index}}`;
                                const gen = `<color=${a}>${cfgGen.Name}</c>`;
                                carnames += `${gen}`;
                                str = str.replace(new RegExp(regexp, 'g'), carnames);
                            }
                        }
                            break;
                        default:
                            break;
                    }
                }
            }

            // 宠物
            // if (data.Pet && data.Pet.length) {
            //     for (let index = 0; index < data.Pet.length; index++) {
            //         const pet_id = data.Pet[index].Id ? data.Pet[index].Id : 1;
            //         const cfg_Pet = Config.I.Cfg_Pet2_D[pet_id];
            //         const pet_name = cfg_Pet.Name;
            //         const a = Utils.I.getNamecolor(cfg_Pet.Quality);
            //         const pet = `<color=${a}>${pet_name}</c>`;
            //         pets += `${pet},`;
            //     }
            // }
            // 展示宠物
            // if (data.PetInfo && data.PetInfo.length) {
            //     for (let index = 0; index < data.PetInfo.length; index++) {
            //         const pet_D = data.PetInfo[index].Pet2;
            //         const pet_id = pet_D.IId ? pet_D.IId : 1;
            //         const cfg_Pet = Config.I.Cfg_Pet2_D[pet_id];
            //         const pet_name = cfg_Pet.Name;
            //         str = str.replace(new RegExp('{pet2}', 'g'), JSON.stringify(pet_D));
            //         const a = Utils.I.getNamecolor(cfg_Pet.Quality);
            //         let pet = '';
            //         if (str.indexOf('{petsinfo1}') != -1) {
            //             pet = `<u><color=${a} click='|21123|'>${pet_name}</c></u>`;
            //             petsinfo1 += `${pet},`;
            //         } else {
            //             pet = `<u><color=${a} click='|11012|'>${pet_name}</c></u>`;
            //             petsinfo += `${pet},`;
            //         }
            //     }
            // }
            // 宠物七彩技能
            // if (data.Skill && data.Skill.length) {
            //     for (let index = 0; index < data.Skill.length; index++) {
            // eslint-disable-next-line max-len
            //         const skill = `<color=#c0eefb click='|401,${data.Skill[index]},${7}|'>${BgItem.getRainBowStr(`7级${Config.I.getSkillInfoById(data.Skill[index]).SkillName}`)}</c>`;
            //         skills += `${skill},`;
            //     }
            // }
            // 关卡
            // if (data.Stage && data.Stage.length) {
            //     for (let index = 0; index < data.Stage.length; index++) {
            //         const regexp2 = `{stage${index}}`;
            //         const stage = GKM.I.getStage(Number(data.Stage[index]));
            //         str = str.replace(new RegExp(regexp2, 'g'), `<color=#07aaee>${Utils.I.StringFormat('第{0}关', stage.SS)}</c>`);
            //     }
            // }
            // 参数
            // const s = /\{{names}\}/g;
            str = names && str.indexOf('{names}') !== -1 ? str.replace(/\{names\}/g, names.substr(0, names.length - 1)) : str;
            str = cnames && str.indexOf('{cnames}') !== -1 ? str.replace(/\{cnames\}/g, cnames.substr(0, cnames.length - 1)) : str;
            str = knames && str.indexOf('{knames}') !== -1 ? str.replace(/\{knames\}/g, knames.substr(0, knames.length - 1)) : str;
            str = items && str.indexOf('{items}') !== -1 ? str.replace(/\{items\}/g, items.substr(0, items.length - 1)) : str;
            str = citems && str.indexOf('{citems}') !== -1 ? str.replace(/\{citems\}/g, citems.substr(0, citems.length - 1)) : str;
            str = carnames && str.indexOf('{carnames}') !== -1 ? str.replace(/\{carnames\}/g, carnames.substr(0, carnames.length - 1)) : str;

            // str = pets && str.indexOf('{pets}') != -1 ? str.replace(/\{pets}\}/g, pets.substr(0, pets.length - 1)) : str;
            // str = petsinfo && str.indexOf('{petsinfo}') != -1 ? str.replace(/\{petsinfo}\}/g, petsinfo.substr(0, petsinfo.length - 1)) : str;
            // str = (petsinfo0 && str.indexOf('{petsinfo0}') != -1) ? str.replace(/\{petsinfo0}\}/g, petsinfo0.substr(0, petsinfo0.length)) : str;
            // str = petsinfo1 && str.indexOf('{petsinfo1}') != -1 ? str.replace(/\{petsinfo1\}/g, petsinfo1.substr(0, petsinfo1.length - 1)) : str;
            // str = skills && str.indexOf('{skills}') != -1 ? str.replace(/\{skills\}/g, skills.substr(0, skills.length - 1)) : str;
            // str = data.P && data.P.length > 0 ? Utils.I.StringFormatArray(str, data.P) : str;
            result.msg = str;
        }
        return result;
    }

    /** 获取通用聊天控件的坐标记录 */
    public getComponentRecord(id: string): any {
        if (this.componentRecord.has(id)) {
            return this.componentRecord.get(id);
        } else {
            return null;
        }
    }

    /** 设置通用聊天控件的坐标记录 */
    public setComponentRecord(data: IChatCommonData): void {
        this.componentRecord.set(data.id, data);
    }

    public cleanComponentRecord(): void {
        this.componentRecord.clear();
    }
}
