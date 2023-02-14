import {
 AnimationClip, assetManager, Component, find, js, _decorator,
} from 'cc';
import { EffectManager } from '../../../scripts/common/EffectManager';
import { EventM } from '../../../scripts/core/event/EventM';
import { Executor } from '../../../scripts/core/executor/Executor';
import { PAGE_NAME, UI_NAME } from '../../../scripts/ui/UIConfig';
import UIManager from '../../../scripts/ui/UIManager';
import UtilsCC from '../../../scripts/utils/UtilsCC';

const { ccclass } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {
    private name_ = 'MainUI';

    onLoad() {
    }

    start() {
        this.eventDemo();
        this.executorDemo();

        // let b = UtilsCC.getButton('btn_beibao', this.node);
        UtilsCC.setClickEvent('btn_beibao', this.node, 'onClickBag', this);
        UtilsCC.setState('btn_beibao', this.node, true);
        UtilsCC.setInteractable('btn_beibao', this.node, false);

        UtilsCC.setClickEvent('group_up/group_hade/img_touxiangkuang01', this.node, 'on_head_clicked', this);
        UtilsCC.setClickEvent('group_bottom/btn_xianzhong', this.node, 'on_xianzong_clicked', this);
        UtilsCC.setClickEvent('group_bottom/btn_beibao', this.node, 'on_bag_clicked', this);
        UtilsCC.setClickEventOnly('group_bottom/group_right_icon/btn_zjm_gengduo', this.node, 'on_more_clicked', this);
    }

    on_xianzong_clicked() {
        UIManager.I.show(UI_NAME.Sword);
    }

    on_head_clicked() {
        UIManager.I.show(UI_NAME.Role, PAGE_NAME.Page2, {
 a: 1, b: 2, c: '3333', d: false,
});
    }

    on_bag_clicked() {
        UIManager.I.show(UI_NAME.BagMain);
    }

    private caches = [];
    on_more_clicked() {
        EffectManager.I.showEffect('e/bag/ui_6254', this.node, AnimationClip.WrapMode.Loop, () => {
            // if (this.item_data && this.border) {
            // this.destroyAllChildByNode(this.border);
            // this.border.addChild(node);
            // this.setNewActive(this.show_src === ShowSrc.BagView && this.item_data && this.item_data.IsNew == 1);
            // }
        });

        EffectManager.I.showEffect('e/bag/ui_6253', find('group_bottom/btn_beibao', this.node), AnimationClip.WrapMode.Loop, () => {
            // if (this.item_data && this.border) {
            // this.destroyAllChildByNode(this.border);
            // this.border.addChild(node);
            // this.setNewActive(this.show_src === ShowSrc.BagView && this.item_data && this.item_data.IsNew == 1);
            // }
        });

        const caches = js.createMap(true);
        assetManager.assets.forEach((v, k) => {
            caches[k] = v;
        });
        for (const k in caches) {
            const v = caches[k];
            // caches.forEach((v, k) => {
            if (!this.caches[k]) {
                console.log('k, v', k, v);
            }
            // });
        }
        this.caches = caches;
        console.log('assetManager=', assetManager);
    }

    onClickBag() {
    }
    /** 事件demo */
    eventDemo() {
        EventM.I.on(EventM.Type.Main.LoadComplete, this.onLoadComplete, this);
        EventM.I.fire(EventM.Type.Main.LoadComplete, 1, 2, 3, 4);
    }

    /** 回调demo */
    private executorDemo() {
        console.log('--------生成回调执行器new Executor(this.onExecutorCallback, this, 2, 2, 2, 2)');
        const executor = new Executor(this.onExecutorCallback, this, 2, 2, 2, 2);
        console.log('执行器.invoke()');
        executor.invoke();
        console.log('执行器.invokeWithArgs(3,3,3,3)');
        executor.invokeWithArgs(3, 3, 3, 3);
        executor.clear();
    }

    private onExecutorCallback(a: string, b: number, c: number, d: number) {
        console.log(`${this.name_}的执行器回调，参数值：`, a, b, c, d);
    }

    private onLoadComplete(a: string, b: number, c: number, d: number) {
        console.log(`--------收到${EventM.Type.Main.LoadComplete}事件--------参数有a, b, c, d=`, a, b, c, d);
    }

    protected onDestroy(): void {
        EventM.I.off(EventM.Type.Main.LoadComplete, this.onLoadComplete, this);
    }
}
