/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line max-len
import {
 // eslint-disable-next-line max-len
 Button, Color, Component, EditBox, EventHandler, find, Font, instantiate, js, Label, Node, Constructor, RichText, Size, size, Sprite, SpriteFrame, Toggle, UIOpacity, UITransform, v2, Vec2,
} from 'cc';
import { ResManager } from '../common/ResManager';
import ButtonStyle from '../component/ButtonStyle';
import { SpriteCustomizer } from '../component/SpriteCustomizer';
import {
 AssetType, BundleType, ResName, Type,
} from '../global/GConst';
import Utils from './Utils';

const ComponentNameRegex = /^[a-zA-Z_0-9]+<([a-zA-Z_0-9]+)>$/gm;

const ChildByPath = (path: string | Node, refNode: unknown) => {
    if (path instanceof Node) {
        return path instanceof Component ? path.node : path;
    }
    let node: Node;
    if (refNode instanceof Component) {
        node = refNode.node;
    } else {
        node = refNode as Node;
    }
    if (!(node instanceof Node)) {
        return undefined;
    }
    return path && path.length > 0 ? find(path, node) : node;
};

export default class UtilsCC {
    private static _i: UtilsCC = null;
    static get I(): UtilsCC {
        if (this._i == null) {
            this._i = new UtilsCC();
        }
        return this._i;
    }

    // changName() {
    // }

    /** 获取Node节点 */
    static getNode(path: string, refNode: Node): Node {
        return ChildByPath(path, refNode);
    }

    /** 销毁Node节点 */
    static destroyNode(path: string, refNode: Node): void {
        const n = UtilsCC.getNode(path, refNode);
        if (n) n.destroy();
    }

    /** 获取Label组件 */
    static getLabel(node: Node): Label | null;
    static getLabel(path: string, refNode: Node): Label | null;
    static getLabel(path: string | Node, refNode?: Node): Label | null {
        const n = ChildByPath(path, refNode);
        return n ? n.getComponent(Label) : null;
    }

    /** 获取RichText组件 */
    static getRichText(node: Node): RichText | null;
    static getRichText(path: string, refNode: Node): RichText | null;
    static getRichText(path: string | Node, refNode?: Node): RichText | null {
        const n = ChildByPath(path, refNode);
        return n ? n.getComponent(RichText) : null;
    }

    /** 获取精灵组件 */
    static getSprite(node: Node): Sprite | null;
    static getSprite(path: string, refNode: Node): Sprite | null;
    static getSprite(path: string | Node, refNode?: Node): Sprite | null {
        const n = ChildByPath(path, refNode);
        return n ? n.getComponent(Sprite) : null;
    }
    /** 获取透明度组件 */
    static getUIOpacity(node: Node): UIOpacity;
    static getUIOpacity(path: string, refNode: Node): UIOpacity;
    static getUIOpacity(path: string | Node, refNode?: Node): UIOpacity | null {
        const o = ChildByPath(path, refNode);
        return o ? o.getComponent(UIOpacity) : null;
    }
    /** 获取UITransform组件 */
    static getUITransform(node: Node): UITransform;
    static getUITransform(path: string, refNode: Node): UITransform;
    static getUITransform(path: string | Node, refNode?: Node): UITransform | null {
        const n = ChildByPath(path, refNode);
        return n ? n.getComponent(UITransform) : null;
    }

    /** 获取输入框组件 */
    static getEditBox(node: Node): EditBox;
    static getEditBox(path: string, refNode: Node): EditBox;
    static getEditBox(path: string | Node, refNode?: Node): EditBox | null {
        const e = ChildByPath(path, refNode);
        return e ? e.getComponent(EditBox) : null;
    }

    /** 获取复选组件 */
    static getToggle(node: Node): Toggle;
    static getToggle(path: string, refNode: Node): Toggle;
    static getToggle(path: string | Node, refNode?: Node): Toggle | null {
        const t = ChildByPath(path, refNode);
        return t ? t.getComponent(Toggle) : null;
    }

    /** 获取按钮组件 */
    static getButton(node: Node): Button;
    static getButton(path: string, refNode: Node): Button;
    static getButton(path: string | Node, refNode?: Node): Button | null {
        const b = ChildByPath(path, refNode);
        return b ? b.getComponent(Button) : null;
    }

    /** 设置缩放x */
    static setNodeScaleX(node: Node, scaleX: number): void;
    static setNodeScaleX(path: string, refNode: Node, scaleX: number): void;
    static setNodeScaleX(path: string | Node, refNode: number | Node, scaleX?: number): void {
        const n = ChildByPath(path, refNode);
        if (n) {
            if (typeof refNode === 'number') {
                scaleX = refNode;
            }
            n.setScale(scaleX, n.scale.y);
        }
    }

    /** 设置缩放y */
    static setNodeScaleY(node: Node, scaleY: number): void;
    static setNodeScaleY(path: string, refNode: Node, scaleY: number): void;
    static setNodeScaleY(path: string | Node, refNode: number | Node, scaleY?): void {
        const n = ChildByPath(path, refNode);
        if (n) {
            if (typeof scaleY !== Type.Number) {
                scaleY = refNode;
            }
            n.setScale(n.scale.x, scaleY);
        }
    }

    /** 设置缩放x,y */
    static setNodeScale(node: Node, scaleX: number, scaleY: number);
    static setNodeScale(path: string, refNode: Node, scaleX: number, scaleY: number);
    static setNodeScale(path: string | Node, refNode: number | Node, scaleX, scaleY?) {
        const n = ChildByPath(path, refNode);
        if (n) {
            if (arguments.length === 3) {
                scaleY = scaleX as number;
                scaleX = refNode;
            }
            n.setScale(scaleX, scaleY);
        }
    }

    /** 获取缩放x */
    static getNodeScaleX(node: Node): number;
    static getNodeScaleX(path: string, refNode: Node): number;
    static getNodeScaleX(path: string | Node, refNode?: Node) {
        const n = ChildByPath(path, refNode);
        return n ? n.scale.x : 0;
    }

    /** 获取缩放y */
    static getNodeScaleY(node: Node): number;
    static getNodeScaleY(path: string, refNode: Node): number;
    static getNodeScaleY(path: string | Node, refNode?: Node) {
        const n = ChildByPath(path, refNode);
        return n ? n.scale.y : 0;
    }

    /** 获取缩放x,y */
    static getNodeScale(node: Node): Vec2;
    static getNodeScale(path: string, refNode: Node): Vec2;
    static getNodeScale(path: string | Node, refNode?: Node) {
        const n = ChildByPath(path, refNode);
        return n ? v2(n.scale.x, n.scale.y) : v2(1, 1);
    }

    /** 设置坐标x */
    static setPosX(node: Node, X: number);
    static setPosX(path: string, refNode: Node, X: number);
    static setPosX(path: string | Node, refNode: number | Node, X?) {
        const n = ChildByPath(path, refNode);
        if (n) {
            if (typeof X !== Type.Number) {
                X = refNode;
            }
            n.setPosition(X, n.position.y);
        }
    }

    /** 获取坐标x */
    static getPosX(node: Node): number;
    static getPosX(path: string, refNode: Node): number;
    static getPosX(path: string | Node, refNode?: Node) {
        const n = ChildByPath(path, refNode);
        return n ? n.position.x : 0;
    }

    /** 设置坐标y */
    static setPosY(node: Node, Y: number);
    static setPosY(path: string, refNode: Node, Y: number);
    static setPosY(path: string | Node, refNode: number | Node, Y?) {
        const n = ChildByPath(path, refNode);
        if (n) {
            if (typeof Y !== Type.Number) {
                Y = refNode;
            }
            n.setPosition(n.position.x, Y);
        }
    }

    /** 获取坐标y */
    static getPosY(node: Node): number;
    static getPosY(path: string, refNode: Node): number;
    static getPosY(path: string | Node, refNode?: Node) {
        const n = ChildByPath(path, refNode);
        return n ? n.position.y : 0;
    }

    /** 设置坐标x,y */
    static setPos(node: Node, x: number, y: number);
    static setPos(path: string, refNode: Node, x: number, y: number);
    static setPos(path, refNode, x, y?) {
        const n = ChildByPath(path, refNode);
        if (n) {
            if (arguments.length === 3) {
                y = x as number;
                x = refNode as number;
            }
            n.setPosition(x || 0, y || 0);
        }
    }

    /** 获取坐标x,y */
    static getPos(node: Node): Vec2;
    static getPos(path: string, refNode: Node): Vec2;
    static getPos(path: string | Node, refNode?: Node) {
        const n = ChildByPath(path, refNode);
        return n ? v2(n.position.x, n.position.y) : v2(0, 0);
    }

    /** 设置坐标x */
    static setWidth(node: Node, width: number);
    static setWidth(path: string, refNode: Node, width: number);
    static setWidth(path: string | Node, refNode: number | Node, width?: number) {
        let u: UITransform;
        if (width === undefined) {
            u = this.getUITransform(path as Node);
        } else {
            u = this.getUITransform(path as string, refNode as Node);
        }
        if (u) {
            if (typeof refNode === 'number') {
                u.width = refNode;
            }
        }
    }

    static getComponent<T extends Component>(node: Node, Component: Constructor<T>): T;
    static getComponent<T extends Component>(path: string, refNode: Node, Component: Constructor<T>): T;
    static getComponent<T extends Component>(path: string | Node, node: Node | Constructor<T>, Component?: Constructor<T>): T {
        if (path instanceof Node) {
            return path.getComponent(Component);
        } else {
            const n = this.getNode(path, node as Node);
            return n?.getComponent(Component);
        }
    }

    /** 设置大下height */
    static setHeight(node: Node, height: number): void;
    static setHeight(path: string, refNode: Node, height: number): void;
    static setHeight(path, refNode, height?): void {
        const u = this.getComponent(path, refNode, UITransform);
        if (u) {
            if (typeof refNode === 'number') {
                height = refNode;
            }
            u.height = height as number;
        }
    }

    /** 设置大小width,height */
    static setSize(node: Node, width: number, height: number);
    static setSize(path: string, refNode: Node, width: number, height: number);
    static setSize(path, refNode, width, height?) {
        const u = this.getComponent(path, refNode, UITransform);
        if (u) {
            if (Utils.isNullOrUndefined(height)) {
                height = width as number;
                width = refNode as number;
            }
            u.setContentSize(width, height);
        }
    }

    /** 获取大小width */
    static getWidth(node: Node): number;
    static getWidth(path: string, refNode: Node): number;
    static getWidth(path, refNode?) {
        const u = this.getComponent(path, refNode, UITransform);
        return u ? u.width : 0;
    }

    /** 获取大下height */
    static getHeight(node: Node): number;
    static getHeight(path: string, refNode: Node): number;
    static getHeight(path, refNode?) {
        const u = this.getComponent(path, refNode, UITransform);
        return u ? u.height : 0;
    }

    /** 获取大小width,height */
    static getSize(node: Node): Size;
    static getSize(path: string, refNode: Node): Size;
    static getSize(path, refNode?): Size {
        const u = this.getComponent(path, refNode, UITransform);
        return u ? size(u.width, u.height) : size(0, 0);
    }

    /** 设置锚点 */
    static setAnchorPoint(node: Node, x: number);
    static setAnchorPoint(node: Node, x: number, y: number);
    static setAnchorPoint(path: string, refNode: Node, x: number, y: number);
    static setAnchorPoint(path, refNode, x?: number, y?: number) {
        const u = this.getComponent(path, refNode, UITransform);
        if (!u) { return; }
        if (arguments.length === 2) {
            u.anchorX = refNode as number;
        } else if (arguments.length === 3) {
            u.anchorX = refNode as number;
            u.anchorY = x;
        } else {
            u.anchorX = x;
            u.anchorY = y;
        }
    }

    /** 获取锚点 */
    static getAnchorPoint(node: Node): Readonly<Vec2>;
    static getAnchorPoint(path: string, refNode: Node): Readonly<Vec2>;
    static getAnchorPoint(path, refNode?: Node) {
        const u = this.getComponent(path, refNode, UITransform);
        return u ? u.anchorPoint : v2(0, 0);
    }

    /** 获取文本 */
    static getString(node: Node): string;
    static getString(path: string, refNode: Node): string;
    static getString(path, refNode?: Node) {
        const l = this.getComponent(path, refNode, Label) || this.getComponent(path, refNode, RichText) || this.getComponent(path, refNode, EditBox);
        return l ? l.string : '';
    }

    /** 设置文本 */
    static setString(node: Node, fmt: number, ...arg);
    static setString(node: Node, fmt: string, ...arg);
    static setString(path: string, refNode: Node, fmt: number, ...arg);
    static setString(path: string, refNode: Node, fmt: string, ...arg);
    static setString(path, refNode, fmt) {
        const l = this.getComponent(path, refNode, Label) || this.getComponent(path, refNode, RichText) || this.getComponent(path, refNode, EditBox);
        if (l) {
            if (typeof path === 'string') {
                if (arguments.length > 3) {
                    l.string = js.formatStr.apply(js, Array.prototype.slice.call(arguments, 2)) as string;
                } else {
                    const typeofFmt = typeof fmt;
                    l.string = typeofFmt === 'string' || typeofFmt === 'number' ? fmt as string : '';
                }
            } else if (path instanceof Node) {
                if (arguments.length > 2) {
                    l.string = js.formatStr.apply(js, Array.prototype.slice.call(arguments, 1)) as string;
                } else {
                    const typeofFmt = typeof refNode;
                    l.string = typeofFmt === 'string' || typeofFmt === 'number' ? refNode as string : '';
                }
            }
        }
    }

    /** 设置是否隐藏 */
    static setActive(node: Node, active: boolean): Node;
    static setActive(path: string, refNode: Node, active: boolean): Node;
    static setActive(path: string | Node, refNode: Node | boolean, active?: boolean) {
        const n = ChildByPath(path, refNode);
        if (typeof refNode === 'boolean') {
            active = refNode;
        }
        if (n && n.active !== active) {
            n.active = active;
        }
        return n;
    }

    /** 获取是否隐藏 */
    static getActive(refNode: Node): boolean;
    static getActive(path: string, refNode: Node): boolean;
    static getActive(path: string | Node, refNode?: Node) {
        const n = ChildByPath(path, refNode);
        return n ? n.active : false;
    }

    /** 设置状态 */
    static setState(refNode: Node, grayscale: boolean);
    static setState(path: string, refNode: Node, grayscale: boolean);
    static setState(path, refNode, grayscale?) {
        const s: Sprite = this.getComponent(path, refNode, Sprite);
        if (s) {
            if (refNode instanceof Boolean) {
                grayscale = refNode;
            }
            s.grayscale = grayscale as boolean;
        }
    }

    /** 设置文本颜色 */
    static setColor(node: Node, color: Color | string);
    static setColor(path: string, refNode: Node, color: Color | string);
    static setColor(path, refNode, color?) {
        const l = this.getComponent(path, refNode, Label) || this.getComponent(path, refNode, Sprite);
        if (l) {
            if (refNode instanceof Color) {
                color = refNode;
            }
            if (typeof color === 'string') {
                l.color = Utils.hex2Rgba(color);
            } else {
                l.color = color as Color;
            }
        }
    }

    /** 设置文本大小 */
    static setFontSize(node: Node, fontSize: number);
    static setFontSize(path: string, refNode: Node, fontSize: number);
    static setFontSize(path, refNode, fontSize?) {
        const l = this.getComponent(path, refNode, Label) || this.getComponent(path, refNode, RichText);
        if (l) {
            if (Utils.isNullOrUndefined(fontSize)) {
                fontSize = refNode as number;
            }
            l.fontSize = fontSize as number;
            if (l instanceof RichText) {
                l.lineHeight = fontSize as number;
            }
        }
    }

    /** 设置文本大小 */
    static setFont(node: Node, font: Font);
    static setFont(path: string, refNode: Node, font: Font);
    static setFont(path, refNode, font?) {
        const l = this.getComponent(path, refNode, Label) || this.getComponent(path, refNode, RichText);
        if (l) {
            if (Utils.isNullOrUndefined(font)) {
                font = refNode as Font;
            }
            l.font = font as Font;
        }
    }

    /** 获取文本大小 */
    static getFontSize(node: Node): number;
    static getFontSize(path: string, refNode: Node): number;
    static getFontSize(path, refNode?) {
        const l = this.getComponent(path, refNode, Label) || this.getComponent(path, refNode, RichText);
        return l ? l.fontSize : 0;
    }

    /** 设置透明度 */
    static setOpacity(node: Node, opacity: number);
    static setOpacity(path: string, refNode: Node, opacity: number);
    static setOpacity(path, refNode, opacity?) {
        const o = this.getComponent(path, refNode, UIOpacity);
        if (o) {
            if (typeof refNode === 'number') {
                opacity = refNode;
            }
            o.opacity = opacity as number;
        }
    }

    /** 获取透明度 */
    static getOpacity(node: Node): number;
    static getOpacity(path: string, refNode: Node): number;
    static getOpacity(path, refNode?: Node) {
        const o = this.getComponent(path, refNode, UIOpacity);
        return o ? o.opacity : 0;
    }

    /**
     * 如果这个设置为 true，则 check mark 组件会处于 enabled 状态，否则处于 disabled 状态。
     */
    static setChecked(node: Node, checked: boolean);
    static setChecked(path: string, refNode: Node, checked: boolean);
    static setChecked(path, refNode, checked?) {
        const t = this.getComponent(path, refNode, Toggle);
        if (t) {
            if (typeof refNode === 'boolean') {
                checked = refNode;
            }
            t.isChecked = checked as boolean;
        }
    }

    /** 获取是否选中状态 */
    static getChecked(node: Node): boolean;
    static getChecked(path: string, refNode: Node): boolean;
    static getChecked(path, refNode?) {
        const t = this.getComponent(path, refNode, Toggle);
        return t ? t.isChecked : false;
    }

    /**
     * 按钮事件是否被响应，如果interactable为 false，则按钮将被禁用
     */
    static setInteractable(node: Node, status: boolean);
    static setInteractable(path: string, refNode: Node, status: boolean);
    static setInteractable(path, refNode, status?) {
        const b = this.getComponent(path, refNode, Button);
        if (b) {
            if (typeof refNode === 'boolean') {
                status = refNode;
            }
            b.interactable = status as boolean;
        }
    }

    /**
     * 设置精灵索引
     */
    static setSpriteFrameIndex(node: Node, index: number);
    static setSpriteFrameIndex(path: string, refNode: Node, index: number);
    static setSpriteFrameIndex(path, refNode, index?) {
        const sc = this.getComponent(path, refNode, SpriteCustomizer);
        if (sc) {
            if (typeof refNode === 'number') {
                sc.current_frame_index = refNode;
            } else {
                sc.current_frame_index = index as number;
            }
        }
    }

    /**
     * 设置精灵索引
     */
    static setSpriteFrame(sprite: Sprite, spriteframe: SpriteFrame): Sprite;
    static setSpriteFrame(node: Node, spriteframe: SpriteFrame): Sprite;
    static setSpriteFrame(path: string, refNode: Node, spriteframe: SpriteFrame): Sprite;
    static setSpriteFrame(path, refNode, spriteframe?) {
        let sp: Sprite;
        if (path instanceof Sprite) {
            sp = path;
        } else {
            sp = this.getComponent(path, refNode, Sprite);
        }
        if (sp) {
            if (refNode instanceof SpriteFrame) {
                sp.spriteFrame = refNode;
            } else {
                sp.spriteFrame = spriteframe as SpriteFrame;
            }
        }
        return sp;
    }

    static setSpriteAndEnable(sprite: Sprite, url: string, callback?: (sp: Sprite) => void);
    static setSpriteAndEnable(node: Node, url: string, callback?: (sp: Sprite) => void);
    static setSpriteAndEnable(path: string, refNode: Node, url: string, callback?: (sp: Sprite) => void);
    static setSpriteAndEnable(path, refNode, url, callback?) {
        let sp: Sprite;
        if (path instanceof Sprite) {
            sp = path;
        } else {
            sp = this.getComponent(path, refNode, Sprite);
        }
        if (!sp) { return; }
        sp.enabled = false;
        if (typeof refNode === 'string' && typeof url === 'function') {
            this.setSprite(sp, refNode, (s) => {
                s.enabled = true;
                const func = url as (s: Sprite) => void;
                if (func) { func(s); }
            });
        } else if (typeof url === 'string' && typeof callback === 'function') {
            this.setSprite(sp, url, (s) => {
                s.enabled = true;
                const func = callback as (s: Sprite) => void;
                if (func) { func(s); }
            });
        }
    }

    // static setSpriteFromGame(sprite: Sprite, url: string, callback?: (sp: Sprite)=> void);
    // static setSpriteFromGame(node: Node, url: string, callback?: (sp: Sprite)=> void);
    // static setSpriteFromGame(path: string, refNode: Node, url: string, callback?: (sp: Sprite)=> void);
    // static setSpriteFromGame (path: string | Node, refNode: Node, url, callback?) {
    //     let sp: Sprite;
    //     if (path instanceof Sprite) {
    //         sp = path;
    //     } else {
    //         sp = this.getSprite(path: string | Node, refNode: Node);
    //     }
    //     if (!sp || !sp.node || !sp.node.isValid) { return; }
    //     if (typeof refNode === 'string') {
    //         ResManager.I.load(`${<string>refNode}/spriteFrame`, SpriteFrame, (err, spriteframe: SpriteFrame) => {
    //             if (err) { return; }
    //             if (!sp || !sp.node || !sp.node.isValid) { return; }
    //             sp.spriteFrame = spriteframe;
    //             if (callback) callback(sp);
    //         }, this, undefined, BundleType.gamelogic);
    //     } else {
    //         ResManager.I.load(`${<string>url}/spriteFrame`, SpriteFrame, (err, spriteframe: SpriteFrame) => {
    //             if (err) { return; }
    //             if (!sp || !sp.node || !sp.node.isValid) { return; }
    //             sp.spriteFrame = spriteframe;
    //             if (callback) callback(sp);
    //         }, this, undefined, BundleType.gamelogic);
    //     }
    // }

    public static setSprite(sprite: Sprite, url: string, callback?: (sp: Sprite) => void): Sprite;
    public static setSprite(node: Node, url: string, callback?: (sp: Sprite) => void): Sprite;
    public static setSprite(path: string, refNode: Node, url: string, callback?: (sp: Sprite) => void): Sprite;
    public static setSprite(path, refNode, url, callback?): Sprite {
        let sp: Sprite;
        if (path instanceof Sprite) {
            sp = path;
        } else {
            sp = this.getComponent(path, refNode, Sprite);
        }
        if (!sp) { return sp; }
        let realUrl = '';
        if (typeof refNode === 'string') {
            realUrl = refNode;
        } else if (typeof url === 'string') {
            realUrl = url;
        }
        if (!realUrl) { return sp; }
        ResManager.I.loadRemote(realUrl, AssetType.SpriteFrame, (err, spriteframe: SpriteFrame) => {
            if (err) { return; }
            if (sp.isValid) {
                sp.spriteFrame = spriteframe;
                const func = callback as (sp: Sprite) => void;
                if (func) func(sp);
            } else {
                spriteframe.decRef();
            }
        }, this);
        return sp;
    }

    static setSpriteLocal(sprite: Sprite, url: string, callback?: (sp: Sprite) => void, bundleName?: BundleType);
    static setSpriteLocal(node: Node, url: string, callback?: (sp: Sprite) => void, bundleName?: BundleType);
    static setSpriteLocal(path: string, refNode: Node, url: string, callback?: (sp: Sprite) => void, bundleName?: BundleType);
    static setSpriteLocal(path, refNode, url, callback?, bundleName?) {
        if (typeof refNode === 'string') {
            bundleName = callback as string;
            callback = url as (sp: Sprite) => void;
            url = refNode;
        }
        ResManager.I.load(`${url as string}${ResName.spriteFrame}`, SpriteFrame, (err, s: SpriteFrame) => {
            if (s) {
                const sp = this.setSpriteFrame(path, refNode, s);
                const func = callback as (sp: Sprite) => void;
                if (func) func(sp);
            } else {
                console.error('load spriteframe err:', err);
            }
        }, this, undefined, bundleName);
    }

    static setHeadIcon(sprite: Sprite, url: string);
    static setHeadIcon(node: Node, url: string);
    static setHeadIcon(path: string, refNode: Node, url: string);
    static setHeadIcon(path, refNode, url?) {
        if (typeof path === 'string') {
            UtilsCC.setSprite(path, refNode, `i/m/roleHead/${<string>url}`);
        } else {
            UtilsCC.setSprite(path, `i/m/roleHead/${<string>refNode}`);
        }
    }

    // private static indexOfHandler (events: EventHandler[], start_index: number, target: Node, component: string, handler: string) {
    //     if (!events || events.length === 0) { return -1; }
    //     if (!target && !component && !handler) { return -1; }

    //     start_index = start_index || 0;

    //     let req_cmp_cnt = 0;
    //     if (target) { req_cmp_cnt++; }
    //     if (component) { req_cmp_cnt++; }
    //     if (handler) { req_cmp_cnt++; }
    //     for (let i = start_index, n = events.length; i < n; ++i) {
    //         let event = events[i];
    //         let ncpm = 0;

    //         if (target && (!event.target || event.target === target)) { ++ncpm; }
    //         if (component && (!event.component || event.component === component)) { ++ncpm; }
    //         if (handler && (!event.handler || event.handler === handler)) { ++ncpm; }

    //         if (ncpm === req_cmp_cnt) {
    //             return i;
    //         }
    //     }

    //     return -1;
    // }
    /** 设置点击事件，设置之前会移除之前注册的所有事件 */
    static setClickEventOnly(refNode: Node, handlerName: string, target: Component, customdata?: any): Node;
    static setClickEventOnly(path: string, refNode: Node, handlerName: string, target: Component, customdata?: any): Node;
    static setClickEventOnly(path, refNode, handlerName, target, customdata?) {
        const n = this.getNode(path, refNode);
        if (!n) { return n; }
        const b = n.getComponent(Button);
        if (b) {
            b.clickEvents.length = 0;
        }
        n.targetOff(n);
        if (refNode instanceof Node) {
            return this.setClickEvent(n, handlerName, target, customdata);
        } else {
            return this.setClickEvent(n, refNode, handlerName, target);
        }
    }

    public static setClickFunc(path: string, refNode: Node, func: (...arg) => void, target: unknown, ...arg): Node;
    public static setClickFunc(refNode: Node, func: (...arg) => void, target: unknown, ...arg): Node;
    public static setClickFunc(path, refNode, func, target, ...arg): Node {
        let n: Node;
        if (typeof path === 'string') {
            n = this.getNode(path, refNode);
        } else {
            n = path as Node;
            if (!Utils.isNullOrUndefined(target)) {
                arg.unshift(target);
            }
            target = func as unknown;
            func = refNode as (...arg) => void;
        }
        let buttonStyle = n?.getComponent(ButtonStyle);
        if (!buttonStyle) {
            buttonStyle = n?.addComponent(ButtonStyle);
        }
        buttonStyle?.setClickFunc(func, target, ...arg);
        return n;
    }

    // static setClickEvent (refNode: Node, handler: (e, data)=> void, target: Component, customdata?: any): Node;
    static setClickEvent(refNode: Node, handler: string, target: unknown, customdata?: unknown): Node;
    static setClickEvent(path: string, refNode: Node, handler: string, target: unknown, customdata?: unknown): Node;
    static setClickEvent(path, refNode, handler, target, customdata?): Node {
        const n = this.getNode(path, refNode);
        if (!n) { return n; }
        if (typeof refNode === 'string') {
            customdata = target as unknown;
            target = handler as unknown;
            handler = refNode;
        }
        const b = n.getComponent(Button) || n.getComponent(Toggle);
        if (b && target instanceof Component) {
            const eventHandler = new EventHandler();
            eventHandler.target = target.node;
            eventHandler.component = this.getComponentName(target);
            eventHandler.handler = handler as string;
            eventHandler.customEventData = Utils.isNullOrUndefined(customdata) ? '' : customdata as string;

            b.clickEvents.push(eventHandler);
            // } else {
            //     let b_style = n.getComponent(ButtonStyle);
            //     if (!b_style) {
            //         b_style = n.addComponent(ButtonStyle);
            //     }
            //     b_style.setClickFunc(target[handler_name], target, customdata);
        }
        return n;
    }

    /** 根据组件获取名字 */
    static getComponentName(comp: Component) {
        ComponentNameRegex.lastIndex = 0;
        const result = ComponentNameRegex.exec(comp.name);
        return result && result.length >= 1 ? result[1] : null;
    }

    private static _ensureListableChildren(container: Node, len: number) {
        // 多余的移除
        while (container.children.length > 1 && container.children.length > len) {
            const child = container.children[1];
            container.removeChild(child);
            child.destroy();
        }

        // 少了的添加
        const template = container.children[container.children.length - 1];
        template.active = len > 0;

        while (container.children.length < len) {
            const child = instantiate(template);
            container.addChild(child);
        }
        for (let i = 0, children = container.children; i < len; ++i) {
            const child = children[i];
            child.active = true;
        }
    }

    /**
     * 对列表类容器创建子节点
     * @param {cc.Node} container -容器。需要保证第一个节点存在作为模板
     * @param {number | Array} array -数据，或数量
     * @param {bool} hideContainerIfNoChidren -true表示当数量为0的时候隐藏容器。不传入参数为false
     */
    static ensureListableChildren(container: Node, len = 0, hideContainerIfNoChidren = false) {
        if (len > 0) {
            container.active = true;
        } else if (hideContainerIfNoChidren) {
            // 直接隐藏就返回吧
            // 子节点在容器隐藏了的情况下是没有意义了
            container.active = false;
            return;
        }
        if (container.children.length <= 0) {
            return;
        }
        this._ensureListableChildren(container, len);
    }

    static setNodeAttr(node: Node, ...args) {
        node.attr(args);
    }

    static getNodeAttr(node: Node, key: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return node[key];
    }

    /**
     * 将label转换为支持七彩色
     * @param label
     * @param str
     * @param isDark
     * @param outline
     */
    static LabelConvertRainBow(label: Label | RichText, str: string, isDark = false, outline?: string) {
        if (label instanceof Label) {
            const rich = this.CreateRichText(label.node.parent);
            rich.lineHeight = label.lineHeight;
            rich.fontSize = label.fontSize;
            rich.node.name = `${label.node.name}_rich`;
            const pos = label.node.position;
            const anchor = this.getAnchorPoint(label.node);
            this.setPos(rich.node, pos.x, pos.y);
            this.setAnchorPoint(rich.node, anchor.x, anchor.y);
            rich.node.setSiblingIndex(label.node.getSiblingIndex());
            rich.string = Utils.GetRainBowStr(str, outline, isDark);
            return rich;
        } else {
            label.string = Utils.GetRainBowStr(str, outline, isDark);
            return label;
        }
    }

    /**
     * 创建RichText
     * @param parent 可选，父节点
     * @param str 可选，字符串
     * @returns
     */
    static CreateRichText(parent?: Node, str?: string) {
        const node = new Node();
        node.addComponent(UITransform);
        const rich = node.addComponent(RichText);
        if (str) {
            rich.string = '';
        }
        if (parent) {
            parent.addChild(node);
        }
        return rich;
    }

    /**
     * 创建RichText
     * @param parent 可选，父节点
     * @param str 可选，字符串
     * @returns
     */
    static CreateLabel(parent?: Node, str?: string) {
        const node = new Node();
        node.addComponent(UITransform);
        const label = node.addComponent(Label);
        if (str) {
            label.string = '';
        }
        if (parent) {
            parent.addChild(node);
        }
        return label;
    }

    public static getBoundingBox(node: Node) {
        let u = node.getComponent(UITransform);
        if (!u) {
            u = node.addComponent(UITransform);
        }
        return u.getBoundingBox();
    }
}
