/* eslint-disable max-len */
/*
 * @Author: zs
 * @Date: 2023-02-24 17:53:49
 * @Description:
 *
 */
import {
    AssetType, CompleteCallback, IFrame, IPlistFrame, LoadInfo,
} from './ResConst';
import { ResLoadBase } from './ResLoadBase';

interface ISpriteAtlasData {
    num: number,
    plists: { [index: number]: IPlistFrame },
    textures: { [index: number]: cc.Texture2D }
}
export class ResLoadSpriteAtlas extends ResLoadBase<cc.SpriteAtlas> {
    public constructor() {
        super('SpriteAtlas');
    }

    protected loadRemote(path: string, callback: CompleteCallback<cc.SpriteAtlas>, target: object, loadInfo: LoadInfo, ...args: any[]): void {
        const atlasData: ISpriteAtlasData = cc.js.createMap(true);
        atlasData.plists = [];
        atlasData.textures = [];
        atlasData.num = loadInfo.pathNum;
        // const textures: cc.Texture2D[] = [];
        // const plists: IPlistFrame[] = [];
        let isNeedClear: boolean = false;
        for (let i = 0, n = loadInfo.pathNum; i < n; i++) {
            const texturePath = loadInfo.getPathByIndex(i);
            // eslint-disable-next-line no-loop-func
            this.resMgr.loadTexture(texturePath, loadInfo, (e, texture) => {
                if (isNeedClear) {
                    this.clearAsset(atlasData, texture);
                    return;
                }
                if (e) {
                    isNeedClear = true;
                    this.clearAsset(atlasData);
                    this.loadResult(e, undefined, texturePath, callback, target, loadInfo, ...args);
                    return;
                }
                atlasData.textures[i] = texture;
                isNeedClear = this.loadSpriteAtlasResult(path, loadInfo, atlasData, callback, target, ...args);
            });

            // 区分是否是加载的合并json
            if (loadInfo.type === AssetType.SpriteAtlas_mergeJson || loadInfo.type === AssetType.SpriteAtlas_mergeJson_astc) {
                const mergjsonPath = loadInfo.getMergeJsonPath(i);
                // eslint-disable-next-line no-loop-func
                this.resMgr.loadPlist(mergjsonPath, loadInfo, (e, plist) => {
                    if (isNeedClear) {
                        this.clearAsset(atlasData);
                        return;
                    }
                    if (e) {
                        isNeedClear = true;
                        this.clearAsset(atlasData);
                        this.loadResult(e, undefined, mergjsonPath, callback, target, loadInfo, ...args);
                        return;
                    }
                    atlasData.plists[i] = plist as IPlistFrame;
                    isNeedClear = this.loadSpriteAtlasResult(path, loadInfo, atlasData, callback, target, ...args);
                }, undefined, loadInfo.name);
            } else {
                const jsonPath = loadInfo.getPlistByIndex(i);
                // eslint-disable-next-line no-loop-func
                this.resMgr.loadPlist(jsonPath, loadInfo, (e, plist) => {
                    if (isNeedClear) {
                        this.clearAsset(atlasData);
                        return;
                    }
                    if (e) {
                        isNeedClear = true;
                        this.clearAsset(atlasData);
                        this.loadResult(e, undefined, jsonPath, callback, target, loadInfo, ...args);
                        return;
                    }
                    atlasData.plists[i] = plist as IPlistFrame;
                    isNeedClear = this.loadSpriteAtlasResult(path, loadInfo, atlasData, callback, target, ...args);
                });
            }
        }
    }

    private isLoadComplete(atlasData: ISpriteAtlasData) {
        let textureNum = 0;
        for (const index in atlasData.textures) {
            textureNum += 1;
        }
        if (atlasData.num !== textureNum) {
            return false;
        }
        let plistNum = 0;
        for (const index in atlasData.plists) {
            plistNum += 1;
        }
        if (atlasData.num !== plistNum) {
            return false;
        }
        return true;
    }

    /**
     * 加载图集结果
     * @param loadInfo 加载信息
     * @param textures 贴图对象列表
     * @param plists plist对象列表
     * @returns
     */
    private loadSpriteAtlasResult(path: string, loadInfo: LoadInfo, atlasData: ISpriteAtlasData, callback: CompleteCallback<cc.SpriteAtlas>, target: object, ...args: any[]): boolean {
        let isNeedClear: boolean = false;
        let spriteAtlas = this.getCache(path);
        if (spriteAtlas) {
            isNeedClear = true;
            this.complete(undefined, spriteAtlas, callback, target, loadInfo, ...args);
            this.clearAsset(atlasData);
        } else if (this.isLoadComplete(atlasData)) {
            spriteAtlas = this.getSpriteAtlasByPlists(atlasData.textures as cc.Texture2D[], atlasData.plists as IPlistFrame[]);
            spriteAtlas.name = loadInfo.name;
            // // texture还在使用，不需要清除
            for (const index in atlasData.textures) {
                atlasData.textures[+index]?.addRef();
            }
            this.clearAsset(atlasData);
            this.loadResult(undefined, spriteAtlas, path, callback, target, loadInfo, ...args);
        }
        return isNeedClear;
    }

    /**
     * 根据单个贴图和单个plist生成SpriteAtlas对象
     * @param texture 贴图对象
     * @param plist plist文件对象
     */
    private getSpriteAtlasByPlists(texture: cc.Texture2D, plist: IPlistFrame): cc.SpriteAtlas;
    /**
     * 根据多个贴图和多个plist生成SpriteAtlas对象
     * @param textures 贴图对象列表
     * @param plists plist文件对象列表
     */
    private getSpriteAtlasByPlists(textures: cc.Texture2D[], plists: IPlistFrame[]): cc.SpriteAtlas;
    private getSpriteAtlasByPlists(textures: cc.Texture2D | cc.Texture2D[], plists: IPlistFrame | IPlistFrame[]): cc.SpriteAtlas {
        const spriteAtlas: cc.SpriteAtlas = new cc.SpriteAtlas();
        if (Array.isArray(textures) && Array.isArray(plists)) {
            plists.forEach((plist, index) => {
                this.assembleSpriteAtlas(spriteAtlas, textures[index], plist);
            });
        } else if (!Array.isArray(textures) && !Array.isArray(plists)) {
            this.assembleSpriteAtlas(spriteAtlas, textures, plists);
        }
        return spriteAtlas;
    }

    /**
     * 根据贴图对象，plist，组装成SpriteAtlas对象
     * @param spriteAtlas 图集对象
     * @param texture 贴图对象
     * @param plist plist文件对象
     * @returns
     */
    private assembleSpriteAtlas(spriteAtlas: cc.SpriteAtlas, texture: cc.Texture2D, plist: IPlistFrame) {
        for (const fName in plist) {
            let frameData: IFrame = plist[fName];
            let frame = frameData.Frame;
            let offset = frameData.Offset;
            let fSize = frameData.SourceSize;
            const _rect = cc.rect(frame[0][0], frame[0][1], frame[1][0], frame[1][1]);
            const _offset = cc.v2(offset[0], offset[1]);
            const _size = cc.size(fSize[0], fSize[1]);
            // const sp = this.newSpriteFrame(texture);
            const sp = new cc.SpriteFrame(texture, _rect, frameData.Rotated, _offset, _size);
            // sp.setOffset(_offset);
            // sp.setOriginalSize(_size);
            // eslint-disable-next-line dot-notation
            // sp['_rect'] = _rect;
            // eslint-disable-next-line dot-notation
            // sp['_rotated'] = frameData.Rotated;
            sp.addRef();
            sp.name = fName;
            // 整图
            // eslint-disable-next-line dot-notation, @typescript-eslint/no-unsafe-member-access
            spriteAtlas['_spriteFrames'][fName] = sp;
            frameData = null;
            frame = null;
            offset = null;
            fSize = null;
        }
        // eslint-disable-next-line dot-notation
        spriteAtlas['_uuid'] = spriteAtlas['_uuid'] || texture['_uuid'];

        return spriteAtlas;
    }

    private clearAsset(atlasData: ISpriteAtlasData, asset?: cc.Asset) {
        if (atlasData) {
            for (const i in atlasData.textures) {
                const texture = atlasData.textures[+i];
                if (texture) {
                    texture.decRef();
                }
            }
            atlasData.textures = [];
            atlasData.plists = [];
        }
        asset?.decRef();
    }
}
