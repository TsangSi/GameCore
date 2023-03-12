/* eslint-disable dot-notation */
/*
 * @Author: hwx
 * @Date: 2022-03-29 11:22:21
 * @FilePath: \SanGuo2.4\assets\script\app\base\utils\UtilCocos.ts
 * @Description: Cocos工具类
 */

import { BundleType } from '../../core/res/BundleMgr';
import { AssetType } from '../../core/res/ResConst';
import { ResMgr } from '../../core/res/ResMgr';
import { UtilColor } from './UtilColor';
import { UtilColorFull } from '../../../game/base/utils/UtilColorFull';
import UtilItem from '../../../game/base/utils/UtilItem';
import { ItemQuality } from '../../../game/com/item/ItemConst';

/**
 * Cocos工具类
 */
export class UtilCocos {
    /** ************************* 节点相关 ************************* */
    /**
     * 创建节点
     * @param parent
     * @param components
     * @returns 节点
     */
    public static NewNode(parent: cc.Node, components?: any[]): cc.Node {
        const node = new cc.Node();
        node.setParent(parent);
        if (components && components.length > 0) {
            components.forEach((comp) => {
                node.addComponent(comp);
            });
        }
        return node;
    }

    /**
     * 获取节点
     * @param node 节点或父节点
     * @param path 可选子节点路径
     * @returns 节点或空
     */
    public static FindNode(node: cc.Node, path?: unknown): cc.Node | null {
        if (node && typeof path === 'string') {
            const refNode = UtilCocos.getChildByPath(node, path);
            return refNode;
        }
        return node;
    }

    /** 设置节点坐标x */
    public static SetPosX(node: cc.Node, x: number): void;
    public static SetPosX(node: cc.Node, path: string, x: number): void;
    public static SetPosX(node: cc.Node, ...args: unknown[]): void {
        const refNode = this.FindNode(node, args[0]);
        if (refNode && refNode.isValid) {
            const hasPath = typeof args[0] === 'string';
            const x = (hasPath ? args[1] : args[0]) as number;
            refNode.setPosition(x, refNode.position.y, refNode.position.z);
        }
    }

    /** 获取节点坐标x */
    public static GetPosX(node: cc.Node, path?: string): number {
        const refNode = this.FindNode(node, path);
        return refNode && refNode.isValid ? refNode.position.x : 0;
    }

    /** 设置节点坐标y */
    public static SetPosY(node: cc.Node, y: number): void;
    public static SetPosY(node: cc.Node, path: string, y: number): void;
    public static SetPosY(node: cc.Node, ...args: unknown[]): void {
        const refNode = this.FindNode(node, args[0]);
        if (refNode && refNode.isValid) {
            const hasPath = typeof args[0] === 'string';
            const y = (hasPath ? args[1] : args[0]) as number;
            refNode.setPosition(refNode.position.x, y, refNode.position.z);
        }
    }

    /** 获取节点坐标y */
    public static GetPosY(node: cc.Node, path?: string): number {
        const refNode = this.FindNode(node, path);
        return refNode && refNode.isValid ? refNode.position.y : 0;
    }

    /** 设置节点坐标z */
    public static SetPosZ(node: cc.Node, z: number): void;
    public static SetPosZ(node: cc.Node, path: string, z: number): void;
    public static SetPosZ(node: cc.Node, ...args: unknown[]): void {
        const refNode = this.FindNode(node, args[0]);
        if (refNode && refNode.isValid) {
            const hasPath = typeof args[0] === 'string';
            const z = (hasPath ? args[1] : args[0]) as number;
            refNode.setPosition(refNode.position.x, refNode.position.y, z);
        }
    }

    /** 获取节点坐标z */
    public static GetPosZ(node: cc.Node, path?: string): number {
        const refNode = this.FindNode(node, path);
        return refNode && refNode.isValid ? refNode.position.z : 0;
    }

    /** 设置节点坐标 */
    public static SetPos(node: cc.Node, pos: cc.Vec2): void;
    public static SetPos(node: cc.Node, x: number, y: number, z?: number): void;
    public static SetPos(node: cc.Node, path: string, pos: cc.Vec2): void;
    public static SetPos(node: cc.Node, path: string, x: number, y: number, z?: number): void;
    public static SetPos(node: cc.Node, ...args: unknown[]): void {
        const refNode = this.FindNode(node, args[0]);
        if (refNode && refNode.isValid) {
            const hasPath = typeof args[0] === 'string';
            if (typeof args[0] === 'number' || typeof args[1] === 'number') {
                const x = (hasPath ? args[1] : args[0]) as number;
                const y = (hasPath ? args[2] : args[1]) as number;
                const z = (hasPath ? args[3] : args[2]) as number;
                refNode.setPosition(x, y, z);
            } else {
                const pos = (hasPath ? args[1] : args[0]) as cc.Vec2;
                refNode.setPosition(pos);
            }
        }
    }

    /** 获取节点坐标 */
    public static GetPos(node: cc.Node, path?: string): cc.Vec2 {
        const refNode = this.FindNode(node, path);
        return refNode && cc.isValid(refNode) ? cc.v2(refNode.position.x, refNode.position.y) : cc.Vec2.ZERO;
    }

    /** 设置节点缩放x */
    public static SetScaleX(node: cc.Node, x: number): void;
    public static SetScaleX(node: cc.Node, path: string, x: number): void;
    public static SetScaleX(node: cc.Node, ...args: unknown[]): void {
        const refNode = this.FindNode(node, args[0]);
        if (refNode && refNode.isValid) {
            const hasPath = typeof args[0] === 'string';
            const x = (hasPath ? args[1] : args[0]) as number;
            refNode.setScale(x, refNode.scaleY);
        }
    }

    /**
     * 获取节点缩放x
     * @param node
     * @param path
     * @returns 缩放x | 0
     */
    public static GetScaleX(node: cc.Node, path?: string): number {
        const refNode = this.FindNode(node, path);
        return refNode && refNode.isValid ? refNode.scaleX : 0;
    }

    // /** 设置节点缩放y */
    // public static SetScaleY(node: cc.Node, y: number): void;
    // public static SetScaleY(node: cc.Node, path: string, y: number): void;
    // public static SetScaleY(node: cc.Node, ...args: unknown[]): void {
    //     const refNode = this.FindNode(node, args[0]);
    //     if (refNode && refNode.isValid) {
    //         const hasPath = typeof args[0] === 'string';
    //         const y = (hasPath ? args[1] : args[0]) as number;
    //         refNode.setScale(refNode.scaleX, y, refNode.scale.z);
    //     }
    // }

    /** 获取节点缩放y */
    public static GetScaleY(node: cc.Node, path?: string): number {
        const refNode = this.FindNode(node, path);
        return refNode && refNode.isValid ? refNode.scaleY : 0;
    }

    // /** 设置节点缩放z */
    // public static SetScaleZ(node: cc.Node, z: number): void;
    // public static SetScaleZ(node: cc.Node, path: string, z: number): void;
    // public static SetScaleZ(node: cc.Node, ...args: unknown[]): void {
    //     const refNode = this.FindNode(node, args[0]);
    //     if (refNode && refNode.isValid) {
    //         const hasPath = typeof args[0] === 'string';
    //         const z = (hasPath ? args[1] : args[0]) as number;
    //         refNode.setScale(refNode.scaleX, refNode.scaleY, z);
    //     }
    // }

    /** 获取节点缩放z */
    public static GetScaleZ(node: cc.Node, path?: string): number {
        const refNode = this.FindNode(node, path);
        return refNode && refNode.isValid ? refNode.scaleZ : 0;
    }

    /** 设置节点缩放 */
    public static SetScale(node: cc.Node, scale: cc.Vec2): void;
    public static SetScale(node: cc.Node, x: number, y: number, z?: number): void;
    public static SetScale(node: cc.Node, path: string, scale: cc.Vec2): void;
    public static SetScale(node: cc.Node, path: string, x: number, y: number, z?: number): void;
    public static SetScale(node: cc.Node, ...args: unknown[]): void {
        const refNode = this.FindNode(node, args[0]);
        if (refNode && refNode.isValid) {
            const hasPath = typeof args[0] === 'string';
            if (typeof args[0] === 'number' || typeof args[1] === 'number') {
                const x = (hasPath ? args[1] : args[0]) as number;
                const y = (hasPath ? args[2] : args[1]) as number;
                const z = (hasPath ? args[3] : args[2]) as number;
                refNode.setScale(x, y, z);
            } else {
                const scale = (hasPath ? args[1] : args[0]) as cc.Vec2;
                refNode.setScale(scale);
            }
        }
    }

    /** 获取节点缩放 */
    public static GetScale(node: cc.Node, path?: string): cc.Vec2 {
        const refNode = this.FindNode(node, path);
        return refNode && refNode.isValid ? cc.v2(refNode.scaleX, refNode.scaleY) : cc.Vec2.ZERO;
    }

    /** 设置节点激活状态 */
    public static SetActive(node: cc.Node, active: boolean): cc.Node;
    public static SetActive(node: cc.Node, path: string, active: boolean): cc.Node;
    public static SetActive(node: cc.Node, ...args: unknown[]): cc.Node {
        const refNode = this.FindNode(node, args[0]);
        if (refNode && refNode.isValid) {
            const hasPath = typeof args[0] === 'string';
            const active = (hasPath ? args[1] : args[0]) as boolean;
            refNode.active = active;
        }
        return refNode;
    }

    /** 获取节点激活状态 */
    public static GetActive(node: cc.Node, path?: string): boolean {
        const refNode = this.FindNode(node, path);
        return refNode && refNode.isValid ? refNode.active : false;
    }

    /** 设置节点自定义属性 */
    public static SetAttr(node: cc.Node, attrs: Record<string, unknown>): void {
        node.attr(attrs);
    }

    /** 获取节点自定义属性 */
    public static GetAttr<T>(node: cc.Node, key: string): T {
        return node[key] as T;
    }

    /** ************************* 组件相关 ************************* */
    /**
     * 获取组件
     * @param TCtor 组件类型构造
     * @param node 节点或父节点
     * @param path 可选子节点路径
     * @returns 组件或空
     */
    public static GetComponent<T extends cc.Component>(TCtor: any, node: cc.Node, path?: unknown): T | null {
        if (!node || !node.isValid) return null;
        if (typeof path === 'string') {
            // 获取子节点路径的精灵组件
            const refNode = UtilCocos.getChildByPath(node, path);
            if (!refNode || !refNode.isValid) return null;
            return refNode.getComponent(TCtor);
        }
        return node.getComponent(TCtor);
    }

    /**
     * 获取组件列表
     * @param TCtor 组件类型构造
     * @param node 节点或父节点
     * @param path 可选子节点路径
     * @returns 组件列表
     */
    // public static GetComponentsInChildren<T extends cc.Component>(TCtor: Constructor<T>, node: cc.Node, path?: unknown): T[] {
    //     if (!node || !node.isValid) return [];
    //     if (typeof path === 'string') {
    //         // 获取子节点路径的精灵组件
    //         const refNode = node.getChildByPath(path);
    //         if (!refNode || !refNode.isValid) return [];
    //         return refNode.getComponentsInChildren(TCtor);
    //     }
    //     return node.getComponentsInChildren(TCtor);
    // }

    /** ************************* 变换组件相关 ************************* */
    // /** 设置节点宽度 */
    // public static SetWidth(node: cc.Node, w: number): void;
    // public static SetWidth(node: cc.Node, path: string, w: number): void;
    // public static SetWidth(node: cc.Node, ...args: unknown[]): void {
    //     const trans = this.GetComponent(UITransform, node, args[0]);
    //     if (trans && trans.isValid) {
    //         const hasPath = typeof args[0] === 'string';
    //         const w = (hasPath ? args[1] : args[0]) as number;
    //         trans.width = w;
    //     }
    // }

    // /** 获取节点宽度 */
    // public static GetWidth(node: cc.Node, path?: string): number {
    //     const trans = this.GetComponent(UITransform, node, path);
    //     return trans && trans.isValid ? trans.width : 0;
    // }

    /** 设置节点高度 */
    // public static SetHeight(node: cc.Node, h: number): void;
    // public static SetHeight(node: cc.Node, path: string, h: number): void;
    // public static SetHeight(node: cc.Node, ...args: unknown[]): void {
    //     const trans = this.GetComponent(UITransform, node, args[0]);
    //     if (trans && trans.isValid) {
    //         const hasPath = typeof args[0] === 'string';
    //         const h = (hasPath ? args[1] : args[0]) as number;
    //         trans.height = h;
    //     }
    // }

    // /** 获取节点高度 */
    // public static GetHeight(node: cc.Node, path?: string): number {
    //     const trans = this.GetComponent(UITransform, node, path);
    //     return trans && trans.isValid ? trans.height : 0;
    // }

    // /** 设置节点大小 */
    // public static SetSize(node: cc.Node, cc.size: cc.Size): void;
    // public static SetSize(node: cc.Node, path: string, cc.size: cc.Size): void;
    // public static SetSize(node: cc.Node, ...args: unknown[]): void {
    //     const trans = this.GetComponent(UITransform, node, args[0]);
    //     if (trans && trans.isValid) {
    //         const hasPath = typeof args[0] === 'string';
    //         const cc.size = (hasPath ? args[1] : args[0]) as cc.Size;
    //         trans.contentSize = cc.size;
    //     }
    // }

    /** 获取节点大小 */
    // public static GetSize(node: cc.Node, path?: string): cc.Size {
    //     const trans = this.GetComponent(UITransform, node, path);
    //     return trans && trans.isValid ? trans.contentSize : cc.Size.ZERO;
    // }

    // /** 设置节点锚点 */
    // public static SetAnchorPoint(node: cc.Node, pos: Vec2): void;
    // public static SetAnchorPoint(node: cc.Node, x: number, y: number): void;
    // public static SetAnchorPoint(node: cc.Node, path: string, pos: Vec2): void;
    // public static SetAnchorPoint(node: cc.Node, path: string, x: number, y: number): void;
    // public static SetAnchorPoint(node: cc.Node, ...args: unknown[]): void {
    //     const trans = this.GetComponent(UITransform, node, args[0]);
    //     if (trans && trans.isValid) {
    //         const hasPath = typeof args[0] === 'string';
    //         if (typeof args[0] === 'number' || typeof args[1] === 'number') {
    //             const x = (hasPath ? args[1] : args[0]) as number;
    //             const y = (hasPath ? args[2] : args[1]) as number;
    //             trans.setAnchorPoint(x, y);
    //         } else {
    //             const pos = (hasPath ? args[1] : args[0]) as Vec2;
    //             trans.setAnchorPoint(pos);
    //         }
    //     }
    // }

    // /** 获取节点锚点 */
    // public static GetAnchorPoint(node: cc.Node, path?: string): Vec2 {
    //     const trans = this.GetComponent(UITransform, node, path);
    //     return trans && trans.isValid ? trans.anchorPoint : Vec2.ZERO;
    // }

    /** ************************* 精灵组件相关 ************************* */
    /** 设置节点图片变灰状态 */
    public static SetSpriteGray(node: cc.Node, grayscale: boolean, isInChildren?: boolean): void;
    public static SetSpriteGray(node: cc.Node, path: string, grayscale: boolean, isInChildren?: boolean): void;
    public static SetSpriteGray(node: cc.Node, ...args: unknown[]): void {
        const refNode = this.FindNode(node, args[0]);
        if (refNode && refNode.isValid) {
            const hasPath = typeof args[0] === 'string';
            const grayscale = (hasPath ? args[1] : args[0]) as boolean;
            const isInChildren = (hasPath ? args[2] : args[1]) as boolean;
            // 是否包含子节点
            if (isInChildren) {
                // 是否自身或所有子节点图片变灰
                const sprites = refNode.getComponentsInChildren(cc.Sprite);
                sprites.forEach((spr: cc.Sprite) => {
                    // spr.grayscale = grayscale;
                    UtilColor.setGray(spr.node, grayscale, true);
                });
            } else {
                // 自己变灰
                const spr = refNode.getComponent(cc.Sprite);
                UtilColor.setGray(spr.node, grayscale);
            }
        }
    }

    /** 渐变置灰 */
    public static setGradientGray(lb: cc.Label, isGray: boolean): void {
        lb.getMaterial(0).setProperty('isGray', isGray);
    }

    /** 加载精灵帧 */
    public static LoadSpriteFrame(sprite: cc.Sprite, url: string, complete?: (spr: cc.Sprite) => void, bundleName?: string): cc.Sprite;
    public static LoadSpriteFrame(node: cc.Node, url: string, complete?: (spr: cc.Sprite) => void, bundleName?: string): cc.Sprite;
    public static LoadSpriteFrame(node: cc.Node, path: string, url: string, complete?: (spr: cc.Sprite) => void, bundleName?: string): cc.Sprite;
    public static LoadSpriteFrame(...args: unknown[]): cc.Sprite {
        let sprite: cc.Sprite;
        let url: string;
        let complete: (spr: cc.Sprite) => void;
        let bundleName: BundleType;
        if (args[0] instanceof cc.Sprite) {
            sprite = args[0];
            url = args[1] as string;
            complete = args[2] as (spr: cc.Sprite) => void;
            bundleName = args[3] as BundleType;
        } else {
            const node = args[0] as cc.Node;
            sprite = this.GetComponent(cc.Sprite, node, args[1]);
            const hasPath = typeof args[1] === 'string';
            url = (hasPath ? args[2] : args[1]) as string;
            complete = (hasPath ? args[3] : args[2]) as (spr: cc.Sprite) => void;
            bundleName = (hasPath ? args[4] : args[3]) as BundleType;
        }
        if (!sprite) { return null; }
        if (sprite.node) {
            sprite.node['_curLoadPath'] = url;
        }
        if (sprite && sprite.isValid) {
            ResMgr.I.loadLocal(url, cc.SpriteFrame, (err, spriteFrame: cc.SpriteFrame) => {
                if (err) { return; }
                if (sprite && sprite.isValid && sprite.node && sprite.node['_curLoadPath'] === url) {
                    sprite.spriteFrame = spriteFrame;

                    if (complete) complete(sprite);
                }
            }, { bundle: bundleName });
        }
        return sprite; // 此时返回的对象是没有完成加载图片的
    }

    /** 加载远程精灵帧 */
    public static LoadSpriteFrameRemote(sprite: cc.Sprite, url: string, type?: AssetType, complete?: (spr: cc.Sprite) => void): cc.Sprite | null;
    public static LoadSpriteFrameRemote(node: cc.Node, url: string, type?: AssetType, complete?: (spr: cc.Sprite) => void): cc.Sprite | null;
    public static LoadSpriteFrameRemote(node: cc.Node, path: string, url: string, type?: AssetType, complete?: (spr: cc.Sprite) => void): cc.Sprite | null;
    // eslint-disable-next-line max-len
    public static LoadSpriteFrameRemote(sprite: cc.Sprite, url: string, type?: AssetType, complete?: (spr: cc.Sprite) => void, border?: number[]): cc.Sprite | null;
    public static LoadSpriteFrameRemote(...args: unknown[]): cc.Sprite | null {
        let sprite: cc.Sprite;
        let url: string;
        let type: AssetType;
        let border: number[];
        let complete: (spr: cc.Sprite) => void;
        if (args[0] instanceof cc.Sprite) {
            sprite = args[0];
            url = args[1] as string;
            type = args[2] as AssetType;
            complete = args[3] as (spr: cc.Sprite) => void;
            border = args[4] as number[];
        } else {
            const node = args[0] as cc.Node;
            sprite = this.GetComponent(cc.Sprite, node, args[1]);
            const hasPath = typeof args[1] === 'string';
            url = (hasPath ? args[2] : args[1]) as string;
            type = (hasPath ? args[3] : args[2]) as AssetType;
            complete = (hasPath ? args[4] : args[3]) as (spr: cc.Sprite) => void;
        }
        if (!sprite) { return null; }
        if (sprite.node) {
            sprite.node['_curLoadPath'] = url;
        }
        type = type || AssetType.SpriteFrame;
        sprite.spriteFrame = null;
        ResMgr.I.loadRemote(url, type, (err, spriteFrame: cc.SpriteFrame) => {
            if (!err && sprite && sprite.isValid && sprite.node && sprite.node['_curLoadPath'] === url) {
                spriteFrame.getTexture().setWrapMode(cc.Texture2D.WrapMode.CLAMP_TO_EDGE, cc.Texture2D.WrapMode.CLAMP_TO_EDGE);
                sprite.spriteFrame = spriteFrame;
                if (border) {
                    sprite.spriteFrame.insetTop = border[0];
                    sprite.spriteFrame.insetBottom = border[1];
                    sprite.spriteFrame.insetLeft = border[2];
                    sprite.spriteFrame.insetRight = border[3];
                }
                if (complete) complete(sprite);
            }
        });

        return sprite; // 此时返回的对象是没有完成加载图片的
    }

    /** 设置标签|富文本|编辑框字符串, 可使用%s、%d等格式化参数 */
    public static SetString(node: cc.Node, msg: string | number, subst?: unknown[]): cc.Label | cc.RichText | cc.EditBox;
    public static SetString(node: cc.Node, path: string, msg: string | number, subst?: unknown[]): cc.Label | cc.RichText | cc.EditBox;
    public static SetString(node: cc.Node, ...args: unknown[]): cc.Label | cc.RichText | cc.EditBox {
        const argsLen = args.length;
        const hasPath = argsLen > 1 && !Array.isArray(args[1]);
        const path = hasPath ? args[0] : undefined;
        const comp: cc.Label = this.GetComponent(cc.Label, node, path)
            || this.GetComponent(cc.RichText, node, path)
            || this.GetComponent(cc.EditBox, node, path);
        if (comp && comp.isValid) {
            const msg = (hasPath ? args[1] : args[0]) as string;
            const substIdx = hasPath ? 2 : 1; // 格式化参数开始下标
            const subst = args[substIdx] as unknown[];
            const isFmt = subst && subst.length > 0;
            comp.string = isFmt ? cc.js.formatStr(msg, ...subst) : msg;
        }
        return comp;
    }

    /** 获取标签|富文本|编辑框字符串 */
    public static GetString(node: cc.Node, path?: string): string {
        const comp: cc.Label = this.GetComponent(cc.Label, node, path)
            || this.GetComponent(cc.RichText, node, path)
            || this.GetComponent(cc.EditBox, node, path);
        return comp && comp.isValid ? comp.string : '';
    }

    /** 设置标签|精灵颜色 */
    public static SetColor(node: cc.Node, other: cc.Color): void;
    public static SetColor(node: cc.Node, hexString: string): void;
    public static SetColor(node: cc.Node, r: number, g: number, b: number, a?: number): void;
    public static SetColor(node: cc.Node, path: string, other: cc.Color): void;
    public static SetColor(node: cc.Node, path: string, hexString: string): void;
    public static SetColor(node: cc.Node, path: string, r: number, g: number, b: number, a?: number): void;
    public static SetColor(node: cc.Node, ...args: unknown[]): void {
        const hasPath = args.length > 1 && typeof args[0] === 'string';
        const path = hasPath ? args[0] : undefined;
        const comp = this.GetComponent(cc.Label, node, path)
            || this.GetComponent(cc.Sprite, node, path);
        if (comp && comp.isValid) {
            if (typeof args[0] === 'string' || typeof args[1] === 'string') {
                const hexString = (hasPath ? args[1] : args[0]) as string;
                comp.node.color = UtilColor.Hex2Rgba(hexString);
            } else if (typeof args[0] === 'number') {
                const r = (hasPath ? args[1] : args[0]) as number;
                const g = (hasPath ? args[2] : args[1]) as number;
                const b = (hasPath ? args[3] : args[2]) as number;
                const a = (hasPath ? args[4] : args[3]) as number;
                comp.node.color = new cc.Color(r, g, b, a);
            } else {
                const other = (hasPath ? args[1] : args[0]) as cc.Color;
                comp.node.color = other;
            }
        }
    }

    // /** 获取标签|精灵颜色 */
    // public static GetColor(node: cc.Node, path?: string): cc.Color {
    //     const comp = this.GetComponent(cc.Label, node, path)
    //         || this.GetComponent(cc.Sprite, node, path);
    //     return comp && comp.isValid ? comp.node.color : cc.Color.BLACK;
    // }

    // /** 设置标签|富文本字体，可选字体大小，行高参数 */
    // public static SetFont(node: cc.Node, font: cc.Font, fontSize?: number, lineHeight?: number): void;
    // public static SetFont(node: cc.Node, path: string, font: cc.Font, fontSize?: number, lineHeight?: number): void;
    // public static SetFont(node: cc.Node, ...args: unknown[]): void {
    //     const hasPath = typeof args[0] === 'string';
    //     const path = hasPath ? args[0] : undefined;
    //     const comp: cc.Label = this.GetComponent(cc.Label, node, path)
    //         || this.GetComponent(cc.RichText, node, path);
    //     if (comp && comp.isValid) {
    //         const font = (hasPath ? args[1] : args[0]) as cc.Font;
    //         if (font !== undefined) comp.font = font;
    //         const fontSize = (hasPath ? args[2] : args[1]) as number;
    //         if (fontSize !== undefined) comp.fontSize = fontSize;
    //         const lineHeight = (hasPath ? args[3] : args[2]) as number;
    //         if (lineHeight !== undefined) comp.lineHeight = lineHeight;
    //     }
    // }

    // /** 设置标签|富文本字体大小，可选行高参数 */
    // public static SetFontSize(node: cc.Node, fontSize: number, lineHeight?: number): void;
    // public static SetFontSize(node: cc.Node, path: string, fontSize: number, lineHeight?: number): void;
    // public static SetFontSize(node: cc.Node, ...args: unknown[]): void {
    //     const hasPath = typeof args[0] === 'string';
    //     const path = hasPath ? args[0] : undefined;
    //     const comp: cc.Label | cc.RichText = this.GetComponent(cc.Label, node, path)
    //         || this.GetComponent(cc.RichText, node, path);
    //     if (comp && comp.isValid) {
    //         const fontSize = (hasPath ? args[1] : args[0]) as number;
    //         comp.fontSize = fontSize;
    //         const lineHeight = (hasPath ? args[2] : args[1]) as number;
    //         if (lineHeight !== undefined) comp.lineHeight = lineHeight;
    //     }
    // }

    // /** 获取标签|富文本字体大小 */
    // public static GetFontSize(node: cc.Node, path?: string): number {
    //     const comp = this.GetComponent(cc.Label, node, path)
    //         || this.GetComponent(cc.RichText, node, path);
    //     return comp && comp.isValid ? comp.fontSize : 0;
    // }

    // /** 设置标签|富文本字体行高参数 */
    // public static SetFontLineHeight(node: cc.Node, lineHeight?: number): void;
    // public static SetFontLineHeight(node: cc.Node, path: string, lineHeight?: number): void;
    // public static SetFontLineHeight(node: cc.Node, ...args: unknown[]): void {
    //     const hasPath = args.length > 1;
    //     const path = hasPath ? args[0] : undefined;
    //     const comp = this.GetComponent(cc.Label, node, path)
    //         || this.GetComponent(cc.RichText, node, path);
    //     if (comp && comp.isValid) {
    //         const lineHeight = (hasPath ? args[1] : args[0]) as number;
    //         comp.lineHeight = lineHeight;
    //     }
    // }

    // /** 设置UI透明度 */
    // public static SetUIOpacity(node: cc.Node, opacity: number): void;
    // public static SetUIOpacity(node: cc.Node, path: string, opacity: number): void;
    // public static SetUIOpacity(node: cc.Node, ...args: unknown[]): void {
    //     const hasPath = args.length > 1;
    //     const comp = this.GetComponent(UIOpacity, node, args[0]);
    //     if (comp && comp.isValid) {
    //         const opacity = (hasPath ? args[1] : args[0]) as number;
    //         comp.opacity = opacity;
    //     }
    // }

    // /** 获取UI透明度 */
    // public static GetUIOpacity(node: cc.Node, path?: string): number {
    //     const comp = this.GetComponent(UIOpacity, node, path);
    //     // return comp && comp.isValid ? comp.opacity : 255;
    // }

    // /** 设置开关状态 */
    // public static SetToggleState(node: cc.Node, checked: boolean): void;
    // public static SetToggleState(node: cc.Node, path: string, checked: boolean): void;
    // public static SetToggleState(node: cc.Node, ...args: unknown[]): void {
    //     const hasPath = args.length > 1;
    //     const comp: cc.Toggle = this.GetComponent(cc.Toggle, node, args[0]);
    //     if (comp && comp.isValid) {
    //         const checked = (hasPath ? args[1] : args[0]) as boolean;
    //         comp.isChecked = checked;
    //     }
    // }

    // /** 获取开关状态 */
    // public static GetToggleState(node: cc.Node, path?: string): boolean {
    //     const comp: cc.Toggle = this.GetComponent(cc.Toggle, node, path);
    //     return comp && comp.isValid ? comp.isChecked : false;
    // }

    // /** 设置按钮交互状态 */
    // public static SetButtonInteract(node: cc.Node, enable: boolean): void;
    // public static SetButtonInteract(node: cc.Node, path: string, enable: boolean): void;
    // public static SetButtonInteract(node: cc.Node, ...args: unknown[]): void {
    //     const hasPath = args.length > 1;
    //     const comp: cc.Button = this.GetComponent(cc.Button, node, args[0]);
    //     if (comp && comp.isValid) {
    //         const enable = (hasPath ? args[1] : args[0]) as boolean;
    //         comp.interactable = enable;
    //     }
    // }

    // /** 创建精灵 */
    // public static NewSprite(parent: cc.Node, url?: string): cc.Sprite {
    //     const node = this.NewNode(parent, [cc.Sprite]);
    //     const sp = node.getComponent(cc.Sprite);
    //     sp.sizeMode = cc.Sprite.SizeMode.RAW;
    //     sp.type = cc.Sprite.Type.SIMPLE;
    //     parent.addChild(node);
    //     UtilCocos.LoadSpriteFrame(sp, url);
    //     return sp;
    // }

    // /** 创建精灵（远程资源） */
    // public static NewSpriteRemote(parent: cc.Node, url?: string): cc.Sprite {
    //     const node = this.NewNode(parent, [cc.Sprite]);
    //     const sp = node.getComponent(cc.Sprite);
    //     sp.sizeMode = cc.Sprite.SizeMode.RAW;
    //     sp.type = cc.Sprite.Type.SIMPLE;
    //     parent.addChild(node);
    //     UtilCocos.LoadSpriteFrameRemote(sp, url);
    //     return sp;
    // }

    // /** 创建标签 */
    // public static NewLabel(parent: cc.Node, str?: string): cc.Label {
    //     const node = this.NewNode(parent, [cc.Label]);
    //     const label = node.getComponent(cc.Label);
    //     label.string = str || '';
    //     return label;
    // }

    // /** 创建富文本 */
    // public static NewRichText(parent: cc.Node, str?: string): cc.RichText {
    //     const node = this.NewNode(parent, [cc.RichText]);
    //     const richText = node.getComponent(cc.RichText);
    //     richText.string = str || '';
    //     return richText;
    // }

    /**
     * 容器填充
     * @param container 容器一般是带Layout的节点
     * @param cb 填充回调
     * @param count 填充数量
     * @param template 可选，填充模板，没有指定模板时会使用容器第一个子节点作为模板
     */
    public static LayoutFill(container: cc.Node, cb: (item: cc.Node, index: number) => void, count: number, template?: cc.Node): void {
        if (!container || !container.isValid) return;

        // 确定模板节点
        const tpl = template || container.children[0];
        if (!tpl) {
            cc.warn('LayoutFill: 没有可用的模板节点');
            return;
        }

        // 填充节点，充分利用已有的子节点
        const total = container.children.length + count;
        for (let i = 0; i < total; i++) {
            let child = container.children[i];
            if (child) {
                if (i < count) {
                    child.active = true;
                    cb(child, i);
                } else if (i === 0 && !template) {
                    child.active = false; // 没有指定模板的情况下保留第一个子节点
                } else {
                    child.destroy();
                }
            } else if (i < count) {
                child = cc.instantiate(tpl);
                child.active = true;
                child.parent = container;
                cb(child, i);
            }
        }
    }

    /**
     * 通过路径获取节点的子节点。（不可出现重名子节点）
     * @param node
     * @param path 子节点路径
     * @returns
     */
    public static getChildByPath(node: cc.Node, path: string): cc.Node {
        const segments = path.split('/');
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let lastNode: cc.Node = node;
        for (let i = 0; i < segments.length; ++i) {
            const segment = segments[i];
            if (segment.length === 0) {
                continue;
            }
            const next = lastNode.children.find((childNode) => childNode.name === segment);
            if (!next) {
                return null;
            }
            lastNode = next;
        }
        return lastNode;
    }

    /**
     * 设置label的品质颜色
     * @param label cc.Label
     * @param quality 品质
     */
    public static setLableQualityColor(label: cc.Label, quality: number): void {
        UtilColorFull.resetMat(label);
        if (quality === ItemQuality.COLORFUL) {
            UtilColorFull.setColorFull(label, false);
        } else {
            label.node.color = UtilColor.Hex2Rgba(UtilItem.GetItemQualityColor(quality, true));
        }
    }
}
