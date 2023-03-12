/*
 * @Author: hwx
 * @Date: 2022-07-12 12:03:56
 * @FilePath: \SanGuo\assets\script\game\module\grade\v\GradeSkillItem.ts
 * @Description: 进阶技能项
 */
import { UtilCocos } from '../../../../app/base/utils/UtilCocos';
import BaseCmp from '../../../../app/core/mvc/view/BaseCmp';
import { i18n, Lang } from '../../../../i18n/i18n';
import { DynamicImage } from '../../../base/components/DynamicImage';
import UtilRedDot from '../../../base/utils/UtilRedDot';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class GradeSkillItem extends BaseCmp {
    @property(DynamicImage)
    private SprBg: DynamicImage = null;

    @property(DynamicImage)
    private SprIcon: DynamicImage = null;

    @property(cc.Node)
    private NdStar: cc.Node = null;

    @property(cc.Sprite)
    private SprStar: cc.Sprite = null;

    @property(cc.Label)
    private LabStar: cc.Label = null;

    @property(cc.Node)
    private NdLockDesc: cc.Node = null;

    @property(cc.Label)
    private LabLockDesc: cc.Label = null;

    @property(cc.Node)
    private NdActive: cc.Node = null;

    public get clickNd(): cc.Node {
        return this.SprBg.node;
    }

    public init(...param: unknown[]): void {
        const info = param[0] as {
            quality: number,
            iconId: number,
            level: number,
            isStar: boolean,
            lockDesc: string,
            redId: number
            isActive: boolean,
        };
        this.setInfo(info);
    }

    public setInfo(info: {
        quality: number,
        iconId: number,
        level: number,
        isStar: boolean,
        lockDesc?: string,
        redId?: number
        isActive?: boolean,
    }): void {
        const quality = info.quality;
        if (quality) {
            this.SprBg.loadImage(`${RES_ENUM.Com_Bg_Com_Bg_Skill}${quality}`, 1, true);
        } else {
            this.SprBg.loadImage(RES_ENUM.Com_Img_Com_Img_Jinengkuang);
        }

        this.SprIcon.loadImage(`${RES_ENUM.Skill}${info.iconId}`, 1, true);

        if (info.redId) {
            UtilRedDot.Bind(info.redId, this.node, cc.v2(40, 40));
        } else {
            UtilRedDot.Unbind(this.node);
        }

        this.NdActive.active = !!info.isActive;
        // 激活态其他东西可以不显示，都是默认隐藏就不管了
        if (info.isActive) {
            this.SprStar.node.active = false;
            this.NdStar.active = false;
            this.NdLockDesc.active = false;
            UtilCocos.SetSpriteGray(this.SprIcon.node, true);
            return;
        }

        this.SprStar.node.active = !!info.isStar;
        const level = info.level;
        if (level) {
            UtilCocos.SetSpriteGray(this.SprIcon.node, false);
            if (level === -1) {
                this.LabStar.node.active = false;
            } else {
                this.LabStar.string = info.isStar ? `${level}` : `${i18n.tt(Lang.com_dengji)}:${level}`;
            }
        } else {
            UtilCocos.SetSpriteGray(this.SprIcon.node, true);
            this.LabLockDesc.string = info.lockDesc;
        }
        this.SprStar.node.active = !!info.isStar;
        this.NdStar.active = !!level;
        this.NdLockDesc.active = !level;
    }
}
