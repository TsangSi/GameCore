/*
 * @Author: dcj
 * @Date: 2022-12-03 09:54:36
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\collectionBook\v\CollectionAttrUpWin.ts
 * @Description:
 */
import { UtilNum } from '../../../../app/base/utils/UtilNum';
import BaseUiView from '../../../../app/core/mvc/view/BaseUiView';
import { EAttrShowType, IAttrBase } from '../../../base/attribute/AttrConst';
import { DynamicImage, ImageType } from '../../../base/components/DynamicImage';
import { Config } from '../../../base/config/Config';
import { UtilAttr } from '../../../base/utils/UtilAttr';
import { UtilGame } from '../../../base/utils/UtilGame';
import UtilItemList from '../../../base/utils/UtilItemList';
import { RES_ENUM } from '../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CollectionAttrUpWin extends BaseUiView {
    @property(cc.Label)
    private oldName: cc.Label = null;
    @property(cc.Label)
    private nowName: cc.Label = null;
    @property(DynamicImage)
    private oldIcon: DynamicImage = null;
    @property(DynamicImage)
    private nowIcon: DynamicImage = null;
    @property(cc.RichText)
    private oldAttr: cc.RichText = null;
    @property(cc.RichText)
    private nowAttr: cc.RichText = null;
    @property(cc.Node)
    private NodeItem: cc.Node = null;
    public init(param: any[]): void {
        const oldLevel = param[0] as number;
        const nowLevel = param[1] as number;
        const oldCfg: Cfg_CollectionBookLevel = Config.Get(Config.Type.Cfg_CollectionBookLevel).getValueByKey(oldLevel);
        const nowCfg: Cfg_CollectionBookLevel = Config.Get(Config.Type.Cfg_CollectionBookLevel).getValueByKey(nowLevel);
        this.oldIcon.loadImage(`${RES_ENUM.CollectionBook_Icon_Jianwen_Dengji}${UtilNum.FillZero(+oldCfg.AnimId, 2)}`, ImageType.PNG, true);
        this.nowIcon.loadImage(`${RES_ENUM.CollectionBook_Icon_Jianwen_Dengji}${UtilNum.FillZero(+nowCfg.AnimId, 2)}`, ImageType.PNG, true);
        this.oldName.string = oldCfg.Name;
        this.nowName.string = nowCfg.Name;
        let oldAttrBase: IAttrBase[] = UtilAttr.GetAttrBaseListById(oldCfg.AttrId);
        const nowAttrBase: IAttrBase[] = UtilAttr.GetAttrBaseListById(nowCfg.AttrId);
        // let oldAttrId = oldCfg.AttrId;
        if (oldAttrBase.length === 0) {
            oldAttrBase = UtilAttr.GetAttrBaseListById(nowCfg.AttrId);
            oldAttrBase.forEach((v) => {
                v.value = 0;
            });
        }
        this.oldAttr.string = UtilAttr.GetShowAttrStr(oldAttrBase, EAttrShowType.SpaceAndColon);
        this.nowAttr.string = UtilAttr.GetShowAttrStr(nowAttrBase, EAttrShowType.SpaceAndColon);
        // const item = nowCfg.DropReward.split(':');
        UtilItemList.ShowItems(this.NodeItem, nowCfg.DropReward, { option: { needNum: true } });
        UtilGame.Click(this.node, 'SprBlack', this.close, this);
    }
}
