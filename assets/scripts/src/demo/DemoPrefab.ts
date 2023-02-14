
import { _decorator, Component, Node, SpriteFrame, Sprite } from 'cc';
import { AssetType, ResManager } from '../core/ResManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = DemoPrefab
 * DateTime = Mon Mar 28 2022 15:53:09 GMT+0800 (中国标准时间)
 * Author = zengsi
 * FileBasename = DemoPrefab.ts
 * FileBasenameNoExtension = DemoPrefab
 * URL = db://assets/app/src/demo/DemoPrefab.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('DemoPrefab')
export class DemoPrefab extends Component {
    start () {

    }

    onPngClicked() {
        ResManager.I.loadRemote('i/com/prev/banner_feishengqianggou', AssetType.SpriteFrame, (e, res: SpriteFrame) => {
            const sNode = this.node.getChildByName('Png');
            let sp = sNode.getComponent(Sprite);
            sp.spriteFrame = res;
        });
    }

    onCloseClicked() {
        this.node.destroy();
    }

}