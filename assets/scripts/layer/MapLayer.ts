import {
 Component, Label, Node, size, Sprite, SpriteFrame, Texture2D, UITransform, _decorator,
} from 'cc';
import { EventM } from '../common/EventManager';
import { ResManager } from '../common/ResManager';
import { AssetType } from '../global/GConst';
import { MapConst } from '../map/base/MapConst';
import SceneMapManager from '../map/SceneMapManager';

const { ccclass, property } = _decorator;

/**
 * 地图层
 *
 */
@ccclass
export default class MapLayer extends Component {
    /**
     *切割小图片集
     */
    private _sliceImgDic: { [key: string]: Sprite; } = {};
    private _curSliceImgKey: { [key: string]: number; } = {};
    private _mapParams: MapConst.MapParams = null;
    /** 对象池 */
    private nodePools: Node[] = [];
    @property(Sprite)
    private bgImg: Sprite = null;
    // start() {
    // }

    public init(mapParams: MapConst.MapParams): void {
        // this.node.active = false;
        this._mapParams = mapParams;
        if (!this.bgImg) {
            const bgNode: Node = new Node();
            this.node.addChild(bgNode);
            bgNode.layer = this.node.layer;
            const bgnodeTransform = bgNode.addComponent(UITransform);
            bgnodeTransform.anchorX = 0;
            bgnodeTransform.anchorY = 0;
            this.bgImg = bgNode.addComponent(Sprite);
        }
        this.bgImg.spriteFrame = this._mapParams.bgTex;
        // this.bgImage.spriteFrame = this._mapParams.bgTex;
        // 如果是马赛克小地图，则需要把小地图缩放成原始地图一样大小
        if (mapParams.mapLoadModel === MapConst.MapLoadModel.slices) {
            this.bgImg.node.getComponent(UITransform).setContentSize(size(mapParams.mapWidth, mapParams.mapHeight));
        }
        this.node.getComponent(UITransform).setContentSize(size(this.width, this.height));
    }
    public load(url: string): void {
        // ResourceLoader.getInstance().load(url,onLoadComplete);
    }
    public onLoadComplete(): void {
        // var bitmapData:BitmapData = (content as Bitmap).bitmapData;
        // _bgImg.bitmapData = bitmapData;
        // this.dispatchEvent(new MsgEvent(MsgEvent.INIT_COMP,{width:bitmapData.width,height:bitmapData.height}));
    }
    // private node_num = 0;
    /**
     * 根据视图区域加载小地图
     * @param px 滚动视图左上角的x坐标
     * @param py 滚动视图左上角的y坐标
     *
     */
    public loadSliceImage(px: number, py: number): void {
        let iy1: number = Math.floor(py / this._mapParams.sliceHeight) - 1;
        let iy2: number = Math.floor((py + this._mapParams.viewHeight) / this._mapParams.sliceHeight) + 1;
        let jx1: number = Math.floor(px / this._mapParams.sliceWidth) - 1;
        let jx2: number = Math.floor((px + this._mapParams.viewWidth) / this._mapParams.sliceWidth) + 1;
        if (iy2 >= this._mapParams.maxIndex.y) {
            iy2 = this._mapParams.maxIndex.y - 1;
        }
        if (jx2 >= this._mapParams.maxIndex.x) {
            jx2 = this._mapParams.maxIndex.x - 1;
        }
        if (iy1 < 0) {
            iy1 = 0;
        }
        if (jx1 < 0) {
            jx1 = 0;
        }
        // console.log('iy1, iy2, jx1, jx2=', iy1, iy2, jx1, jx2);
        this._curSliceImgKey = {};
        let totalNum = (iy2 - iy1) * (jx2 - jx1);
        for (let i: number = iy1; i <= iy2; i++) {
            for (let j: number = jx1; j <= jx2; j++) {
                const key = `${i + 1}_${j + 1}`; // 图片的索引是从1开始的，所以要加1
                this._curSliceImgKey[key] = 1;
                if (!this._sliceImgDic[key]) {
                    const bitmap: Sprite = this.getSliceSprite(key);
                    this._sliceImgDic[key] = bitmap;
                    // this.node.addChild(bitmap.node);
                    bitmap.node.layer = this.node.layer;
                    const x = j * this._mapParams.sliceWidth;
                    const y = i * this._mapParams.sliceHeight;
                    bitmap.node.setPosition(x, y);
                    // this.node_num++;
                    bitmap.node.name = key;
                    const labelNode = bitmap.node.getChildByName('name');
                    if (labelNode) {
                        const lb = labelNode.getComponent(Label);
                        lb.string = key;
                    }
                    const url = `http://192.168.123.95/h5/map/${this._mapParams.bgName}/${key}.jpg`;
                    // eslint-disable-next-line no-loop-func
                    ResManager.I.loadRemote(url, AssetType.SpriteFrame, (e, spriteframe: SpriteFrame) => {
                        const texture = spriteframe.texture;
                        texture.setWrapMode(Texture2D.WrapMode.CLAMP_TO_EDGE, Texture2D.WrapMode.CLAMP_TO_EDGE);
                        bitmap.spriteFrame = spriteframe;
                        // const trans = bitmap.node.getComponent(UITransform);
                        totalNum--;
                        if (totalNum === 0) {
                            if (SceneMapManager.I.isFirst()) {
                                SceneMapManager.I.setFirst(false);
                                EventM.I.fire(EventM.Type.SceneMap.FirstLoadComplete);
                            }
                        }
                    }, this);
                    // assetManager.loadRemote(url, (err: Error, imageAsset: ImageAsset) => {
                    //     const spriteFrame = new SpriteFrame();
                    //     const texture = new Texture2D();
                    //     texture.image = imageAsset;
                    //     texture.setWrapMode(Texture2D.WrapMode.CLAMP_TO_EDGE, Texture2D.WrapMode.CLAMP_TO_EDGE);
                    //     spriteFrame.texture = texture;
                    //     bitmap.spriteFrame = spriteFrame;
                    //     totalNum--;
                    //     if (totalNum === 0) {
                    //         if (SceneMapManager.I.isFirst()) {
                    //             SceneMapManager.I.setFirst(false);
                    //             EventM.I.fire(EventM.Type.SceneMap.FirstLoadComplete);
                    //         }
                    //     }
                    // });
                }
            }
        }
        // console.log('node_num=', this.node_num);
        this.deleteOutViewImage();
        // C:\Users\ASUS\AppData\Local\Google\Chrome\Application\chrome.exe
    }
    /** 释放视野之外的地图资源 */
    private deleteOutViewImage() {
        for (const key in this._sliceImgDic) {
            if (!this._curSliceImgKey[key]) {
                // let texture = this._sliceImgDic[key].spriteFrame.texture;
                this.deleteNode(this._sliceImgDic[key].node);
                // assetManager.releaseAsset(texture);
                this._sliceImgDic[key] = null;
                delete this._sliceImgDic[key];
            }
        }
    }
    public getNodeByPool(): Sprite {
        if (this.nodePools.length === 0) {
            const node = new Node();
            const sprite = node.addComponent(Sprite);
            const nodeTransform = node.addComponent(UITransform);
            nodeTransform.anchorX = 0;
            nodeTransform.anchorY = 0;

            // const labelNode = new Node();
            // labelNode.name = 'name';
            // labelNode.addComponent(UITransform);
            // const label = labelNode.addComponent(Label);
            // label.fontSize = 80;
            // label.lineHeight = 88;
            // node.addChild(labelNode);
            // labelNode.setPosition(512 * 0.5, 512 * 0.5);
            this.node.addChild(node);
            return sprite;
        } else {
            const node = this.nodePools.shift();
            node.active = true;
            return node.getComponent(Sprite);
        }
    }
    public deleteNode(node: Node): void {
        node.active = false;
        const sprite = node.getComponent(Sprite);
        sprite.spriteFrame = undefined;
        // node.removeFromParent();
        this.nodePools.push(node);
    }
    private getSliceSprite(name: string) {
        // let node:Node = new Node();
        // let sprite:Sprite = node.addComponent(Sprite);
        // let nodeTransform = node.addComponent(UITransform);
        // nodeTransform.anchorX = 0;
        // nodeTransform.anchorY = 0;
        // return sprite;
        return this.getNodeByPool();
    }
    public clear(): void {
        this.bgImg.spriteFrame = null;
        for (const key in this._sliceImgDic) {
            const bitmap: Sprite = this._sliceImgDic[key];
            if (bitmap) bitmap.node.destroy();
            this._sliceImgDic[key] = null;
            delete this._sliceImgDic[key];
        }
    }
    public get bgImage(): Sprite {
        return this.bgImg;
    }
    public get width(): number {
        if (this.bgImg) {
            return this.bgImg.node.getComponent(UITransform).width;
        }
        return this._mapParams.viewWidth;
    }
    public get height(): number {
        if (this.bgImg) {
            return this.bgImg.node.getComponent(UITransform).height;
        }
        return this._mapParams.viewHeight;
    }

    // protected onDestroy() {
        // this.node.off(Node.EventType.TOUCH_START, this.onJoystickTouchStart, this);
        // this.node.off(Node.EventType.TOUCH_MOVE, this.onJoystickTouchMove, this);
        // this.node.off(Node.EventType.TOUCH_END, this.onJoystickTouchEnd, this);
        // this.node.off(Node.EventType.TOUCH_CANCEL, this.onJoystickTouchEnd, this);
    // }
}
