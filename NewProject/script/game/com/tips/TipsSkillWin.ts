/*
 * @Author: wangxina
 * @Date: 2022-07-18 20:37:18
 */
import { EventClient } from '../../../app/base/event/EventClient';
import { UtilGame } from '../../base/utils/UtilGame';
import { E } from '../../const/EventName';
import { ActiveInfoSingle, ActiveAttrList } from '../attr/ActiveAttrList';
import WinBase from '../win/WinBase';
import SkillTopPart, { TipsSkillInfo } from './skillPart/SkillTopPart';

const { ccclass, property } = cc._decorator;

@ccclass
export class TipsSkillWin extends WinBase {
    @property(cc.Node)// mask
    protected NdMask: cc.Node = null;

    @property(SkillTopPart)// 技能等级等基础信息
    private SkillTopPart: SkillTopPart = null;

    @property(cc.Node)// 标题 与 描述都在这个容器里
    protected NdAttrContent: cc.Node = null;

    @property(cc.Node)// 有的需要特殊加上 【提升消耗】 等额外的内容
    protected NdNodeContent: cc.Node = null;

    @property(cc.Prefab)// 内容描述的预制体
    protected PrAttrList: cc.Prefab = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdMask, () => {
            this.close();
        }, this, { scale: 1 });
        // start
    }

    /**
     * @param param [ TipsSkillInfo, ActiveInfoSingle[] ]
     */
    public init(param: unknown[]): void {
        this.updateInfo(param);
        EventClient.I.on(E.TipsSkill.updateSkill, this.updateInfo, this);
    }

    protected onDestroy(): void {
        EventClient.I.off(E.TipsSkill.updateSkill, this.updateInfo, this);
    }

    /**
     * 用于面板数据更新
     * @param args 传入的数据和初始化时一致即可
     */
    public updateInfo(args: unknown[]): void {
        // 刷新数据的时候长度有变化
        const skillInfo: TipsSkillInfo = args[0] as TipsSkillInfo;
        const attrData: ActiveInfoSingle[] = args[1] as ActiveInfoSingle[];
        this.SkillTopPart.setSkillInfo(skillInfo);
        this.setAttrData(attrData);
        if (args[2]) {
            const addPrefab: cc.Node = args[2] as cc.Node;
            this.addPrefab(addPrefab);
        }
        for (let i = 0, n = attrData.length; i < n; i++) {
            if (attrData[i].isFull) {
                this.NdNodeContent.destroy();
                break;
            }
        }
    }

    /**
     * 设置技能描述段落 传入 title,标题文字,内容文字，内容颜色（非必须），标题颜色（非必须）
     * data {title, data, infoColor, titleColor}[]
     */
    public setAttrData(dataList: ActiveInfoSingle[]): void {
        const attrCh = this.NdAttrContent.children;
        if (dataList.length <= attrCh.length) {
            for (let i = 0; i < attrCh.length; i++) {
                if (i <= dataList.length) {
                    attrCh[i].active = true;
                    attrCh[i].getComponent(ActiveAttrList).setSingle(dataList[i]);
                } else {
                    attrCh[i].active = false;
                }
            }
        } else {
            for (let i = 0; i < dataList.length; i++) {
                const attrTemp = cc.instantiate(this.PrAttrList);
                this.NdAttrContent.addChild(attrTemp);
                attrTemp.getComponent(ActiveAttrList).setSingle(dataList[i]);
            }
        }
    }

    /**
     * 扩充方法，添加一个预制体组件到面板里来
     * 建议自定义预制体自己加一个刷新接口，然后inti更新参数不在传参就行了
     */
    public addPrefab(prefab: cc.Node): void {
        this.NdNodeContent.destroyAllChildren();
        this.NdNodeContent.removeAllChildren();

        this.NdNodeContent.addChild(prefab);
    }
}
