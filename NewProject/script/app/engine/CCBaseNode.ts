/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable dot-notation */
/*
 * @Author: zs
 * @Date: 2022-04-19 15:55:49
 * @Description:
 *
 */
const _instantiate = cc._BaseNode.prototype['_instantiate'];
/** 主动调用instantiate会进来这里，处理引用计数 */
cc._BaseNode.prototype['_instantiate'] = function (cloned, isSyncedNode) {
    if (!cloned) {
        cloned = _instantiate.apply(this, this);
    } else {
        const newPrefabInfo = cloned._prefab;
        if (CC_EDITOR && newPrefabInfo) {
            if (cloned === newPrefabInfo.root) {
                newPrefabInfo.fileId = '';
            } else {
                const PrefabUtils = Editor.require('scene://utils/prefab');
                PrefabUtils.unlinkPrefab(cloned);
            }
        }
        if (CC_EDITOR && cc['engine']._isPlaying) {
            const syncing = newPrefabInfo && cloned === newPrefabInfo.root && newPrefabInfo.sync;
            if (!syncing) {
                cloned._name += ' (Clone)';
            }
        }

        // reset and init
        cloned._parent = null;
        cloned._onBatchCreated(isSyncedNode);
    }

    if (cloned instanceof cc.Node) {
        if (CC_EDITOR) {
            if (cloned['_prefab'] && cloned['_prefab'].asset && !cloned['_prefab'].root) {
                console.warn('node[\'_prefab\'].root is null, name:', cloned['name']);
            }
        }
        const isClonePrefab = cloned['_prefab'] && cloned['_prefab'].asset && cloned['_prefab'].root === cloned;
        exCheckNodes(cloned, isClonePrefab);
    }
    return cloned;
};

const exCheckNodes = (node: cc.Node, isClonePrefab = true) => {
    // if (EDITOR) {
    //     if (node['_prefab'] && node['_prefab'].asset && !node['_prefab'].root) {
    //         console.warn('node[\'_prefab\'].root is null, name:', node.name);
    //     }
    //     node.children.forEach((child) => {
    //         exCheckNodes(child);
    //     });
    //     return;
    // }
    if (node['_prefab'] && node['_prefab'].asset && node['_prefab'].root === node) {
        node['_prefab'].asset.addRef();
    }
    const sp = node.getComponent(cc.Sprite);
    if (sp && sp.spriteFrame) {
        if (!isClonePrefab || sp['_frameUuid']) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            sp['addRef']();
        }
    }
    const lb = node.getComponent(cc.Label);
    if (lb && lb.font) {
        const spriteFrame = lb.font['_spriteFrame'] as cc.SpriteFrame;
        if (!isClonePrefab || lb['_frameUuid']) {
            if (spriteFrame) {
                lb['_frameUuid'] = spriteFrame['_uuid'];
                spriteFrame.addRef();
            }
        }
        // if (lb.font) {
        //     lb.font.addRef();
        //     const spriteFrame: SpriteFrame = lb.font['spriteFrame'];
        //     if (spriteFrame) {
        //         spriteFrame.addRef();
        //         if (spriteFrame.texture) {
        //             spriteFrame.texture.addRef();
        //         }
        //     }
        // }
        // if (lb.customMaterial) {
        //     lb.customMaterial.addRef();
        //     if (lb.customMaterial.effectAsset) {
        //         lb.customMaterial.effectAsset.addRef();
        //     }
        // }
    }
    node.children.forEach((child) => {
        exCheckNodes(child);
    });
};

if (!CC_EDITOR) {
    const _setParent = cc.Node.prototype.setParent;
    Object.defineProperty(cc.Node.prototype, 'parent', {
        set(value) {
            _setParent.call(this, value);
            // eslint-disable-next-line no-unused-expressions
            this['emit'] && this['emit']('parent-changed', this);
        },
        get() {
            return this._parent;
        },
    });
}
