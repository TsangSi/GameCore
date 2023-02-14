/* eslint-disable max-len */
import Actor from './Actor';

export default class Monster extends Actor {
    // private anim: ActionBase = undefined;
    public constructor(id?: number) {
        super(id);
        // this.Type = EntityType.Monster;
        this.__name = 'Monster';
    }
    // updateAttri(attri_type: string, attri_value: any) {
    //     super.updateAttri(attri_type, attri_value);
    // }

    // updateModeBody(resID, resType: string, dir?: number) {
    //     if (!this.Body) {
    //         this.Body = new ActionBase(resID, resType);
    //         this.Body.play();
    //         this.Body.layer = this.layer;
    //         this.Body.name = 'Monster';
    //         this.addChild(this.Body);
    //     } else {
    //         this.Body.updateShowAndPlay(resID, resType, dir);
    //     }
    // }

    // /** 变身 */
    // transformShow(resID: number | string, resType: string, resDirect = -1, resAction = ACTION_STATUS_TYPE.Stand, wardMode: WarpMode = AnimationClip.WrapMode.Loop) {
    //     if (this.Body) {
    //         this.Body.updateShowAndPlay(resID, resType, resDirect, resAction, wardMode);
    //     }
    // }

    // playAction(resAction: ACTION_STATUS_TYPE.Stand, resDirect: number = null, warpMode: WarpMode = AnimationClip.WrapMode.Loop, callback: () => void = null, context: any = null) {
    //     if (this.Body) {
    //         this.Body.playAction(resAction, resDirect, warpMode);
    //     }
    // }

    // stopAllActions() {
    //     if (this.Body) {
    //         Tween.stopAllByTarget(this.Body);
    //     }
    // }
}
