/*
 * @Author: zs
 * @Date: 2023-02-14 18:01:15
 * @Description:
 *
 */
import {
 _decorator, Component, Node, v2, instantiate,
} from 'cc';
// import BuildManager, { CityInfo } from '../../gamelogic/scripts/build/BuildManager';
import { EventM } from '../core/event/EventM';
import { BundleType } from '../global/GConst';
import { BaseView } from '../ui/base/BaseView';
import UIManager from '../ui/UIManager';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = BuildLayer
 * DateTime = Tue Mar 29 2022 10:17:06 GMT+0800 (中国标准时间)
 * Author = zengsi
 * FileBasename = BuildLayer.ts
 * FileBasenameNoExtension = BuildLayer
 * URL = db://assets/scripts/layer/BuildLayer.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('BuildLayer')
export class BuildLayer extends BaseView {
    protected onLoad(): void {
        this.on(EventM.Type.BuildLayer.AddBuild, this.onAddBuild);
    }

    protected start(): void {
        // const build = EntityManager.I.addBuild();
        // const build2 = EntityManager.I.addBuild(8192, 5807);
        // build.on(Node.EventType.TOUCH_END, this.onCityClicked, this);
        // build2.on(Node.EventType.TOUCH_END, () => {
        //     MsgToast.Show('进攻');
        // }, this);
        // const build = new Node('city1');
        // build.addComponent(UITransform);
        // const sprite = build.addComponent(Sprite);
        // const url = `http://192.168.123.95/h5/build/city/1001.png`;
        // UtilsCC.setSprite(sprite, url);
        // build.setPosition(x, y);
        // this.EntityLayer.node.addChild(build);
        // return build;
        // BuildManager.I.addBuild(100001, 1001, v2(7800, 6900));
    }

    private onAddBuild(cityInfo: CityInfo) {
        UIManager.I.showPrefab(this.node, 'prefabs/build/City', BundleType.gamelogic, undefined, this, cityInfo);
    }
}
