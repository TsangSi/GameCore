/*
 * @Author: kexd
 * @Date: 2023-02-17 11:19:29
 * @FilePath: \SanGuo2.4\assets\script\game\module\funcPreview\FuncPreviewVoCfg.ts
 * @Description:
 *
 */

import { PopupType } from '../../../app/core/mvc/BaseVo';
import { GameLayerEnum } from '../../../app/core/mvc/WinConst';
import WinMgr from '../../../app/core/mvc/WinMgr';
import WinBase from '../../com/win/WinBase';
import { ControllerIds } from '../../const/ControllerIds';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { ViewConst } from '../../const/ViewConst';

WinMgr.I.addConfig({
    id: ViewConst.FuncOpenWin,
    layerType: GameLayerEnum.POP_LAYER,
    prefabPath: UI_PATH_ENUM.FuncOpenWin,
    mid: ControllerIds.FuncPreviewController,
    isPopup: PopupType.Last,
    isShowAll: true,
    resClass: (node: cc.Node): WinBase => node.getComponent('FuncOpenWin') as WinBase,
});
