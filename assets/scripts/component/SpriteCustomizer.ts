import { CCInteger, Component, Sprite, SpriteFrame, _decorator } from 'cc';
import { DEV } from 'cc/env';

const { ccclass, property } = _decorator;

@ccclass('SpriteCustomizer')
export class SpriteCustomizer extends Component {
    @property({
        type: SpriteFrame,
        serializable: true,
        displayName: 'Sprite Frames',
        tooltip: DEV && '要显示sprite frames列表',
    })
    private sprite_frames: SpriteFrame[] = [];

    private _current_frame_index = 0;
    @property({
        type: CCInteger,
        displayName: 'Current Show Sprite Frame Index',
        tooltip: DEV && '当前显示的sprite frame',
        serializable: true,
    })
    get current_frame_index () {
        return this._current_frame_index;
    }
    set current_frame_index (value: number) {
        this._current_frame_index = value;
        this.__apply_current_sprite_frame();
    }

    private __apply_current_sprite_frame_running = false;

    onLoad () {
        const current_frame_index = this.current_frame_index;
        if (typeof current_frame_index === typeof 0) {
            this.current_frame_index = current_frame_index;
        }


        // for (let index in this.sprite_frames) {
        //     let spriteframe = this.sprite_frames[index];
        //     if (spriteframe) {
        //         spriteframe.addRef();
        //     }
        // }
    }

    __apply_current_sprite_frame () {
        if (this.__apply_current_sprite_frame_running) {
            return;
        }

        this.__apply_current_sprite_frame_running = true;
        if (this.current_frame_index !== Math.floor(this.current_frame_index)) {
            this.current_frame_index = Math.floor(this.current_frame_index);
        }
        if (this.current_frame_index < 0 || this.current_frame_index >= this.sprite_frames.length) {
            this.current_frame_index = 0;
        }
        let sprite_frame = null;
        const sprite = this.node.getComponent(Sprite);
        if (this.current_frame_index >= 0 && this.current_frame_index < this.sprite_frames.length) {
            sprite_frame = this.sprite_frames[this.current_frame_index];
        }

        if (sprite) {
            if (sprite.spriteFrame !== sprite_frame) {
                sprite.spriteFrame = sprite_frame;
            }
        }
        this.__apply_current_sprite_frame_running = false;
    }

    onDestroy () {
        for (let index in this.sprite_frames) {
            let spriteframe = this.sprite_frames[index];
            if (spriteframe) {
                spriteframe.decRef();
            }
        }
    }
}
