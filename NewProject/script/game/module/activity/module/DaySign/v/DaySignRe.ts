/*
 * @Author: wangxin
 * @Date: 2022-09-29 20:45:35
 * @FilePath: \SanGuo2.4\assets\script\game\module\activity\module\DaySign\v\DaySignRe.ts
 */
import { UtilColor } from '../../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../../app/base/utils/UtilString';
import { i18n, Lang } from '../../../../../../i18n/i18n';
import { Config } from '../../../../../base/config/Config';
import MsgToastMgr from '../../../../../base/msgtoast/MsgToastMgr';
import { UtilGame } from '../../../../../base/utils/UtilGame';
import UtilItem from '../../../../../base/utils/UtilItem';
import { ItemIcon } from '../../../../../com/item/ItemIcon';
import { WinCmp } from '../../../../../com/win/WinCmp';
import ControllerMgr from '../../../../../manager/ControllerMgr';
import ModelMgr from '../../../../../manager/ModelMgr';
import { BagMgr } from '../../../../bag/BagMgr';

const { ccclass, property } = cc._decorator;

@ccclass
export class DaySignRe extends WinCmp {
    @property(ItemIcon)
    private NdGet: ItemIcon = null;
    @property(ItemIcon)
    private NdNeed: ItemIcon = null;
    @property(cc.RichText)
    private RichNum: cc.RichText = null;
    @property(cc.Node)
    private NdBtn: cc.Node = null;
    @property(cc.Label)
    private Lbused: cc.Label = null;
    protected start(): void {
        super.start();
    }

    public init(param: unknown): void {
        super.init(param);

        const ActFuncId = param[0] as number;
        const sigDay = param[1] as number;
        const itemId = param[2] as number;
        const itemNum = param[3] as number;

        ModelMgr.I.ActivityModel.getConfig(ActFuncId, Config.Type.Cfg_Server_DailySignConst, () => {
            const indexer = Config.Get(Config.Type.Cfg_Server_DailySignConst);
            const signConst: string = indexer.getValueByKey('RemedyCost', 'CfgValue');

            // console.log('DaySignRe-------------signConst=', signConst);

            const cost = signConst.split(':');
            const GetItemI = parseInt(cost[0]);
            const GetItemN = parseInt(cost[1]);
            const GetItemM = UtilItem.NewItemModel(GetItemI, GetItemN);

            this.NdGet.setData(UtilItem.NewItemModel(itemId, itemNum), { needNum: true });
            this.NdNeed.setData(GetItemM, { needNum: false });
            const bagN = BagMgr.I.getItemNum(GetItemI);
            const color = GetItemN <= bagN ? UtilColor.GreenV : UtilColor.RedD;
            this.RichNum.string = `<color=${UtilColor.NorV}>(<color=${color}>${bagN}</color>/${GetItemN})</color>`;
            this.Lbused.string = UtilString.replaceAll(i18n.tt(Lang.day_resign_tips), '<1>', GetItemN.toString());

            const NdRed = this.NdBtn.getChildByName('NdRed');
            NdRed.active = bagN >= GetItemN;

            UtilGame.Click(this.NdBtn, () => {
                if (GetItemN > bagN) {
                    const str = GetItemM.cfg.Name + i18n.tt(Lang.not_enough);
                    MsgToastMgr.Show(str);
                } else {
                    ControllerMgr.I.DaySignController.reqC2SPlayerRemedySignIn(ActFuncId, sigDay);
                }

                this.close();
            }, this);
        }, this);
    }

    protected onDestroy(): void {
        super.onDestroy();
    }
}
