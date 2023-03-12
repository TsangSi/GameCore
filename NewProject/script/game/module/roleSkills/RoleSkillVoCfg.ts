/*
 * @Author: kexd
 * @Date: 2022-06-15 11:54:18
 * @FilePath: \SanGuo\assets\script\game\module\roleSkills\RoleSkillVoCfg.ts
 * @Description:
 *
 */

import BaseUiView from '../../../app/core/mvc/view/BaseUiView';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import WinBase from '../../com/win/WinBase';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.RoleSkillPage,
    layerType: GameLayerEnum.DEFAULT_LAYER,
    prefabPath: UI_PATH_ENUM.RoleSkillPage,
    mid: ControllerIds.RoleSkillController,
    resClass: (node: cc.Node): BaseUiView => node.getComponent('RoleSkillPage') as BaseUiView,
});
