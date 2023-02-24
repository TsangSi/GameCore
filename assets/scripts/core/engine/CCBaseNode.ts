/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable dot-notation */
import {
    Label, Node, Prefab, Sprite, SpriteFrame,
} from 'cc';
import { EDITOR } from 'cc/env';
import { ResM } from '../resload/ResM';

interface INode {
    _prefab: Prefab
    _parent: Node
    _onBatchCreated: (dontSyncChildPrefab: boolean) => void
}
interface IPrefab {
    root?: Node
}

const _instantiate = Node.prototype['_instantiate'];
/** 主动调用instantiate会进来这里，处理引用计数 */
Node.prototype['_instantiate'] = function (cloned: INode, isSyncedNode) {
    if (!cloned) {
        cloned = _instantiate.apply(this, this);
    } else {
        const newPrefabInfo = cloned._prefab as unknown;
        if (EDITOR && newPrefabInfo) {
            if (cloned === newPrefabInfo['root']) {
                // newPrefabInfo.fileId = '';
            } else {
                // const PrefabUtils = Editor.require('scene://utils/prefab');
                // PrefabUtils.unlinkPrefab(cloned);
            }
        }
        // if (CC_EDITOR && engine._isPlaying) {
        //     const syncing = newPrefabInfo && cloned === newPrefabInfo.root && newPrefabInfo.sync;
        //     if (!syncing) {
        //         cloned._name += ' (Clone)';
        //     }
        // }

        // reset and init
        cloned._parent = null;
        cloned._onBatchCreated(isSyncedNode);
    }

    if (cloned instanceof Node) {
        if (EDITOR) {
            if (cloned?._prefab.asset && !cloned?._prefab?.root) {
                console.warn('node[\'_prefab\'].root is null, name:', cloned.name);
            }
        }
        const isClonePrefab = cloned?._prefab.asset && cloned?._prefab?.root === cloned;
        exCheckNodes(cloned, isClonePrefab);
    }
    return cloned;
};

const exCheckNodes = (node, isClonePrefab = true) => {
    // if (EDITOR) {
    //     if (node['_prefab'] && node['_prefab'].asset && !node['_prefab'].root) {
    //         console.warn('node[\'_prefab\'].root is null, name:', node.name);
    //     }
    //     node.children.forEach((child) => {
    //         exCheckNodes(child);
    //     });
    //     return;
    // }
    if (node instanceof Node) {
        if (node['_prefab']?.asset && node['_prefab'].root === node) {
            node['_prefab'].asset.addRef();
        }
    }
    const sp = node.getComponent(Sprite);
    if (sp && sp.spriteFrame) {
        if (!isClonePrefab || sp._frameUuid) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            sp.addRef();
        }
    }
    const lb = node.getComponent(Label);
    if (lb && lb.font) {
        const spriteFrame = lb.font._spriteFrame as SpriteFrame;
        if (!isClonePrefab || lb._frameUuid) {
            if (spriteFrame) {
                lb._frameUuid = spriteFrame._uuid;
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
