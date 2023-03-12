/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Author: kexd
 * @Date: 2022-03-30 13:56:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-11 22:14:34
 * @FilePath: \SanGuo\assets\script\game\map\EntityLayer.ts
 * @Description: 物品层：主要作为展示编辑器里的物品，这里删了一些不需编辑用的变量和接口
 *
 */
import AttributeEditor from '../base/mapBase/attribute/AttributeEditor';
import AttributeUtils from '../base/mapBase/attribute/AttributeUtils';
import EditorElement from '../base/mapBase/EditorElement/EditorElement';
import EditorNPC from '../base/mapBase/EditorElement/EditorNPC';
import MapLayer from './MapLayer';

const { ccclass } = cc._decorator;

@ccclass
export class EntityLayer extends cc.Component {
    private _mapUnitArr: EditorElement[] = [];
    private _mapItems: { isload: boolean, mapItem: object }[] = [];
    private _itemIndex: number = 0;

    public static I: EntityLayer;

    protected start(): void {
        EntityLayer.I = this;
    }

    protected onDestroy(): void {
        EntityLayer.I = null;
    }

    /**
     * 初始化地图数据里的物体对象
     * @param mapItems
     */
    public initMapUintInfo(mapItems: object[]): void {
        this.clear();
        this._mapItems = [];
        this._itemIndex = 0;
        for (let i = 0; i < mapItems.length; i++) {
            this._mapItems.push({ isload: false, mapItem: mapItems[i] });
        }
    }

    /** 每帧只处理一个对象 */
    private dealEntity() {
        if (!this._mapItems || this._mapItems.length === 0) {
            return;
        }

        this._itemIndex++;
        if (this._itemIndex >= this._mapItems.length) {
            this._itemIndex = 0;
        }

        let paramArr: AttributeEditor[];
        let param: AttributeEditor;
        const mapItem: any = this._mapItems[this._itemIndex];
        if (mapItem && mapItem.mapItem.type === 'npc') {
            if (!mapItem.isload && MapLayer.I.isInBlocks(mapItem.mapItem.x, mapItem.mapItem.y)) {
                mapItem.isload = true;
                const nd: cc.Node = new cc.Node();
                const mapUnit: EditorNPC = nd.addComponent(EditorNPC);
                mapUnit.init(mapItem.mapItem.skin, mapItem.mapItem.objType);
                paramArr = AttributeUtils.I.getObjectEditAttribute(mapUnit);
                for (let j = 0; j < paramArr.length; j++) {
                    param = paramArr[j];
                    mapUnit[param.attribute] = mapItem.mapItem[param.attribute];
                }
                this.addMapUnit(mapUnit);
            } else if (mapItem.isload && MapLayer.I.isOutBlocks(mapItem.mapItem.x, mapItem.mapItem.y)) {
                mapItem.isload = false;
                this.removeMapUnit(this._itemIndex);
            }
        }
    }

    public mainUpdate(dt: number): void {
        if (!this.node.active) {
            return;
        }
        this.dealEntity();
    }

    private addMapUnit(mapUnit: EditorElement): void {
        this._mapUnitArr.push(mapUnit);
        this.node.addChild(mapUnit.node);
        mapUnit.node.setPosition(mapUnit.x, mapUnit.y);
        // console.log('----addMapUnit ---- this._mapUnitArr=', this._mapUnitArr);
    }

    private removeMapUnit(index: number): void {
        const mapUnit = this._mapUnitArr[index];
        if (mapUnit) {
            this._mapUnitArr.splice(index, 1);
            mapUnit.node.removeFromParent();
            mapUnit.destroy();
            // console.log('----removeMapUnit ---- this._mapUnitArr=', this._mapUnitArr);
        } else {
            // console.log('==== removeMapUnit 不存在====', index);
        }
    }

    public getMapUnits(): EditorElement[] {
        return this._mapUnitArr;
    }

    public clear(): void {
        this._mapUnitArr.forEach((mapUnit: EditorElement) => {
            mapUnit.node.removeFromParent();
            mapUnit.node.destroy();
        });

        this._mapUnitArr = [];

        // console.log('----------------clear this._mapUnitArr-----------------');
    }
}
