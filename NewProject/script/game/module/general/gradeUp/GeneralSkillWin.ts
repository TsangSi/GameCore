/* eslint-disable max-len */
/*
 * @Author: kexd
 * @Date: 2022-09-26 20:59:46
 * @FilePath: \SanGuo2.4\assets\script\game\module\general\gradeUp\GeneralSkillWin.ts
 * @Description:
 *
 */
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import { Config } from '../../../base/config/Config';
import { UtilGame } from '../../../base/utils/UtilGame';
import SkillTopPart, { TipsSkillInfo } from '../../../com/tips/skillPart/SkillTopPart';
import WinBase from '../../../com/win/WinBase';
import { GeneralMsg } from '../GeneralConst';
import ModelMgr from '../../../manager/ModelMgr';
import { UtilSkillInfo } from '../../../base/utils/UtilSkillInfo';
import { UtilString } from '../../../../app/base/utils/UtilString';
import { UtilRichString } from '../../../../app/base/utils/UtilRichString';

const { ccclass, property } = cc._decorator;

@ccclass
export class GeneralSkillWin extends WinBase {
    @property(SkillTopPart)
    private SkillTopPart: SkillTopPart = null;
    @property(cc.Node)
    protected NdAttrContent: cc.Node = null;
    @property(cc.Node)
    private SvItem: cc.Node = null;
    @property(cc.Node)
    private NdItem: cc.Node = null;
    //
    @property(cc.Node)
    private NdDesc: cc.Node = null;

    protected start(): void {
        super.start();

        UtilGame.Click(this.node.getChildByName('BsBG'), () => {
            this.close();
        }, this, { scale: 1 });
    }

    public init(args: unknown[]): void {
        const skillInfo: TipsSkillInfo = args[0] as TipsSkillInfo;
        this.SkillTopPart.setSkillInfo(skillInfo);

        const curData: GeneralMsg = args[1] as GeneralMsg;
        this.setAttrData(curData, skillInfo.skillId, skillInfo.level);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }

    public setAttrData(data: GeneralMsg, skillId: number, skillLv: number): void {
        let item: cc.Node = null;
        let parent: cc.Node = null;
        if (!data) return;
        if (!data.cfg) {
            data.cfg = Config.Get(Config.Type.Cfg_General).getValueByKey(data.generalData.IId);
        }
        const maxGrade = ModelMgr.I.GeneralModel.getMaxGradeUp(data.cfg.Rarity);
        // 小于10行就用layout，否则用scrollview
        if (maxGrade > 10) {
            this.SvItem.active = true;
            this.NdAttrContent.active = false;
            parent = this.NdItem;
        } else {
            this.SvItem.active = false;
            this.NdAttrContent.active = true;
            parent = this.NdAttrContent;
        }
        const indexer = Config.Get(Config.Type.Cfg_GeneralGradeUp);
        let grade: number = 0;
        let curCfg: Cfg_GeneralGradeUp = indexer.getValueByKey(data.cfg.Rarity, grade);
        let name: string = '';
        let des: string = '';
        let curLv: number = -1;
        while (curCfg) {
            const cur = +curCfg.TallentSkillLv;
            if (curLv !== cur) {
                curLv = cur;

                if (grade === 0) {
                    name = `【${data.cfg.Name}】：`;
                } else {
                    name = `【${data.cfg.Name}+${grade}】：`;
                }
                const skillDes = UtilSkillInfo.GetSkillDesc(skillId, curLv || 1);
                des = this.replaceColor(skillDes);

                item = cc.instantiate(this.NdDesc);
                item.active = true;
                item.setPosition(0, -20);
                parent.addChild(item);

                const LabName = item.getChildByName('LabName');
                const RichDesc = item.getChildByName('RichDesc');

                // const color: cc.Color = data.generalData.Grade >= grade ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.WhiteD);
                const color: cc.Color = skillLv >= curLv ? UtilColor.Hex2Rgba(UtilColor.GreenV) : UtilColor.Hex2Rgba(UtilColor.WhiteD);

                LabName.getComponent(cc.Label).string = name;
                LabName.color = color;
                RichDesc.getComponent(cc.RichText).string = skillLv >= curLv ? `<color=${UtilColor.GreenV}>${des}</color>` : `<color=${UtilColor.WhiteD}>${des}</color>`;

                const conf = {
                    fSize: 22,
                    maxWidth: 330,
                    lineHeight: 26,
                    richString: des,
                };
                const vSize: cc.Size = UtilRichString.NormalRichStringSize(conf);
                const richSize = RichDesc.getContentSize();
                item.setContentSize(cc.size(vSize.width, Math.max(vSize.height, richSize.height)));

                // console.log('vSize=', vSize, item.width, item.height, 'richSize=', richSize);
            }

            grade++;
            curCfg = indexer.getValueByKey(data.cfg.Rarity, grade);
        }
    }

    private replaceColor(str: string): string {
        // return str.replace(/<color=#([a-zA-Z0-9]+)>/gm, (sub, idx) => color);
        str = str.replace(/<color=#([a-zA-Z0-9]+)>/gm, '');
        return UtilString.replaceAll(str, '</c>', '');
    }
}
