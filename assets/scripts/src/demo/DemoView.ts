
import { _decorator, Component, Node, SpriteFrame, Sprite, Prefab, instantiate, Texture2D } from 'cc';
import { AssetType, BundleType, ResManager } from '../core/ResM';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = DemoView
 * DateTime = Mon Mar 28 2022 14:26:36 GMT+0800 (中国标准时间)
 * Author = zengsi
 * FileBasename = DemoView.ts
 * FileBasenameNoExtension = DemoView
 * URL = db://assets/app/src/ui/login/DemoView.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('DemoView')
export class DemoView extends Component {

    start () {
    }
    /** 远程加载png */
    onButtonPngClicked() {
        ResManager.I.loadRemote('i/com/prev/banner_feishengqianggou', AssetType.SpriteFrame, (e, res: SpriteFrame) => {
            const sNode = this.node.getChildByName('Png');
            let sp = sNode.getComponent(Sprite);
            sp.spriteFrame = res;
        });
    }

    /** 远程加载jpg */
    onButtonJpgClicked() {
        ResManager.I.loadRemote('i/com/prev/bg_xianyuanfuben.jpg', AssetType.SpriteFrame, (e, res: SpriteFrame) => {
            const sNode = this.node.getChildByName('Jpg');
            let sp = sNode.getComponent(Sprite);
            sp.spriteFrame = res;
        });
    }

    /** 加载指定bundle的一个spriteFrame or texture */
    onButtonImgClicked() {
        const loadTexture2D = true;
        if (loadTexture2D) {
            ResManager.I.loadFromBundle(BundleType.default, 'res/demo/btn_duobaoge', Texture2D, (e, res: Texture2D) => {
                const sNode = this.node.getChildByName('Sprite');
                let sp = sNode.getComponent(Sprite);
                if (sp.spriteFrame) {
                    sp.spriteFrame.decRef();
                    sp.spriteFrame = null;
                }
                const spriteframe = new SpriteFrame();
                spriteframe.texture = res;
                sp.spriteFrame = spriteframe;
            });
        } else {
            ResManager.I.loadFromBundle(BundleType.default, 'res/demo/btn_duobaoge', SpriteFrame, (e, res: SpriteFrame) => {
                const sNode = this.node.getChildByName('Sprite');
                let sp = sNode.getComponent(Sprite);
                sp.spriteFrame = res;
            });
        }
    }

    /** 加载指定bundle的一个prefab */
    onButtonPrefabClicked() {
        ResManager.I.loadFromBundle(BundleType.default, 'prefabs/demo/DemoPrefab', Prefab, (e, res: Prefab) => {
            this.node.addChild(instantiate(res));
        });
    }

}
