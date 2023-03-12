/*
 * @Author: myl
 * @Date: 2022-10-18 14:25:37
 * @Description:
 */

import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilArray } from '../../../../../app/base/utils/UtilArray';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { UtilGame } from '../../../../base/utils/UtilGame';
import { E } from '../../../../const/EventName';
import { RES_ENUM } from '../../../../const/ResPath';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';
import ModelMgr from '../../../../manager/ModelMgr';
import { SealAmuletQualityItem } from './SealAmuletQualityItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class SealAmuletQualityContentView extends cc.Component {
    @property(cc.Node)
    private starsNd: cc.Node = null;
    @property(cc.Node)
    private skillNd: cc.Node = null;
    @property(DynamicImage)
    private skillIcon: DynamicImage = null;

    @property(cc.Label)
    private skillLvLab: cc.Label = null;

    private _data: OfficeSign = null;
    private _dataConfig: Cfg_SAQuality = null;

    private _skillInfo: {
        skill: string,
        icon: string,
        skillName: string,
        descs: { title: string, data: string }[]
    } = null;
    private _nextSkillInfo: {
        skill: string,
        icon: string,
        skillName: string,
        descs: { title: string, data: string }[]
    } = null;

    private _descInfo: { title: string, data: string } = { title: i18n.tt(Lang.com_up_desc), data: '满级' };
    protected start(): void {
        EventClient.I.on(E.SealAmulet.Quality, this.setUpView, this);
        UtilGame.Click(this.skillNd, () => {
            const descs = UtilArray.Combine(this._skillInfo.descs, this._nextSkillInfo.descs);
            WinMgr.I.open(ViewConst.TipsSkillWin, {
                skillId: 0,
                iconId: this._skillInfo.icon,
                type: 0, // 皮肤技能不用星级
                name: this._skillInfo.skillName,
                level: this._dataConfig.SkillLv,
                unlock: true,
                unlockString: '',
            }, UtilArray.Combine(descs, [this._descInfo]));
        }, this, { scale: 1 });
    }

    public setUpView(data: OfficeSign): void {
        this._data = data;
        const model = ModelMgr.I.SealAmuletModel;
        const maxNum = model.getNumQuality(data.Type, data.RefineLv);
        this.starsNd.destroyAllChildren();
        this.starsNd.removeAllChildren();
        ResMgr.I.showPrefab(UI_PATH_ENUM.Module_SealAmulet_SealAmuletQualityItem, null, (err, nd: cc.Node) => {
            for (let i = 2; i <= maxNum; i++) {
                const nd1 = cc.instantiate(nd);
                this.starsNd.addChild(nd1);
                nd1.getComponent(SealAmuletQualityItem).setState(data.RefineValue < i);
            }
        });
        this.updateSkill();
    }

    /** 技能属性 */
    private updateSkill(): void {
        const model = ModelMgr.I.SealAmuletModel;
        const conf = model.getAttByRefineLv(this._data.Type, this._data.RefineLv, this._data.RefineValue);
        const nextConf = model.getAttByRefineLv(this._data.Type, this._data.RefineLv + 1, this._data.RefineValue);
        this._dataConfig = conf;
        let nextSkillInfo = null;
        if (!nextConf) { // 最大等级
            nextSkillInfo = {
                skill: '',
                icon: '',
                skillName: '',
                descs: [{ title: i18n.tt(Lang.next_property), data: '无' }],
            };
            this._descInfo.data = `${i18n.tt(this._data.Type === 1 ? Lang.seal_title : Lang.amulet_title)}${i18n.tt(Lang.com_max_lv)}`;
        } else {
            nextSkillInfo = ModelMgr.I.SealAmuletModel.GetSkillInfo(nextConf, i18n.tt(Lang.next_property));
            const nameInfo = model.getAttByRefineLv(this._data.Type, this._data.RefineLv + 1, this._data.RefineValue);
            this._descInfo.data = `${i18n.tt(this._data.Type === 1
                ? Lang.seal_title
                : Lang.amulet_title)}${i18n.tt(Lang.up_to)}<color=${UtilColor.GreenD}>${nameInfo.Name}${nameInfo.Stage}${i18n.jie}</c>`;
        }
        const skillInfo = ModelMgr.I.SealAmuletModel.GetSkillInfo(conf, i18n.tt(Lang.cur_property));

        if (!skillInfo.skill) {
            this.skillNd.active = false;
        } else {
            this.skillNd.active = true;
            this.skillIcon.loadImage(`${RES_ENUM.Skill}${skillInfo.icon}`, 1, true);
        }
        this._skillInfo = skillInfo;
        this._nextSkillInfo = nextSkillInfo;

        this.skillLvLab.string = `${conf.SkillLv}${i18n.lv}`;
    }

    protected onDestroy(): void {
        EventClient.I.off(E.SealAmulet.Quality, this.setUpView, this);
    }
}
