/*
 * @Author: wangxin
 * @Date: 2022-11-03 18:17:33
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\boss\v\win\BossInspireWin.ts
 */
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { Config } from '../../../../base/config/Config';
import { UtilGame } from '../../../../base/utils/UtilGame';
import UtilItem from '../../../../base/utils/UtilItem';
import ItemModel from '../../../../com/item/ItemModel';
import { WinCmp } from '../../../../com/win/WinCmp';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { BagMgr } from '../../../bag/BagMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BossInspireWin extends WinCmp {
    @property(cc.Label)
    private LbEffect: cc.Label = null;

    @property(cc.Label)
    private LbTime: cc.Label = null;
    @property(cc.Label)
    private LbEffectMax: cc.Label = null;

    @property(cc.Label)
    private LbTimeMax: cc.Label = null;
    @property(cc.RichText)
    private RhExp: cc.RichText = null;

    @property(cc.Label)
    private LbUseNum: cc.Label = null;

    @property(DynamicImage)
    private DyIcon: DynamicImage = null;

    @property(cc.Node)
    private BtnClick: cc.Node = null;
    // onLoad () {}

    public init(param: unknown[]): void {
        super.init(param);
        const nowNum = ModelMgr.I.BossModel.getInspireTimes();// param[1] as number;
        const indexer = Config.Get(Config.Type.Cfg_Boss_Config);
        const attk: string = indexer.getValueByKey('MultiBossAddAtt', 'Value');
        const effecMax: string = indexer.getValueByKey('MultiBossMaxAtt', 'Value');
        const time: string = indexer.getValueByKey('MultiBossAddSeconds', 'Value');
        let leftTime = ModelMgr.I.BossModel.getInspireLeftTime();
        const limiet: string = leftTime > 900 ? '900' : leftTime.toString();
        this.LbTime.string = limiet;
        if (leftTime > 0) {
            this.schedule(() => {
                const limiet: string = leftTime > 900 ? '900' : leftTime.toString();
                this.LbTime.string = `${limiet}${i18n.tt(Lang.com_second)}`;
                leftTime -= 1;
                if (leftTime < 0) {
                    // 时间到了没续
                    this.LbEffect.string = `${i18n.tt(Lang.com_attr_2_name)}+0%`;
                    this.LbTime.string = `0${i18n.tt(Lang.com_second)}`;
                    this.unscheduleAllCallbacks();
                }
            }, 1);
        } else {
            this.LbTime.string = `0${i18n.tt(Lang.com_second)}`;
        }
        const maxlimiet = indexer.getValueByKey('MultiBossTimeLimit', 'Value');
        const attkNum = parseInt(attk) / 10000 * 100;

        this.RhExp.string = UtilString.FormatArray(
            i18n.tt(Lang.com_inspire),
            [attkNum.toString(), time, UtilColor.NorV, UtilColor.GreenV],
        );

        this.LbEffect.string = `${i18n.tt(Lang.com_attr_2_name)}+${attkNum * nowNum <= 100 ? attkNum * nowNum : 100}% `;
        this.LbEffectMax.string = UtilString.FormatArray(
            i18n.tt(Lang.beaconWar_max),
            [`${parseInt(effecMax) / 10000 * 100}%`],
        );
        this.LbTimeMax.string = UtilString.FormatArray(
            i18n.tt(Lang.beaconWar_max),
            [`${maxlimiet}${i18n.tt(Lang.com_second)}`],
        );
        const itemPath: string = indexer.getValueByKey('MultiBossInspireCost', 'Value');
        const itemData: [number, number] = UtilItem.ParseItemStr(itemPath);
        this.LbUseNum.string = itemData[1].toString();
        this.DyIcon.loadImage(UtilItem.GetItemIconPath(`${itemData[0].toString()}_h`), 1, true);
        const myItem = BagMgr.I.getItemNum(itemData[0]);
        this.LbUseNum.node.color = myItem >= Number(itemData[1]) ? UtilColor.Nor() : UtilColor.Red();
        UtilGame.Click(this.BtnClick, () => {
            // 元宝数量检查
            ControllerMgr.I.BossController.reqC2SMultiBossInspire();
            this.close();
        }, this);
    }

    protected start(): void {
        super.start();
    }
    // update (dt) {}
}
