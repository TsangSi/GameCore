/*
 * @Author: zs
 * @Date: 2022-06-15 17:45:56
 * @FilePath: \SanGuo2.4-zengsi\assets\script\game\com\win\WinCmp.ts
 * @Description:
 *
 */
import BaseCmp from '../../../app/core/mvc/view/BaseCmp';
import { WinSmall } from './WinSmall';

const { ccclass, property } = cc._decorator;

@ccclass
export class WinCmp extends BaseCmp {
    public winSmall: WinSmall;
    private NodePre: cc.Node = null;
    private _isPre: boolean = false;
    @property(cc.Boolean)
    private set isPre(b) {
        if (this._isPre === b) {
            return;
        }
        this._isPre = b;
        if (this._isPre) {
            this.showPre();
        } else {
            this.NodePre.destroy();
            this.node.removeChild(this.NodePre);
            this.NodePre = null;
        }
    }
    private get isPre(): boolean {
        return this._isPre;
    }

    private showPre() {
        if (!this.NodePre) {
            this.NodePre = this.node.getChildByName('NodePre');
        }
        if (!this.NodePre) {
            this.NodePre = new cc.Node('NodePre');
            this.node.addChild(this.NodePre);

            // const thisTransform = this.node.getComponent(UITransform);
            // const transform = this.NodePre.addComponent(UITransform);
            this.NodePre.width = this.node.width;
            this.NodePre.height = this.node.height;

            const sprite = this.NodePre.addComponent(cc.Sprite);
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            sprite.type = cc.Sprite.Type.SLICED;

            // this.NodePre.layer = this.node.layer;  //编辑器预览功能先注释
            this.NodePre.setSiblingIndex(0);
            // Editor.Message.send('scene', 'set-property', {
            //     uuid: this.NodePre.uuid,
            //     path: '__comps__.1.spriteFrame',
            //     dump: {
            //         type: 'cc.SpriteFrame',
            //         value: {
            //             uuid: '52891d99-dd77-4e5d-a4e1-c2cb2fe465ad@f9941',
            //         },
            //     },
            // });
        } else {
            this.NodePre.active = true;
        }
    }

    protected resetSize(size: cc.Size): void {
        this.winSmall.resetSize(size);
    }

    protected close(): void {
        super.close();
        this.winSmall.closeSelf();
    }

    protected resetTitle(newTitle: string): void {
        this.winSmall.resetTitle(newTitle);
    }
}
