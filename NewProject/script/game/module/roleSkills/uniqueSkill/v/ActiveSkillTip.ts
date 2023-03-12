/*
 * @Author: hrd
 * @Date: 2022-10-17 15:38:16
 * @Description:
 *
 */

import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { UtilSkillInfo } from '../../../../base/utils/UtilSkillInfo';
import WinBase from '../../../../com/win/WinBase';
import { RES_ENUM } from '../../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class ActiveSkillTip extends WinBase {
    //
    @property(cc.Node)
    private NdSprMask: cc.Node = null;

    @property(cc.Label)
    private LabName: cc.Label = null;

    // 技能描述
    @property(cc.RichText)
    private rtDesc: cc.RichText = null;

    @property(DynamicImage)
    private SprIcon: DynamicImage = null;

    @property(DynamicImage)
    public SprTitle: DynamicImage = null;

    protected start(): void {
        super.start();
        UtilGame.Click(this.NdSprMask, () => {
            this.close();
        }, this, { scale: 1 });
    }

    public init(params: unknown[]): void {
        const skillId = params[0] as number;
        if (skillId) {
            const skillCfg: Cfg_SkillDesc = UtilSkillInfo.GetCfg(skillId);
            const skillDes = UtilSkillInfo.GetSkillDesc(skillCfg);
            this.setInfo(skillCfg.SkillName, skillDes, skillCfg.SkillIconID);
            this.setTitleImg(RES_ENUM.Com_Font_Com_Font_Jhjx);
        }
        const planeInfo = params[1] as { skillName: string, skillDesc: string, skillId, imgUrl?: string };
        if (planeInfo) {
            // 硬启动 非绝学激活，直接传参数
            this.setInfo(planeInfo.skillName, planeInfo.skillDesc, planeInfo.skillId);
            if (planeInfo.imgUrl) this.setTitleImg(planeInfo.imgUrl);
        }
    }

    public setInfo(skillName: string, skillDesc: string, skillId: number): void {
        // 技能描述
        this.rtDesc.string = `<color=${UtilColor.WhiteD}> ${skillDesc}</c>`;
        // 技能名称
        this.LabName.string = skillName;
        // 技能图标
        this.SprIcon.loadImage(`${RES_ENUM.Skill}${skillId}`, 1, true);
    }

    // 设置标题图片
    public setTitleImg(imgUrl: string, type: number = 0, remote: boolean = false): void {
        this.SprTitle.loadImage(imgUrl, type, remote);
    }
}
