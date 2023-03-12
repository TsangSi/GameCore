/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { UtilColor } from '../../../../../../app/base/utils/UtilColor';
import { UtilString } from '../../../../../../app/base/utils/UtilString';
import UtilItem from '../../../../../base/utils/UtilItem';

const { ccclass, property } = cc._decorator;

@ccclass
export class RandomItem extends cc.Component {
    @property(cc.Label)
    private labKey: cc.Label = null;

    @property(cc.Label)
    private labVal: cc.Label = null;

    @property(cc.Node)
    private NdLog: cc.Node = null;
    @property(cc.Node)
    private NdRandom: cc.Node = null;
    @property(cc.Node)
    private SprLightBg: cc.Node = null;
    // @property(cc.Node)
    // private SprDarkBg: cc.Node = null;

    @property(cc.RichText)
    private RTDesc: cc.RichText = null;

    public setData(data: any, isLog: boolean, idx?: number): void {
        this.NdRandom.active = !isLog;
        this.NdLog.active = isLog;
        if (isLog) {
            this.RTDesc.string = UtilString.parseLog(data, false, false, true, true);
        } else {
            this.SprLightBg.active = idx % 2 === 0;
            const item = UtilItem.GetCfgByItemId(data.ItemId);
            this.labKey.string = `${item.Name}X${data.ItemNum}`;
            this.labVal.string = data.OddClient;
            const hex = UtilItem.GetItemQualityColor(data.Quality, false);
            this.labKey.node.color = UtilColor.Hex2Rgba(hex);
            this.labVal.node.color = UtilColor.Hex2Rgba(hex);
        }
    }
}
