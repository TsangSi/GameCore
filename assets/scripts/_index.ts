/* eslint-disable dot-notation */
import {
 Animation, assetManager, CCObject, dynamicAtlasManager, game, Label, Node, Prefab, Sprite, SpriteFrame,
} from 'cc';
import { EDITOR } from 'cc/env';
import { ResManager } from './common/ResManager';

game.frameRate = 30;
assetManager.downloader.maxConcurrency = 1000;
assetManager.downloader.maxRequestsPerFrame = 1000;
// dynamicAtlasManager.enabled = true;
window.dynamicAtlasManager = dynamicAtlasManager;
dynamicAtlasManager.maxFrameSize = 510;

const Debug = false;

const destroySpriteFrame = (spriteframe: SpriteFrame) => {
    if (Debug) { return null; }
    if (spriteframe) {
        spriteframe.decRef();
        if (spriteframe.texture && spriteframe.texture._uuid) {
            spriteframe.texture.decRef();
            if (spriteframe.texture.refCount <= 0) {
                ResManager.I.removeTexture(spriteframe.texture._uuid);
            }
        }
        if (spriteframe.refCount <= 0) {
            ResManager.I.removeSpriteFrame(spriteframe._uuid);
        }
        return null;
    }
    return spriteframe;
};

window.extDestroyImmediate = (obj: CCObject) => {
    if (Debug) { return; }
    if (EDITOR) { return; }
    if (obj instanceof Node) {
        if (obj['_prefab'] && obj['_prefab'].asset) {
            obj['_prefab'].asset.decRef();
            obj['_prefab'].asset = null;
        }
    } else if (obj instanceof Animation) {
        //
    } else if (obj instanceof Sprite) {
        destroySpriteFrame(obj.spriteFrame);
        if (obj.spriteFrame && obj.spriteFrame.refCount <= 0) {
            obj.spriteFrame = null;
        }
    } else if (obj instanceof Label) {
        if (obj.font) {
            obj.font.decRef();
        }
        if (obj['_texture']) {
            obj['_texture'] = destroySpriteFrame(obj.spriteFrame as SpriteFrame);
        }
    } else {
        // console.log('obj=', obj);
    }
};

window.extSpriteframeChanged = (oldSpriteFrame: SpriteFrame, newSpriteFrame: SpriteFrame, sp: Sprite) => {
    if (Debug) { return; }
    if (oldSpriteFrame === newSpriteFrame) { return; }
    if (oldSpriteFrame && oldSpriteFrame._uuid.length > 0) {
        oldSpriteFrame = destroySpriteFrame(oldSpriteFrame);
    }
    if (newSpriteFrame && newSpriteFrame._uuid.length > 0) {
        newSpriteFrame.addRef();
        if (newSpriteFrame.texture && newSpriteFrame.texture._uuid) {
            newSpriteFrame.texture.addRef();
        }
    }
};

function checkNodes(node: Node) {
    if (Debug) { return; }
    const sp = node.getComponent(Sprite);
    if (sp && sp.spriteFrame) {
        sp.spriteFrame.addRef();
        if (sp.spriteFrame.texture) {
            sp.spriteFrame.texture.addRef();
        }
    }
    const lb = node.getComponent(Label);
    if (lb) {
        if (lb.font) {
            lb.font.addRef();
            if (lb.font['spriteFrame']) {
                const spritef: SpriteFrame = lb.font['spriteFrame'];
                spritef.addRef();
                if (spritef['_texture']) {
                    spritef['_texture'].addRef();
                }
            }
        }
    }
    node.children.forEach((child) => {
        checkNodes(child);
    });
}

window.extInstantiate = (obj: CCObject, clone: Node) => {
    if (Debug) { return; }
    if (EDITOR) { return; }
    if (obj instanceof Prefab) {
        obj.addRef();
    } else if (obj instanceof Node) {
        //
    }
    checkNodes(clone);
};
