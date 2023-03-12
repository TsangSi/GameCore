/*
 * @Author: myl
 * @Date: 2022-09-19 09:56:07
 * @Description:
 */
import { UtilColor } from '../../../../app/base/utils/UtilColor';
import ModelMgr from '../../../manager/ModelMgr';
import { GameLevelInfoModel, GameLevelState } from '../GameLevelConst';

const { ccclass, property } = cc._decorator;

@ccclass
export class GameLevelItem extends cc.Component {
    /** 未通关 */
    @property(cc.Node)
    private StateNd1: cc.Node = null;
    /** 正在关 */
    @property(cc.Node)
    private StateNd2: cc.Node = null;
    /** 已通关 */
    @property(cc.Node)
    private StateNd3: cc.Node = null;

    /** 关卡名称 */
    @property(cc.Label)
    private NameInfoLab: cc.Label = null;

    /** 战力信息 */
    @property(cc.Label)
    private powerInfoLab: cc.Label = null;
    @property(cc.Node)
    private NdTip: cc.Node = null;
    @property(cc.Sprite)
    private SprName: cc.Sprite = null;

    protected start(): void {
        // [3]
    }

    private _data: GameLevelInfoModel = null;

    public setData(data: GameLevelInfoModel): void {
        this._data = data;
        this.StateNd1.active = data.state === GameLevelState.unpass;
        this.StateNd2.active = data.state === GameLevelState.passing;
        this.StateNd3.active = data.state === GameLevelState.passed;
        const info = ModelMgr.I.GameLevelModel.userPassingLevInfo();
        this.NameInfoLab.string = `${data.nameInfo.Name}${data.state === GameLevelState.passing ? ` ${info.chapter}-${info.level}` : ''}`;
        this.NdTip.active = data.state === GameLevelState.passing;
        UtilColor.setGray(this.SprName.node, data.state === GameLevelState.unpass)

        // // 推荐战力显示(通过怪物等级和boss属性 去怪物表中找战力)
        // if (data.state === GameLevelState.passing) {
        //     const indexer: ConfigStageIndexer = Config.Get(Config.Type.Cfg_Stage);
        //     const chapterInfo = indexer.getStageConfByLv();
        this.powerInfoLab.string = ModelMgr.I.GameLevelModel.getNominateFv(data.infoChapter);
        // }
    }
}
