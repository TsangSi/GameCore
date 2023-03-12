import { ResMgr } from '../../../../app/core/res/ResMgr';
import { ACTION_TYPE, ANIM_TYPE } from '../../../base/anim/AnimCfg';
import { Config } from '../../../base/config/Config';
import { ConfigBeautyIndexer } from '../../../base/config/indexer/ConfigBeautyIndexer';
import { UtilGame } from '../../../base/utils/UtilGame';
import EntityCfg from '../../../entity/EntityCfg';
import EntityUiMgr from '../../../entity/EntityUiMgr';
import { BeautySkill } from '../com/BeautySkill';
import { BeautyInfo, IBeauty } from '../BeautyInfo';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { EAttrShowType } from '../../../base/attribute/AttrConst';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import UtilItem from '../../../base/utils/UtilItem';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import WinBase from '../../../com/win/WinBase';
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { ItemQuality } from '../../../com/item/ItemConst';
import { UtilColorFull } from '../../../base/utils/UtilColorFull';

/*
 * @Author: zs
 * @Date: 2022-11-09 11:48:02
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\beauty\v\BeautyTipsView.ts
 * @Description: 查看他人红颜的tips
 *
 */
const { ccclass, property } = cc._decorator;
@ccclass
export class BeautyTipsView extends WinBase {
    // public getTabData(): IWinTabData[] {
    // throw new Error('Method not implemented.');
    // }
    // public initWin(...param: unknown[]): void {
    // throw new Error('Method not implemented.');
    // }
    /** 关闭按钮 */
    @property(cc.Node)
    private NodeClose: cc.Node = null;
    /** 模型节点 */
    @property(cc.Node)
    private NodeAnim: cc.Node = null;
    /** 名字 */
    @property(cc.Label)
    private LabelName: cc.Label = null;
    /** 品质 */
    @property(DynamicImage)
    private SpriteQuality: DynamicImage = null;
    /** 战力 */
    @property(cc.Label)
    private LabelFV: cc.Label = null;
    /** 技能容器节点 */
    @property(cc.Node)
    private NodeSkillContent: cc.Node = null;
    /** 属性富文本 */
    @property(cc.RichText)
    private RichAttr: cc.RichText = null;
    /** 星级 */
    @property(cc.Label)
    private LabelStar: cc.Label = null;

    public init(param: any[]): void {
        // console.log('param=', param);
        const beauty = param[0] as IBeauty;
        this.setData(beauty.BeautyId, beauty.Star, beauty.Level);
    }

    protected start(): void {
        super.start();
        UtilGame.Click(this.NodeClose, this.close, this, { scale: 0.9 });
        UtilGame.Click(this.node.getChildByName('SprBlack'), this.close, this);
    }

    public setData(id: number, star: number, level: number): void {
        const animId = EntityCfg.I.getBeautySkinResId(id);
        if (animId) {
            EntityUiMgr.I.createAnim(this.NodeAnim, animId, ANIM_TYPE.PET, ACTION_TYPE.UI);
        }
        // eslint-disable-next-line max-len
        const cfgStar = Config.Get<ConfigBeautyIndexer>(Config.Type.Cfg_Beauty).getValueByKeyFromStar(id, star, {
            SkillId: '', PassiveSkills: '',
        });
        const cfg = Config.Get<ConfigBeautyIndexer>(Config.Type.Cfg_Beauty).getValueByKey(id, { Name: '', Quality: 0 });
        if (!cfg) { return; }
        let skills: string[] = [];
        const pskills = cfgStar.PassiveSkills.split('|');
        skills = skills.concat(cfgStar.SkillId).concat(pskills);
        this.showSkill(id, skills);

        this.showAttr(id, star, level);

        this.LabelName.string = cfg.Name;
        UtilColorFull.resetMat(this.LabelName);
        if (cfg.Quality === ItemQuality.COLORFUL) {
            UtilColorFull.setColorFull(this.LabelName, false);
        } else {
            const hex = UtilItem.GetItemQualityColor(cfg.Quality, false);
            this.LabelName.node.color = UtilColor.Hex2Rgba(hex);
        }
        const path = UtilItem.GetItemQualityFontImgPath(cfg.Quality, true);
        this.SpriteQuality.loadImage(path, ImageType.PNG, true);
        this.LabelStar.string = `${star}`;
    }

    /**
     * 显示技能
     * @param id 红颜id
     * @param skills 显示的技能列表
     */
    private showSkill(id: number, skills: string[]) {
        if (this.NodeSkillContent.childrenCount === 0) {
            ResMgr.I.loadLocal(UI_PATH_ENUM.Module_Beauty_Com_BeautySkill, cc.Prefab, (e, p: cc.Prefab) => {
                let skill: string[] = [];
                for (let i = 0, n = skills.length; i < n; i++) {
                    skill = skills[i].split(':');
                    if (skill) {
                        const child = cc.instantiate(p);
                        child.getComponent(BeautySkill).setData(id, i, +skill[0], +skill[1], true);
                        this.NodeSkillContent.addChild(child);
                    }
                }
            });
        }
    }

    /**
     *
     * @param id 红颜id
     * @param star 星级
     * @param level 等级
     */
    private showAttr(id: number, star: number, level: number) {
        const info: IBeauty = {
            BeautyId: id,
            Level: level,
            LevelExp: 0,
            Star: star,
        };
        const b = new BeautyInfo(info);
        const str = UtilAttr.GetShowAttrStr(b.attrInfo.attrs, EAttrShowType.Colon);
        this.RichAttr.string = str;
        this.LabelFV.string = b.fightValue.toString();
    }
}
