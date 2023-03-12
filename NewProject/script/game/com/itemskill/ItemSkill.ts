import { EffectMgr } from '../../manager/EffectMgr';
import { DynamicImage } from '../../base/components/DynamicImage';
import { UtilColor } from '../../../app/base/utils/UtilColor';
import { i18n, Lang } from '../../../i18n/i18n';
import { RES_ENUM } from '../../const/ResPath';

const { ccclass, property } = cc._decorator;
export interface IoptionItemSkill {
    curSkillLv: number, // 当前技能等级 必须传
    openCondition: string, // 开启条件
    sprIconPath: string, // 图标路径

    leftTopFlag?: string, // 是否显示左上角角标 路径 传入则显示，不传不显示
    isSelected?: boolean, // 是否选中
}
@ccclass
export class ItemSkill extends cc.Component {
    @property(DynamicImage)// 图标
    private SprIcon: DynamicImage = null;

    @property(DynamicImage)// 左上角角标
    private SprType: DynamicImage = null;

    @property(cc.Node)// 等级节点 显示当前多少级
    private NdLv: cc.Node = null;
    @property(cc.Label)// 等级节点 显示当前多少级
    private LabLv: cc.Label = null;

    @property(cc.Node)// 是否显示开启条件
    private NdOpen: cc.Node = null;
    @property(cc.Label)// label开启条件
    private LabOpen: cc.Label = null;

    @property(cc.Node)// 选中框
    private NdSelect: cc.Node = null;

    /**
     * @param curSkillLv 当前等级
     * @param openCondition 开启条件描述
     * @param isSelected 是否选中 选中有个选中效果
     * @param cfg 技能Cfg_SkillDesc数据
     */
    public setData(opts: IoptionItemSkill): void {
        const isActive: boolean = !!opts.curSkillLv;// 有等级就代表开启

        this.NdOpen.active = !isActive;// 是否显示开启条件
        this.NdLv.active = isActive;// 显示当前多少级
        UtilColor.setGray(this.SprIcon.node, !isActive);// 激活不置灰

        if (isActive) { // 激活显示等级
            this.LabLv.string = `${opts.curSkillLv}${i18n.lv}`;
        } else { // 未激活显示开启条件
            this.LabOpen.string = opts.openCondition;
        }

        this.SprIcon.loadImage(opts.sprIconPath, 1, true);// 图标

        if (opts && opts.leftTopFlag) { // 左上角角标
            this.SprType.loadImage(opts.leftTopFlag, 1, true);
        }

        // if (cfg) {
        //     this.SprIcon.loadImage(`${RES_ENUM.Skill}${cfg.SkillIconID}`, 1, true);
        //     this.SprType.loadImage(cfg.SkillTag === 2 ? RES_ENUM.Com_Font_Com_Font_Dan : RES_ENUM.Com_Font_Com_Font_Qun, 1, true);
        // }

        // 时否选中
        this.NdSelect.active = opts && opts.isSelected;
    }

    public setSelected(isSelected: boolean): void {
        this.NdSelect.active = isSelected;
    }

    /**
     * @param curLv 当前等级
     * @param openLv 开放等级
     */
    public setActive(curLv: number, openLv: number): void {
        const isActive: boolean = curLv > 0;
        this.NdOpen.active = !isActive;
        this.NdLv.active = isActive;
        if (!isActive) {
            this.LabOpen.string = `${openLv}${i18n.tt(Lang.rskill_opens)}`;
        } else {
            this.LabLv.string = `${curLv}${i18n.lv}`;
        }
        UtilColor.setGray(this.SprIcon.node, !isActive);
    }

    /** 播放升级动画 */
    public showAnim(): void {
        const n = this.node.getChildByName('btnEffect');
        if (!n) {
            EffectMgr.I.showAnim(RES_ENUM.Com_Ui_106, (node: cc.Node) => {
                if (this.node && this.node.isValid) {
                    const eff = this.node.getChildByName('btnEffect');
                    if (eff) {
                        eff.destroy();
                    }
                    this.node.addChild(node);
                    node.name = 'btnEffect';
                }
            }, cc.WrapMode.Normal);
        }
    }
}
