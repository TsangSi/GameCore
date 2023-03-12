/*
 * @Author: myl
 * @Date: 2022-10-19 18:47:37
 * @Description:
 */

import { SpriteCustomizer } from '../../../../base/components/SpriteCustomizer';

const { ccclass, property } = cc._decorator;

@ccclass
export class SealAmuletQualityItem extends cc.Component {
    @property(SpriteCustomizer)
    private icon: SpriteCustomizer = null;

    public setState(state: boolean): void {
        this.icon.curIndex = state ? 1 : 0;
    }
}
