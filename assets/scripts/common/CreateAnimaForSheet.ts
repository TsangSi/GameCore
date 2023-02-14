import {
 Animation, Component, js, SpriteAtlas,
} from 'cc';
import { ResManager } from './ResManager';

export class CreateAnimaForSheet extends Component {
    private spriteAtlas: { [uuid: string]: SpriteAtlas; } = js.createMap(true);
    public addRef(spriteAtlas: SpriteAtlas): void {
        if (!this.spriteAtlas[spriteAtlas._uuid]) {
            this.spriteAtlas[spriteAtlas._uuid] = spriteAtlas;
            spriteAtlas.addRef();
            spriteAtlas.getSpriteFrames().forEach((s) => {
                s.addRef();
                if (s.texture) {
                    s.texture.addRef();
                }
            });
        }
    }

    public decRef(): void {
        for (const uuid in this.spriteAtlas) {
            const s = this.spriteAtlas[uuid];
            s.decRef();
            s.getSpriteFrames().forEach((f) => {
                f.decRef();
                f.texture.decRef();
                if (f.texture.refCount <= 0) {
                    ResManager.I.removeTexture(uuid);
                }
                if (f.refCount <= 0) {
                    ResManager.I.removeSpriteFrame(uuid);
                }
                f = null;
            });
        }
        this.spriteAtlas = js.createMap(true);
    }

    protected onDestroy(): void {
        const a = this.node.getComponent(Animation);
        if (a.node && a.isValid) {
            // eslint-disable-next-line dot-notation
            for (const name in a['_nameToState']) {
                a.removeState(name);
            }
            // setTimeout(() => {
            this.decRef();
            // });
            console.log('CreateAnimaForSheet. onDestroy');
        }
    }
}
