/* eslint-disable max-len */
/*
 * @Author: zs
 * @Date: 2023-02-25 18:31:56
 * @Description:
 *
 */
import { CompleteCallback, LoadInfo } from './ResConst';
import { ResLoadBase } from './ResLoadBase';

interface ISpineAssetData {
    atlas: cc.TextAsset,
    json: cc.JsonAsset,
    texture: cc.Texture2D
}

export class ResLoadSpine extends ResLoadBase<sp.SkeletonData> {
    public constructor() {
        super('sp.SkeletonData');
    }

    protected loadRemote(path: string, callback: CompleteCallback<sp.SkeletonData>, target: object, loadInfo: LoadInfo, ...args: any[]): void {
        for (let i = 0; i < loadInfo.pathNum; i++) {
            const pathNoSuffix = loadInfo.getPathNoSuffixByIndex(i);
            const atlasPath = `${pathNoSuffix}.atlas`;
            const jsonPath = `${pathNoSuffix}.json`;
            const texturePath = loadInfo.getPathByIndex(i);
            const assetData: ISpineAssetData = cc.js.createMap(true);
            let isNeedClear: boolean = false;
            this.resMgr._loadRemote<cc.TextAsset>(atlasPath, (e, atlas) => {
                if (isNeedClear) {
                    this.clearAsset(assetData, atlas);
                    return;
                }
                if (e) {
                    isNeedClear = true;
                    this.clearAsset(assetData);
                    this.loadResult(e, undefined, atlasPath, callback, target, loadInfo, ...args);
                    return;
                }
                assetData.atlas = atlas;
                isNeedClear = this.loadSpinResult(pathNoSuffix, assetData, callback, target, loadInfo, ...args);
            }, this);
            this.resMgr._loadRemote<cc.JsonAsset>(jsonPath, (e, json) => {
                if (isNeedClear) {
                    this.clearAsset(assetData, json);
                    return;
                }
                if (e) {
                    isNeedClear = true;
                    this.clearAsset(assetData);
                    this.loadResult(e, undefined, jsonPath, callback, target, loadInfo, ...args);
                    return;
                }
                assetData.json = json;
                isNeedClear = this.loadSpinResult(pathNoSuffix, assetData, callback, target, loadInfo, ...args);
            }, this);
            this.resMgr._loadRemote<cc.Texture2D>(texturePath, (e, texture) => {
                if (isNeedClear) {
                    this.clearAsset(assetData, texture);
                    return;
                }
                if (e) {
                    isNeedClear = true;
                    this.clearAsset(assetData);
                    this.loadResult(e, undefined, texturePath, callback, target, loadInfo, ...args);
                    return;
                }
                texture.addRef();
                assetData.texture = texture;
                isNeedClear = this.loadSpinResult(pathNoSuffix, assetData, callback, target, loadInfo, ...args);
            }, this);
        }
    }

    private clearAsset(assetData: ISpineAssetData, asset?: cc.Asset) {
        if (assetData) {
            assetData.atlas?.decRef();
            assetData.json?.decRef();
            if (assetData.texture) {
                assetData.texture.decRef();
            }
            assetData.atlas = null;
            assetData.json = null;
            assetData.texture = null;
            assetData = cc.js.createMap(true);
        }
        asset?.decRef();
    }

    protected loadSpinResult(path: string, assetData: ISpineAssetData, callback: CompleteCallback<sp.SkeletonData>, target: object, loadInfo: LoadInfo, ...args: any[]): boolean {
        let isNeedClear: boolean = false;
        let skeletonData = this.getCache(path);
        if (skeletonData) {
            isNeedClear = true;
            this.doCallback(undefined, skeletonData, callback, target, loadInfo, ...args);
            this.clearAsset(assetData);
        } else if (assetData.atlas && assetData.json && assetData.texture) {
            skeletonData = new sp.SkeletonData();
            skeletonData.skeletonJson = assetData.json.json;
            skeletonData.atlasText = assetData.atlas.text;
            skeletonData.textures = [assetData.texture];
            // eslint-disable-next-line dot-notation
            skeletonData['_uuid'] = assetData.texture['_uuid'];
            // texture还在使用，不需要清除
            assetData.texture.addRef();
            this.clearAsset(assetData);
            this.loadResult(undefined, skeletonData, path, callback, target, loadInfo, ...args);
        }
        return isNeedClear;
    }
}
