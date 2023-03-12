/*
 * @Author: zs
 * @Date: 2022-08-30 14:21:35
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\worldBoss\v\com\BossBigHp.ts
 * @Description:
 *
 */
import { UtilBool } from '../../../../../app/base/utils/UtilBool';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilTime } from '../../../../../app/base/utils/UtilTime';
import BaseCmp from '../../../../../app/core/mvc/view/BaseCmp';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { EffectMgr } from '../../../../manager/EffectMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import Progress from '../../../../base/components/Progress';
import { SpriteCustomizer } from '../../../../base/components/SpriteCustomizer';
import { Config } from '../../../../base/config/Config';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { ViewConst } from '../../../../const/ViewConst';
import { FuBenMgr } from '../../../fuben/FuBenMgr';
import { EBossBuffType, EBossEventType } from '../../WorldBossConst';
import { UtilSkillInfo } from '../../../../base/utils/UtilSkillInfo';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import { RES_ENUM } from '../../../../const/ResPath';

const { ccclass, property } = cc._decorator;
/** 可选参数，可直接传入boss名字，boss等级，资源id */
interface ICfgMonster {
    /** boss名字，不传就根据MonsterId读取怪物表的名字 */
    Name?: string,
    /** 资源id，用作头像图片名字 */
    ResId?: number,
}

interface ICfgRefresh {
    /** boss等级，-1就表示获取世界等级显示，不传就根据RefreshId去刷新表获取等级 */
    MonsterLevel?: number,
}

interface IBossBigHp extends ICfgMonster, ICfgRefresh { }

interface IBossEventInfo {
    /** boss事件类型 */
    type?: EBossEventType,
    /** 开始时间 */
    startTime: number,
    /** 持续时间 */
    endTime: number,
    /** 开始百分比 */
    startPer: number,
    /** 结束百分比 */
    endPer: number,
    /** 显示的值 */
    showValue?: string,
    /** 节点 */
    node?: cc.Node,
    /** 是否显示 */
    isShow?: boolean,
    /** 索引 */
    index: number,
    /** 事件特效路径 */
    effectPath?: string,
    /** 事件帮助id */
    helpId?: number,
}
/** 护盾和破盾，只能显示一个，互斥 */
// const Shield = EBuffType.Shield | EBuffType.BrokenShield;

interface IBuffInfo { type: EBossBuffType, endTimeStamp: number, node: cc.Node, buffId: number, skillId: number }

@ccclass
export class BossBigHp extends BaseCmp {
    @property(Progress)
    private progressHp: Progress = null;
    @property(cc.Label)
    private LabelName: cc.Label = null;
    @property(cc.Label)
    private LabelLevel: cc.Label = null;
    @property(cc.Node)
    private NodeEvent: cc.Node = null;
    @property(cc.Sprite)
    private SpriteHead: cc.Sprite = null;
    @property(cc.Node)
    private NodeBuff: cc.Node = null;
    /** 世界等级 */
    private worldLevel: number = -1;

    /** 进度条总长度 */
    private progressWidth: number = 0;
    private lastPer: number = 0;

    private bossEvents: IBossEventInfo[] = [];
    protected onLoad(): void {
        super.onLoad();
        this.progressWidth = this.progressHp.node.getContentSize().width;
    }

    /**
     * 设置数据
     * @param monsterId 怪物id
     * @param refreshId 刷新id
     * @param opt 扩展参数,{Name: string, AnimId: number, MonsterLevel: number}
     * @returns
     */
    public setData(monsterId: number, refreshId?: number, opt?: IBossBigHp): void {
        /** 怪物id是否没传进来 */
        const isNoneMonsterId = !monsterId;
        let level = opt?.MonsterLevel || 0;
        if (isNoneMonsterId) {
            if (!refreshId) {
                console.log('怪物id和刷新id都是空的');
                return;
            }
            // 通过刷新表找怪物id
            const cfgRefresh = Config.Get(Config.Type.Cfg_Refresh).getValueByKey(refreshId, { MonsterIds: '', MonsterLevel: 0 });
            monsterId = +cfgRefresh.MonsterIds.split('|')[0];
            // 扩展参数等级没传进来，取表里面的
            level = level || cfgRefresh.MonsterLevel;
        }

        if (!level && refreshId) { // 扩展参数没传入等级就从刷新表里查找
            level = Config.Get(Config.Type.Cfg_Refresh).getValueByKey(refreshId, 'MonsterLevel');
        }
        if (level === this.worldLevel) { // -1表示要取世界等级
            level = FuBenMgr.WorldLevel;
        }
        // 扩展参数没传入名字或者资源id，就去怪物表找
        let tmpObj: ICfgMonster = cc.js.createMap(true);
        if (!opt?.Name || !opt?.ResId) {
            if (!opt?.Name) {
                tmpObj.Name = '';
            }
            if (!opt?.ResId) {
                tmpObj.ResId = 0;
            }
            tmpObj = Config.Get(Config.Type.Cfg_Monster).getValueByKey(monsterId, tmpObj);
        }

        const name = opt?.Name || tmpObj.Name || '';
        const resId = opt?.ResId || tmpObj.ResId || 0;
        this.LabelName.string = name;
        // this.LabelLevel.string = UtilString.FormatArgs(i18n.tt(Lang.com_level), level);

        UtilCocos.LoadSpriteFrameRemote(this.SpriteHead, `${RES_ENUM.HeadIcon}${resId}`);
    }

    /**
     * 更新血条
     * @param hp 当前血量
     * @param maxHp 总血量
     * @param isShowAction 是否动作，默认false
     */
    public updateHp(hp: number, maxHp?: number, isShowAction: boolean = false): void {
        const p = hp / maxHp;
        const per = Math.ceil(p * 100) / 100;
        // console.log('hp, maxHp, p, per, this.lastPer=', hp, maxHp, p, per, this.lastPer);
        this.bossEventHandle(hp);

        if (this.lastPer === per) { return; }
        this.lastPer = per;
        this.progressHp.updateProgress(hp, maxHp, isShowAction);
    }

    private bossEventHandle(lefttime: number) {
        let event = this.bossEvents[0];
        for (let i = this.bossEvents.length - 1; i >= 0; i--) {
            event = this.bossEvents[i];
            // eslint-disable-next-line max-len
            // console.log('type,index,starttime,endtime,startper,endper,lefttime===', event.type, event.index, event.startTime, event.endTime, event.startPer, event.endPer, lefttime);
            if (event && event.startTime >= lefttime) {
                if (!event.isShow && lefttime > event.endTime) {
                    event.isShow = true;
                    if (event.effectPath) {
                        EffectMgr.I.showEffect(event.effectPath, event.node, cc.WrapMode.Loop);
                    }
                    // console.log('boss事件开始=', event.type, event.index);
                    // EventClient.I.emit(E.BossBigHp.StartBossEvent, event.type, event.index);
                } else if (event.endTime >= lefttime) {
                    if (event.effectPath) {
                        EffectMgr.I.delEffect(event.effectPath, event.node);
                        UtilCocos.SetSpriteGray(event.node, true);
                    }
                    // console.log('boss事件结束=', event.type, event.index);
                    // EventClient.I.emit(E.BossBigHp.EndBossEvent, event.type, event.index);
                    this.bossEvents.splice(i, 1);
                }
            }
        }
    }
    /**
     * 添加boss
     * @param type 事件类型
     * @param startPer 起始百分比的值[0.1-1]
     * @param endPer 结束百分比的值[0.1-1]
     * @param showValue 可选参数：显示的值，不传就用startPer来显示
     */
    public addBossEvent(type: EBossEventType, opts: IBossEventInfo): void {
        if (UtilBool.isNullOrUndefined(opts.showValue)) {
            opts.showValue = `${opts.startPer}`;
        }
        const node = this.NodeEvent.children[this.NodeEvent.children.length - 1];
        const copyNode = cc.instantiate(node);
        opts.type = type;
        opts.node = copyNode;
        this.bossEvents.push(opts);
        const spriteCus: SpriteCustomizer = UtilCocos.GetComponent(SpriteCustomizer, copyNode);
        spriteCus.curIndex = type;
        UtilCocos.SetString(spriteCus.node, 'Label', opts.showValue);
        copyNode.setPosition(this.progressWidth * opts.startPer, copyNode.position.y);
        copyNode.active = true;
        this.NodeEvent.addChild(copyNode);
        if (opts.helpId) {
            UtilGame.Click(copyNode, () => {
                WinMgr.I.open(ViewConst.DescWinTip, opts.helpId);
            }, this);
        }
    }

    private buffInfos: { [type: number]: IBuffInfo } = cc.js.createMap(true);
    /**
     * 添加buff，血条上方显示对应的buff的Icon
     * @param type buff类型
     * @param endTimeStamp 结束时间戳
     * @param opts 可选的扩展参数：{ buffId?: number, skillId?: number }
     */
    public addBuff(type: EBossBuffType, endTimeStamp: number, opts?: { buffId?: number, skillId?: number }): void {
        switch (type) {
            case EBossBuffType.Shield:
            case EBossBuffType.BrokenShield:
                this.addBuffByKey(EBossBuffType.Shield, type, endTimeStamp, opts.buffId, opts.skillId);
                break;
            default:
                break;
        }
    }

    /** 移除buff */
    public delBuff(type: EBossBuffType): void {
        switch (type) {
            case EBossBuffType.Shield:
            case EBossBuffType.BrokenShield:
                this.buffInfos[EBossBuffType.Shield]?.node.destroy();
                delete this.buffInfos[EBossBuffType.Shield];
                break;
            default:
                break;
        }
    }

    /**
     * 根据key添加buff
     * @param key key
     * @param type buff类型
     * @param endTimeStamp 结束时间戳
     * @param buffId buffid
     * @param skillId 技能id
     */
    private addBuffByKey(key: EBossBuffType, type: EBossBuffType, endTimeStamp: number, buffId: number, skillId: number): void {
        const buffInfo: IBuffInfo = this.buffInfos[key] = this.buffInfos[key] || cc.js.createMap(true);
        if (buffInfo.type === type) {
            // 已经有相同类型的，变更时间
            buffInfo.buffId = buffId;
            buffInfo.skillId = skillId;
            buffInfo.endTimeStamp = endTimeStamp;
        } else {
            buffInfo.node?.destroy();
            const node = cc.instantiate(this.NodeBuff.children[0]);
            this.NodeBuff.addChild(node);
            node.active = true;
            buffInfo.node = node;
            buffInfo.buffId = buffId;
            buffInfo.skillId = skillId;
            buffInfo.endTimeStamp = endTimeStamp;

            // buffIcon || 技能ICON
            if (buffInfo.buffId) {
                //
            } else if (buffInfo.skillId) {
                const skillIconID: number = UtilSkillInfo.GetSkillIconID(buffInfo.skillId);
                if (skillIconID) {
                    UtilCocos.LoadSpriteFrameRemote(buffInfo.node, 'Icon', `${RES_ENUM.Skill}${skillIconID}`);
                }
            }
            UtilGame.Click(buffInfo.node, () => {
                // buffIcon || 技能ICON
                let cfgSkill: Cfg_SkillDesc;
                if (buffInfo.buffId) {
                    //
                } else if (buffInfo.skillId) {
                    cfgSkill = UtilSkillInfo.GetCfg(buffInfo.skillId);
                }
                if (cfgSkill) {
                    WinMgr.I.open(ViewConst.TipsSkillWin, {
                        skillId: buffInfo.skillId || buffInfo.buffId,
                        iconId: cfgSkill.SkillIconID,
                        type: 1,
                        name: cfgSkill.SkillName,
                        starLevel: 1,
                        unlock: false,
                        unlockString: '',
                    }, [{ title: `【${i18n.tt(Lang.com_cur_effect)}】`, data: UtilSkillInfo.GetSkillDesc(cfgSkill) }]);
                }
            }, this);
        }
        UtilCocos.SetString(buffInfo.node, 'Label', endTimeStamp - UtilTime.NowSec());
        this.endTimeStampMax = Math.max(this.endTimeStampMax, endTimeStamp);
    }

    /** 取最大时间戳的buff时间戳 */
    private endTimeStampMax: number = 0;
    /** 上一次更新的时间 */
    private lastTime: number = 0;
    protected update(dt: number): void {
        let time = this.endTimeStampMax - UtilTime.NowSec();
        if (this.lastTime === time) {
            return;
        }
        this.lastTime = time;
        for (const k in this.buffInfos) {
            time = this.buffInfos[k].endTimeStamp - UtilTime.NowSec();
            if (time > 0) {
                UtilCocos.SetString(this.buffInfos[k].node, 'Label', time);
            } else {
                this.buffInfos[k].node.destroy();
                delete this.buffInfos[k];
            }
        }
    }
}
