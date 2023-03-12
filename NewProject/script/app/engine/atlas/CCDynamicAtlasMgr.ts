/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { FrameBlockMgr } from '../frameBlock/FrameBlockMgr';
import { CCAtlas } from './CCAtlas';
import { CompUtil } from './CompUtil';
import { PackedFrame } from './StructFrame';

const MAX_FRAME_SIZE = 512;
const TEXTURE_SIZE = 1024;

const AD_KEY = 'AD_KEY';/** 图集key */
const LAB_UUID = 'LAB_UUID';/** 文本uuid */

export class CCDynamicAtlasMgr {
    public static instance: CCDynamicAtlasMgr;
    private static Instance: CCDynamicAtlasMgr;
    public static get I(): CCDynamicAtlasMgr {
        if (!this.Instance) {
            this.Instance = new CCDynamicAtlasMgr();
            this.Instance._init();
        }
        return this.Instance;
    }
    /** 图集容器 */
    private _atlasDict: { [key: string]: CCAtlas } = {};
    /** 主图集与拓展图集关联列表 */
    private _atlasesExtend: { [key: string]: string[]; } = {};
    /**  图集引用数量与时间容器 */
    private _citeDict: { [key: string]: { n: number, t: number, p: number; }; } = {};
    /** 纹理内存大小 */
    private _textureMemory: number = 0;

    /** 添加引用 */
    public addRef(name: string): void {
        if (CC_EDITOR) return;
        if (!this._enabled) return;
        if (name === '') return;
        const nowTime = new Date().getTime();
        if (this._citeDict[name]) {
            const d = { n: this._citeDict[name].n + 1, t: nowTime, p: this._citeDict[name].p };
            this._citeDict[name] = d;
        } else {
            this._citeDict[name] = { n: 1, t: nowTime, p: nowTime };
        }
    }

    /** 移除引用 */
    public delRef(name: string): void {
        if (CC_EDITOR) return;
        if (!this._enabled) return;
        if (name === '') return;

        if (this._citeDict[name]) {
            const d = { n: this._citeDict[name].n - 1, t: new Date().getTime(), p: this._citeDict[name].p };
            this._citeDict[name] = d;
        }
        if (this._citeDict[name] && this._citeDict[name].n === 0) {
            const nowTime = new Date().getTime();
            const d = { n: 0, t: nowTime, p: nowTime };
            this._citeDict[name] = d;
        }
    }

    /** 获取纹理内存 */
    public getTextureMemory(): number {
        return this._textureMemory;
    }

    /** 计算纹理内存 */
    private _calculateTextureMemory() {
        let m = 0;
        for (const key in this._atlasDict) {
            if (Object.prototype.hasOwnProperty.call(this._atlasDict, key)) {
                const element = this._atlasDict[key];
                if (element._texture) {
                    const n = element._texture.height * element._texture.width * 4;
                    m += n;
                }
            }
        }
        this._textureMemory = m;
    }

    /* 检查缓存 图集无引用删除图集* */
    private _init() {
        setInterval(() => {
            CCDynamicAtlasMgr.I.checkCache(); // console.log(this._atlasDict);
        }, 2000);
    }
    /** 检测清理计数为0的图集 */
    private checkCache() {
        if (CC_EDITOR || !this._enabled) return;
        for (const key in this._citeDict) {
            if (this._citeDict[key].n === 0 && this._citeDict[key].t <= new Date().getTime()) {
                let tempKey: string[] = [];
                tempKey.push(key);
                // this.deleteAtlasByName(key);
                const item = this._atlasesExtend[key];
                if (item) {
                    const len = this._atlasesExtend[key].length;
                    for (let i = 0; i < len; i++) {
                        const e = this._atlasesExtend[key][i];
                        tempKey.push(e);
                        // this.deleteAtlasByName(e);
                    }
                    // delete this._atlasesExtend[key];
                }
                // console.log(tempKey);
                for (let i = 0; i < tempKey.length; i++) {
                    this.deleteAtlasByName(tempKey[i]);
                }
                delete this._atlasesExtend[key];
                delete this._citeDict[key];
                tempKey = [];
            }
        }
    }

    /** 开启或关闭动态图集 */
    private _enabled = true;
    public get enabled(): boolean {
        return this._enabled;
    }
    public set enabled(value: boolean) {
        if (this._enabled === value) return;
        this._enabled = value;
    }
    /** textureBleeding:两个纯色图片 打入一张图集，会导致边缘交叉混合,纹理过滤可以平滑这个边缘 */
    private _textureBleeding = true;
    public get textureBleeding(): boolean {
        return this._textureBleeding;
    }
    public set textureBleeding(enable: boolean) {
        this._textureBleeding = enable;
    }
    /** 创建的图集的宽高 */
    private _textureSize = TEXTURE_SIZE;
    public get textureSize(): number {
        return this._textureSize;
    }
    public set textureSize(value: number) {
        this._textureSize = value;
    }
    /** 可以添加进图集的图片的最大尺寸 */
    private _maxFrameSize = MAX_FRAME_SIZE;
    public get maxFrameSize(): number {
        return this._maxFrameSize;
    }
    public set maxFrameSize(value: number) {
        this._maxFrameSize = value;
    }
    /** 通过key和uuid获取图集 */
    private getAtlasBykey(key: string, uuid: string) {
        let atlas: CCAtlas = this._atlasDict[key];
        if (atlas) {
            if (atlas['_innerTextureInfos'][uuid]) {
                return atlas;
            }
        }
        atlas = null;
        const atlasInfos = this._atlasesExtend[key];
        if (atlasInfos) {
            for (let i = 0; i < atlasInfos.length; i++) {
                const name = atlasInfos[i];
                const a = this._atlasDict[name];
                if (a && a['_innerTextureInfos'][uuid]) {
                    atlas = a;
                    break;
                }
            }
        }
        return atlas;
    }

    /** 重置所有动态图集，已有的动态图集会被销毁 */
    public reset(): void {
        // const keys: string[] = [];
        // for (const name in this._atlasDict) {
        //     keys.push(name);
        // }
        // for (let i = 0; i < keys.length; i++) {
        //     this.deleteAtlasByName(keys[i]);
        // }
    }
    /** 销毁图集 */
    private deleteAtlasByName(name: string) {
        // console.log('___________________________');
        // console.log(`delete:${name}`);
        const atlas = this._atlasDict[name];
        if (atlas) {
            const atlasKey = atlas.atlasKey;
            const atlasName = atlas.atlasName;

            // for (const i in atlas['_innerTextureInfos']) {
            //     const texture = atlas['_innerTextureInfos'][i].texture;
            //     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            //     texture.destroy();
            //     delete atlas['_innerTextureInfos'][i];
            // }

            atlas._texture.decRef();
            atlas.destroy();
            delete this._atlasDict[name];
            this.clearAtlasExtend(atlasKey, atlasName);
            this._calculateTextureMemory();
        }
    }
    /** 从动态图集中删除某张碎图。 */
    // public deleteAtlasSpriteFrame(spriteFrame: cc.SpriteFrame): void {
    //     const uuid = spriteFrame[LAB_UUID];
    //     if (!uuid) return;
    //     const atlas = this.getAtlasBykey(spriteFrame[AD_KEY], spriteFrame[LAB_UUID]);
    //     if (atlas) {
    //         const tt = atlas['_innerTextureInfos'][uuid].texture as cc.Texture2D;
    //         // spriteFrame._resetDynamicAtlasFrame();
    //         // tt.reset({
    //         //     width: tt.width, height: tt.height, mipmapLevel: tt.mipmapLevel, format: tt.getPixelFormat(),
    //         // });
    //         // tt.destroy();
    //         atlas.deleteInnerTexture(tt);
    //         if (atlas.isEmpty()) {
    //             this.deleteAtlasByName(atlas.atlasName);
    //         }
    //     }
    // }

    public packToDynamicAtlas(comp: cc.Component, frame: cc.SpriteFrame): void {
        if (CC_EDITOR) return;
        if (!this.enabled) return;
        if (!frame) return;
        const texture: cc.Texture2D = frame[`_texture`]; //  frame.texture //这个是取不到值的
        if (frame && texture.packable && texture && texture.width > 0 && texture.height > 0) {
            /** bitMapFont不处理 或者存在图集不处理 */
            if (comp instanceof cc.Label && comp.font && comp.font[`spriteFrame`] || texture[`atlasName`]) return;
            if (comp[`DA`] && comp[`DA`] === '--') return; /** 过滤 带有DA属性值为'--'的组件,例如:特效 定时器label */
            this.doExecutePack(comp, frame);
        }
    }

    /** 执行图集打包 */
    private doExecutePack(comp: cc.Component, frame: cc.SpriteFrame) {
        const texture: cc.Texture2D = frame[`_texture`];
        if (comp instanceof cc.Label) { // 使用分帧,可能不会进入这里
            if (!comp.string) return;
            texture['_uuid'] = CompUtil.createLabelUuid(comp);
        }

        const key = this.findCanKey(comp.node);// 未挂载组件 key = "?"
        if (key === '?' || key === '--') return;

        // const atlas: CCAtlas = this._atlasDict[key];// 这里的key是挂载在 CCDAN里填写的Key 拿到当前图集

        // if (atlas && atlas['_innerTextureInfos'] && atlas['_innerTextureInfos'][texture['_uuid']]) {
        //     if (comp instanceof cc.Label) {
        // const packedFrame = this.insertSpriteFrame(key, frame);
        // frame._setDynamicAtlasFrame(packedFrame);
        // frame['_original'] = {
        //     _texture: frame.texture, // 源图
        //     _x: frame['_rect'].x, // packedFrame.x,
        //     _y: frame['_rect'].y, // packedFrame.y,
        // };
        // frame._texture = packedFrame.texture;
        // // eslint - disable - next - line @typescript-eslint / no - unsafe - call
        // packedFrame.texture.addRef();
        // frame['_rect'].x = packedFrame.x;
        // frame['_rect'].y = packedFrame.y;
        // frame._calculateUV();

        // frame[AD_KEY] = key;
        // frame[LAB_UUID] = texture._uuid;

        // comp._ttfSpriteFrame = frame;
        // comp._texture = frame;
        // // comp._assembler.renderData.updateTexture(frame.texture);
        // return;
        //     }
        // }

        // if (this._atlasesExtend[key]) {
        //     for (let i = 0; i < this._atlasesExtend[key].length; i++) {
        // const k = this._atlasesExtend[key][i];
        // atlas = this._atlasDict[k];
        // if (atlas && atlas['_innerTextureInfos'] && atlas['_innerTextureInfos'][texture._uuid]) {
        //     if (comp instanceof cc.Label) {
        //         const packedFrame = this.insertSpriteFrame(key, frame);
        //         frame['_original'] = {
        //             _texture: frame.texture, // 源图
        //             _x: frame['_rect'].x, // packedFrame.x,
        //             _y: frame['_rect'].y, // packedFrame.y,
        //         };
        //         frame['_texture'] = packedFrame.texture;
        //         // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        //         packedFrame.texture.addRef();
        //         frame['_rect'].x = packedFrame.x;
        //         frame['_rect'].y = packedFrame.y;
        //         frame._calculateUV();

        //         frame[AD_KEY] = key;
        //         frame[LAB_UUID] = texture._uuid;

        //         comp['_ttfSpriteFrame'] = frame;
        //         comp['_texture'] = frame;
        //         comp.renderData.updateTexture(frame.texture);
        //         return;
        //     }
        // }
        //     }
        // }

        const packedFrame: PackedFrame = this.insertSpriteFrame(key, frame, comp);
        if (!packedFrame) return;

        const r: cc.Rect = frame.getRect();
        if (frame['_original']) {
            const ori = frame.getOriginalSize();
            // console.log('------------------------------');
            if (r.width !== ori.width || r.height !== ori.height) {
                r.width = ori.width;
                r.height = ori.height;
            }
        }

        // console.log(frame);

        if (comp instanceof cc.Sprite) {
            // 新建一个SpriteFrame 往这个SpriteFrame放入当前这个图集的texture
            // 如果直接用packedFrame 会导致，许多comp都引用packedFrame 从而导致重复引用
            const newFrame: cc.SpriteFrame = new cc.SpriteFrame(
                packedFrame.texture,
                cc.rect(packedFrame.x, packedFrame.y, r.width, r.height),
                frame.isRotated(),
                frame.getOffset(),
                frame.getOriginalSize(),
            );
            packedFrame.texture.addRef();// 增加引用
            // console.log(packedFrame.texture);

            if (frame['_texture']._uuid === '7d83b67a-29d7-454d-bf47-3bee7a7fc368') {
                // 存下源图
                // console.log('红点的');

                newFrame['_original'] = {
                    _texture: frame['_texture'], // 存下源图
                    _x: frame['_rect'].x, // 存下原图
                    _y: frame['_rect'].y, // 存下原图
                };
            }
            // else {
            //     // 存下源图
            //     newFrame['_original'] = {
            //         // _texture: frame['_texture'], // 存下源图
            //         _x: frame['_rect'].x, // 存下原图
            //         _y: frame['_rect'].y, // 存下原图
            //     };
            // }
            comp.spriteFrame = newFrame;// 这里面会把frame -1  sp_frame+1
            // frame['_texture'].decRef();// 这里就把旧的texture删除了

            // sp_frame['_uuid'] = comp.spriteFrame['_uuid'];
            // comp._spriteFrame = sp_frame;
            // comp._applySpriteFrame(frame);

            // frme//旧的
            // frame._texture//旧的
            // sp_frame//新的

            // sp_frame.setTexture(packedFrame.texture);//new 时已经有texture   // comp.spriteFrame._texture = packedFrame.texture 这样不生效
            newFrame['_calculateUV']();// 由于更改了贴图 uv必须重新计算
            // sp_frame.addRef();

            // 如下两句处理九宫格异常
            newFrame['_capInsets'] = frame['_capInsets'].concat();// 保留原来的九宫格信息
            newFrame['_calculateSlicedUV']();// 重新计算九宫格信息
            newFrame[AD_KEY] = key;// 存下key
            newFrame[LAB_UUID] = texture['_uuid'];// 存下UUID
        }

        if (comp instanceof cc.Label) {
            if (comp.string === '元宝购买次数增加:') {
                console.log(comp);
                console.log(comp.node.width);
            }
            frame['_original'] = {
                _texture: frame['_texture'], // 源图
                _x: frame['_rect'].x, // packedFrame.x,
                _y: frame['_rect'].y, // packedFrame.y,
            };
            frame['_texture'] = packedFrame.texture;
            packedFrame.texture.addRef();
            frame['_rect'].x = packedFrame.x;
            frame['_rect'].y = packedFrame.y;
            frame['_calculateUV']();// 重新计算UV

            frame[AD_KEY] = key;
            frame[LAB_UUID] = texture['_uuid'];

            comp['_ttfSpriteFrame'] = frame;
        }
    }

    /** 将散图插入图集 */
    public insertSpriteFrame(key: string, spriteFrame: cc.SpriteFrame, comp): PackedFrame {
        const texture: cc.Texture2D = spriteFrame['_texture'];
        if (texture && !texture['_uuid']) { // 此处为何判断texture 的uuid ，理论上上面已经判断过拥有
            if (texture['atlasKey'] && texture['atlasKey'] === key) { // key CCDAN节点上的Key
                return null;
            }
        }

        let atlasName = key; // CCDAN节点上的Key  例如:RolePage  WinTab
        let index = 0;
        let frame: PackedFrame = null;
        while (!frame) {
            atlasName = index > 0 ? `${key}~${index}` : key;
            const atlas = this.getAtlas(atlasName, key);
            frame = atlas.insertSpriteFrame(spriteFrame, comp);
            if (!frame) {
                index++;
            }
        }
        // 图集满了 atlasExtend记录超出的图集名字
        if (atlasName !== key) {
            if (this._atlasesExtend[key]) {
                if (this._atlasesExtend[key].indexOf(atlasName) < 0) {
                    this._atlasesExtend[key].push(atlasName);
                }
            } else {
                this._atlasesExtend[key] = [atlasName];
            }
        }
        return frame;
    }

    /** 获取图集 */
    private getAtlas(name: string, key: string) { // atlasKey:AccLoginBox // atlasName:AccLoginBox~1
        let atlas = this._atlasDict[name];
        if (!atlas) {
            atlas = new CCAtlas(this._textureSize, this._textureSize, name, key);
            this._atlasDict[name] = atlas;
            this._calculateTextureMemory();
        }
        return atlas;
    }
    /** 清除超出一张的图集 */
    private clearAtlasExtend(key: string, name: string) {
        if (this._atlasesExtend[key]) {
            const index = this._atlasesExtend[key].indexOf(name);
            if (index !== -1) {
                this._atlasesExtend[key].splice(index, 1);
            }
            if (this._atlasesExtend[key].length <= 0) {
                delete this._atlasesExtend[key];
            }
        }
    }

    /** 查找节点可用的图集key  ?待定,--不需要,其他代表需要  自己找不到就找父节点的Key 直到找到 */
    private findCanKey(n: cc.Node): string {
        let key: string = '';
        let node: cc.Node = n;
        while (key === '') {
            if (!node) {
                key = '?';
                break;
            }
            if (node instanceof cc.Scene) {
                key = '?';
                break;
            }
            if (!(node instanceof cc.Node)) { key = '--'; break; }
            if (node.name === 'root') { key = '--'; break; }
            const dan = node.getComponent('CCDAN');
            if (dan) key = dan.key === '' ? '--' : dan.key;
            else node = node.parent;
        }
        return key;
    }

    private _debugNode: cc.Node = null;
    public showDebug(): void {
        const show = this._debugNode == null;
        if (show) {
            if (!this._debugNode || !this._debugNode.isValid) {
                const width = Math.floor(cc.visibleRect.width);
                const height = Math.floor(cc.visibleRect.height);
                this._debugNode = new cc.Node('DYNAMIC_ATLAS_DEBUG_NODE');
                this._debugNode.width = width;
                this._debugNode.height = height;
                this._debugNode.x = width / 2;
                this._debugNode.y = height / 2;
                this._debugNode.zIndex = cc.macro.MAX_ZINDEX;
                this._debugNode.parent = cc.director.getScene();
                cc.Camera['_setupDebugCamera']();

                const scroll = this._debugNode.addComponent(cc.ScrollView);

                const content = new cc.Node('CONTENT');
                const layout = content.addComponent(cc.Layout);
                // layout.type = cc.Layout.Type.HORIZONTAL;
                layout.type = cc.Layout.Type.VERTICAL;
                layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
                layout.spacingY = -100;
                content.width = width;
                content.height = height;
                content.scaleX = 1;
                content.scaleY = 1;
                content.anchorY = 1;
                content.parent = this._debugNode;
                scroll.content = content;
                let n = 0;

                const len = Object.keys(this._atlasDict).length;
                for (const key in this._atlasDict) {
                    n++;
                    const nodeName = new cc.Node(`图集名称${n}`);
                    nodeName.x = 0;
                    nodeName.y = 0;
                    const label = nodeName.addComponent(cc.Label);
                    label.string = `———————[${key}] (${n}/${len})———————`;
                    label.node.color = cc.Color.BLUE;
                    nodeName.parent = content;

                    const atlasNode = new cc.Node('atlas');
                    atlasNode.anchorX = 0;
                    atlasNode.x = -width / 2;
                    atlasNode.anchorY = 0.5;
                    atlasNode.width = 1024;
                    atlasNode.height = 1024;
                    const texture = this._atlasDict[key]._texture;
                    const spriteFrame = new cc.SpriteFrame();
                    spriteFrame.setTexture(texture);
                    // spriteFrame[`_texture`] = texture; //未生效
                    atlasNode.addComponent(cc.Sprite);
                    const sp = atlasNode.getComponent(cc.Sprite);
                    sp.spriteFrame = spriteFrame;
                    spriteFrame['_calculateUV']();
                    atlasNode.parent = content;
                    atlasNode.scale = width / 1024;
                }
            }
        } else if (this._debugNode) {
            this._debugNode.parent = null;
            this._debugNode = null;
        }
    }
}

// <<<<<<< HEAD
// const bol = FrameBlockMgr.I.openFrameBlock;// 开启关闭动态合图
// =======
const bol = true;// 开启关闭动态合图
cc.dynamicAtlasManager.enabled = bol;
cc.macro.CLEANUP_IMAGE_CACHE = true;

const dam = cc.dynamicAtlasManager;
dam.maxFrameSize = MAX_FRAME_SIZE;// 最大打入动态合图的图片大小
const idefDynamic: boolean = bol;

/** 由于2.x packToDynamicAtals方法 是在Assembler2D里  所以需要在 Game Init 之后，进行js注入 */
cc.game.once(cc.game.EVENT_ENGINE_INITED, () => {
    if (idefDynamic) {
        if (CC_EDITOR) return;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, dot-notation
        cc['Assembler2D'].prototype.packToDynamicAtlas = (comp, frame) => {
            if (CC_TEST) return;
            if (CC_EDITOR) return;
            // if (comp instanceof cc.Mask) return;// 遮罩去除
            // if (comp instanceof cc.Label) return;// Label去除
            CCDynamicAtlasMgr.I.packToDynamicAtlas(comp, frame);// 启用自己的合图  拦截系统默认的合图
            // eslint-disable-next-line
            const material = comp._materials[0];// 由于打入图集,此时SpriteFrame上的与材质初始纹理不同
            if (!material) return;
            if (material.getProperty('texture') !== frame._texture._texture) {
                // eslint-disable-next-line
                comp._vertsDirty = true;
                // eslint-disable-next-line
                comp._updateMaterial();
            }
        };
    }
});

// dam[`deleteAtlasSpriteFrame`] = function (frame) {
//     CCDynamicAtlasMgr.I.deleteAtlasSpriteFrame(frame);
// };
