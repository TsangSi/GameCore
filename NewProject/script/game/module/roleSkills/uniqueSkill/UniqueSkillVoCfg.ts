import { GameLayerEnum } from '../../../../app/core/mvc/WinConst';
import WinMgr from '../../../../app/core/mvc/WinMgr';
import WinBase from '../../../com/win/WinBase';
import { ControllerIds } from '../../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../../const/UIPath';
import { ViewConst } from '../../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.ActiveSkillTip,
    layerType: GameLayerEnum.TIPS_LAYER,
    prefabPath: UI_PATH_ENUM.ActiveSkillTip,
    mid: ControllerIds.RoleSkinController,
    isShowAll: false,
    resClass: (node: cc.Node): WinBase => node.getComponent('ActiveSkillTip') as WinBase,
});
