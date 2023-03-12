/*
 * @Author: kexd
 * @Date: 2022-04-25 15:11:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-25 19:00:33
 * @FilePath: \SanGuo2.4\assets\script\game\map\MapArea.ts
 * @Description: 地图512*512的块
 *
 */

import { AssetType } from '../../app/core/res/ResConst';
import { ResMgr } from '../../app/core/res/ResMgr';
import MapCfg, { MAP_CONFIG } from './MapCfg';

export class MapArea extends cc.Node {
    private _isLoading: boolean = false;
    private _reLoadTimer: NodeJS.Timer = null;

    public constructor() {
        super();
        const spr = this.addComponent(cc.Sprite);
        spr.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        // const trans = this.addComponent(UITransform);
        this.anchorX = 0;
        this.anchorY = 0;
        this.width = MAP_CONFIG.mapBlockX;
        this.height = MAP_CONFIG.mapBlockY;
    }

    public get isLoading(): boolean {
        return this._isLoading;
    }

    private setTexture(sp: cc.SpriteFrame) {
        if (sp && this.isValid) {
            this.active = true;
            sp.getTexture().setWrapMode(cc.Texture2D.WrapMode.CLAMP_TO_EDGE, cc.Texture2D.WrapMode.CLAMP_TO_EDGE);
            this.getComponent(cc.Sprite).spriteFrame = sp;
            this.subLoadMap();
        }
    }

    public loadMapAreaMark(mark: string, mapId: number): void {
        if (this._reLoadTimer) {
            // 复用时清除重试延时
            clearTimeout(this._reLoadTimer);
            this._reLoadTimer = null;
        }

        if (!this.isValid || mapId !== MapCfg.I.mapId || !MapCfg.I.mapData) {
            return;
        }

        this.name = mark;
        this._isLoading = true;

        const mPath: string = `map/map_${MapCfg.I.mapRes}/${mark}`;
        this.active = false;

        ResMgr.I.loadRemote(mPath, AssetType.SpriteFrame_jpg, (err, sp: cc.SpriteFrame) => {
            if (!err) {
                sp.getTexture().packable = false;
                this.setTexture(sp);
            } else {
                console.log('mapData 加载失败,这个图块不再要了,置true');
                this.subLoadMap();
                // 如果加载失败500毫秒后重试
                this._reLoadTimer = setTimeout(() => {
                    clearTimeout(this._reLoadTimer);
                    this._reLoadTimer = null;
                    this.loadMapAreaMark(mark, mapId);
                }, 500);
            }
        });
    }

    public loadMapArea(mapAreaY: number, mapAreaX: number, mapId: number): void {
        this.loadMapAreaMark(`${mapAreaY}_${mapAreaX}`, mapId);
    }

    public destroy(): boolean {
        this._isLoading = false;
        this.active = false;
        this.setTexture(null);
        return super.destroy();
    }

    private subLoadMap() {
        this._isLoading = false;
        // if (MapCfg.I.isLoadMapComplete === false) {
        //     MapCfg.I.loadingMapCount--;
        // }
    }
}
