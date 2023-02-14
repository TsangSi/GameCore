let nodes = [];
let offsetX = -720*0.5;
let offsetY = 1280*0.5;
// 模块加载的时候触发的函数
exports.load = function() {
};
// 模块卸载的时候触发的函数
exports.unload = function() {
};

// 模块内定义的方法
exports.methods = {
    createRoot(ui_info) {
        // console.warn('ui_info=');
        const scene = cc.director.getScene();
        if (scene) {
            nodes.length = 0;
            let node = new cc.Node();
            node.name = ui_info.info.name;
            node.id = ui_info.info.id;
            // for (let k in cc) {
            //     console.warn('kkkkkkkk=',k, cc[k]);
            // }
            // console.warn('a==', ui_info.uuids);
            // console.warn('b==', ui_info.imgs);
            let ui_form = node.addComponent(cc.UITransformComponent);
            ui_form.width = ui_info.info.width;
            ui_form.height = ui_info.info.height;
            // ui_form.setAnchorPoint(0, 1);
            // node.position.set(-720*0.5, 1280*0.5);
            // node.name = root_name;
            // console.warn('ui_info=', ui_info.a);
            for (let i = 0; i < ui_info.info.children.length; i++) {
                // console.warn('========', i, ui_info.info.children[i]);
                this.createNode(ui_info.info.children[i], node, ui_info);
            }
            cc.find('Canvas').getChildByName('UI').addChild(node);
            // Editor.Message.request('scene', 'save-scene');
        } else {
            console.warn('Scene not found');
        }
    // }
    },

    getParentPos(node) {
        if (!node) {
            return cc.v2(0,0);
        }
        let pos = cc.v2(node.position.x, node.position.y);
        let parent_pos = this.getParentPos(node.parent);
        pos.x = pos.x + parent_pos.x;
        pos.y = pos.y + parent_pos.y;
        return pos;
    },

    /** 添加精灵组件 */
    addSprite(node, info) {
        let img_uuid = info.uuid;
        let sp = node.addComponent(cc.SpriteComponent);
        sp.sizeMode = cc.SpriteComponent.SizeMode.CUSTOM;
        this.setSpriteFrame(node.uuid, img_uuid);
        if (info.scale9Grid) {
            sp.type = cc.SpriteComponent.Type.SLICED;
        }
    },

    /** 设置精灵spriteframe */
    setSpriteFrame(node_uuid, img_uuid) {
        let data = {
            uuid: node_uuid,
            path: '__comps__.1.spriteFrame',
            dump:{
                type: "cc.SpriteFrame",
                value: {
                    uuid: img_uuid
                }
            }
        };
        Editor.Message.request('scene', 'set-property', data);
    },

    /** 更新精灵spriteframe */
    updateSpriteFrame(old_uuid, new_uuid) {
        for (let i = 0; i < nodes.length; i++) {
            let sp = nodes[i].getComponent(cc.SpriteComponent);
            if (sp && sp.spriteFrame) {
                if (sp.spriteFrame._uuid == old_uuid) {
                    this.setSpriteFrame(sp.node.uuid, new_uuid);
                }
            }
        }
    },

    /** 添加文本Label */
    addLabel(node, info) {
        let label = node.addComponent(cc.LabelComponent);
        label.string = info.text;
        label.fontSize = info.fontSize || 22;
        label.lineHeight = info.lineHeight || label.fontSize;
        label.color = cc.color(info.color);
    },

    /** 添加按钮Button */
    addButton(node) {
        let btn = node.addComponent(cc.ButtonComponent);
        btn.transition = cc.ButtonComponent.Transition.SCALE;
        btn.zoomScale = 0.9;
    },

    createNode(info, parent, ui_info) {
        let node = new cc.Node();
        parent.addChild(node);
        node.name = info.name;
        let ui_form = node.addComponent(cc.UITransformComponent);
        ui_form.width = info.width;
        ui_form.height = info.height;
        // ui_form.setAnchorPoint(0, 1);
        let parent_pos = this.getParentPos(parent);
        node.position.set(info.x + info.width*ui_form.anchorX + offsetX - parent_pos.x, info.y - info.height*ui_form.anchorY + offsetY - parent_pos.y);
        if (info.type == 'img') {
            if (info.src) {
                this.addSprite(node, info);
            }
        } else if (info.type == 'text') {
            this.addLabel(node, info);
        } else if (info.type == 'button') {
            if (info.src) {
                this.addSprite(node, info);
            }
            this.addButton(node);
        } else if (info.type == 'check') {
            
        } else if (info.type == 'radio') {
            
        } else if (info.type == 'node') {
            for (let i = 0; i < info.children.length; i++) {
                this.createNode(info.children[i], node, ui_info);
            }
        } else {
            console.warn('not found info.type=', info);
        }
        nodes.push(node);
    },

    // getImgSrc(ui_info, name) {
    //     for (let i = 0, n = ui_info.imgs.length; i < n; i++) {
    //         if (ui_info.imgs[i].name == name) {
    //             return ui_info.imgs[i].src;
    //         }
    //     }
    // },

    // getImgUuid(ui_info, name) {
    //     for (let i = 0, n = ui_info.uuids.length; i < n; i++) {
    //         if (ui_info.uuids[i].name == name) {
    //             return ui_info.uuids[i].uuid;
    //         }
    //     }
    // }
    // "create-psd-node": async function (event, argList) {
    //     console.log('create-psd-node');
    //     console.log('canvas=', cc.find('Canvas'));
    // }
};