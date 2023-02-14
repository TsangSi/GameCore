import {
    _decorator,
} from 'cc';
import { EventM } from './core/event/EventM';
import { ComBase } from './core/base/ComBase';
import SceneMapManager from './map/SceneMapManager';
import { UI_NAME } from './ui/UIConfig';
import UIManager from './ui/UIManager';

const { ccclass } = _decorator;

@ccclass('Main')
export class Main extends ComBase {
    protected onLoad(): void {
        this.on(EventM.Type.Update.Success, this.onUpdateSuccess, this);
    }
    protected start(): void {
        UIManager.I.initUI(this.node);
        UIManager.I.show(UI_NAME.UpdateWin);
    }

    private onUpdateSuccess() {
        SceneMapManager.I.enterMap = true;
        this.node.parent.getChildByName('SceneMap').active = true;
        SceneMapManager.I.startEnterMap();
    }

    // protected onDestroy(): void {
    //     EventM.I.off(EventM.Type.Login.LoginSuccess, this.onLoginSuccess, this);
    // EventM.I.off(EventM.Type.SceneMap.FirstLoadComplete, this.onFirstLoadComplete, this);
    // }
}
