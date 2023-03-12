/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable func-names */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HtmlTextParser } from '../../base/utils/UtilHtmlTextParser';
import { FrameBlockMgr } from './FrameBlockMgr';

cc.game.once(cc.game.EVENT_ENGINE_INITED, () => {
    if (CC_EDITOR) return;
    if (!FrameBlockMgr.I.openFrameBlock) { return; }

    const _resetAssembler_RC = cc.RenderComponent.prototype['_resetAssembler'];
    cc.RenderComponent.prototype['_resetAssembler'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        _resetAssembler_RC.call(this);
    };

    const __preload = cc.RenderComponent.prototype['__preload'];
    cc.RenderComponent.prototype['__preload'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        __preload.call(this);
    };
    const onEnable_RC = cc.RenderComponent.prototype['onEnable'];
    cc.RenderComponent.prototype['onEnable'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        onEnable_RC.call(this);
    };
    const onDisable_RC = cc.RenderComponent.prototype['onDisable'];
    cc.RenderComponent.prototype['onDisable'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        onDisable_RC.call(this);
    };

    const onDestroy_RC = cc.RenderComponent.prototype['onDestroy'];
    cc.RenderComponent.prototype['onDestroy'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        onDestroy_RC.call(this);
    };
    const setVertsDirty_RC = cc.RenderComponent.prototype['setVertsDirty'];
    cc.RenderComponent.prototype['setVertsDirty'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        setVertsDirty_RC.call(this);
    };
    const _on3DNodeChanged_RC = cc.RenderComponent.prototype['_on3DNodeChanged'];
    cc.RenderComponent.prototype['_on3DNodeChanged'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        _on3DNodeChanged_RC.call(this);
    };
    const markForValidate_RC = cc.RenderComponent.prototype['markForValidate'];
    cc.RenderComponent.prototype['markForValidate'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        markForValidate_RC.call(this);
    };

    // 无需屏蔽 因为markForValidate已经屏蔽
    // const markForRender_RC = cc.RenderComponent.prototype.markForRender;
    // cc.RenderComponent.prototype.markForRender = function () {
    //    if (!CC_EDITOR&&this instanceof cc.Label && !(this._N$file && this._N$file instanceof cc.BitmapFont)) return;
    //     markForRender_RC.call(this);
    // };

    const disableRender_RC = cc.RenderComponent.prototype['disableRender'];
    cc.RenderComponent.prototype['disableRender'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        disableRender_RC.call(this);
    };
    // 无需屏蔽
    const _setMaterial = cc.RenderComponent.prototype.setMaterial;
    cc.RenderComponent.prototype.setMaterial = function (index, material) {
        if (!CC_EDITOR) {
            if (material !== this._materials[index]) {
                material = cc.MaterialVariant.create(material, this);
                this._materials[index] = material;
            }
            this._updateMaterial();
            // this.markForRender(true);
            return material;
        } else {
            _setMaterial.call(this);
        }
    };

    // 无需屏蔽 子类cc.Label已经屏蔽
    const _activateMaterial = cc.RenderComponent.prototype['_activateMaterial'];
    cc.RenderComponent.prototype['_activateMaterial'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        _activateMaterial.call(this);
    };
    const _updateColor_RC = cc.RenderComponent.prototype['_updateColor'];
    cc.RenderComponent.prototype['_updateColor'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        _updateColor_RC.call(this);
    };

    // 对Label属性进行hack
    Object.defineProperty(cc.Label.prototype, 'useSystemFont', {
        get() {
            return this._isSystemFontUsed;
        },
        set(value) {
            if (this._isSystemFontUsed === value) return;
            this._isSystemFontUsed = !!value;
            if (CC_EDITOR) {
                if (!value && this._userDefinedFont) {
                    this.font = this._userDefinedFont;
                    this.spacingX = this._spacingX;
                    return;
                }
            }
            if (value) {
                this.font = null;
                if (!this.enabledInHierarchy) return;
                this._forceUpdateRenderData();
            }
            this.setVertsDirty();
            this.markForValidate();// 校验是否可以渲染
        },
        animatable: false,
        tooltip: CC_DEV && 'i18n:COMPONENT.label.system_font',
    });
    //
    const onLoad = cc.Label.prototype['onLoad'];
    cc.Label.prototype['onLoad'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        onLoad.call(this);
    };
    //
    const onEnable = cc.Label.prototype['onEnable'];
    cc.Label.prototype['onEnable'] = function () {
        this.setVertsDirty();
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        onEnable.call(this);
    };
    //
    const onDisable = cc.Label.prototype['onDisable'];
    cc.Label.prototype['onDisable'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        onDisable.call(this);
    };
    //
    const onDestroy = cc.Label.prototype['onDestroy'];
    cc.Label.prototype['onDestroy'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        onDestroy.call(this);
    };
    const onRestore = cc.Label.prototype.onRestore;
    cc.Label.prototype.onRestore = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        onRestore.call(this);
    };

    //
    const setVertsDirty = cc.Label.prototype['setVertsDirty'];
    cc.Label.prototype['setVertsDirty'] = function () {
        if (window['blockLabelRender']) { // 需要被阻断渲染的
            if (window['blockLabelRender'](this)) {
                if (window['pushLabelIntoQueue']) {
                    window['pushLabelIntoQueue'](this);// 放入池子里 后续 从label---->image
                    return;
                }
            } else if (this.node && this.node.isValid) {
                const c = this.node.getChildByName('labelLayout');
                if (c) c.destroy();
            }
        }
        setVertsDirty.call(this);
    };
    //
    const _checkStringEmpty = cc.Label.prototype['_checkStringEmpty'];
    cc.Label.prototype['_checkStringEmpty'] = function () {
        // eslint-disable-next-line dot-notation
        if (window[`blockLabelRender`]) { // 需要被阻断渲染的
            if (window['blockLabelRender'](this)) {
                if (window.pushLabelIntoQueue) {
                    window.pushLabelIntoQueue(this);// 放入池子里 后续 从label---->image
                    return;
                }
            } else if (this.node && this.node.isValid) {
                const c = this.node.getChildByName('labelLayout');
                if (c) c.destroy();
            }
        }
        _checkStringEmpty.call(this);
    };

    //
    cc.Label.prototype['pushIntoQueue'] = function () {
        if (window['blockLabelRender']) { // 需要被阻断渲染的
            if (window['blockLabelRender'](this)) {
                if (window['pushLabelIntoQueue']) {
                    window['pushLabelIntoQueue'](this);// 放入池子里 后续 从label---->image
                }
            } else if (this.node && this.node.isValid) {
                const c = this.node.getChildByName('labelLayout');
                if (c) c.destroy();
            }
        }
    };

    //
    const _updateColor = cc.Label.prototype['_updateColor'];
    cc.Label.prototype['_updateColor'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        _updateColor.call(this);
    };
    const _resetAssembler = cc.Label.prototype['_resetAssembler'];
    cc.Label.prototype['_resetAssembler'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        _resetAssembler.call(this);
    };

    const _on3DNodeChanged = cc.Label.prototype['_on3DNodeChanged'];
    cc.Label.prototype['_on3DNodeChanged'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        _on3DNodeChanged.call(this);
    };

    const _onBMFontTextureLoaded = cc.Label.prototype['_onBMFontTextureLoaded'];
    cc.Label.prototype['_onBMFontTextureLoaded'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        _onBMFontTextureLoaded.call(this);
    };

    const _onBlendChanged = cc.Label.prototype['_onBlendChanged'];
    cc.Label.prototype['_onBlendChanged'] = function () {
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        _onBlendChanged.call(this);
    };

    const _applyFontTexture = cc.Label.prototype['_applyFontTexture'];
    cc.Label.prototype['_applyFontTexture'] = function () {
        this.setVertsDirty();
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        _applyFontTexture.call(this);
    };

    const _updateMaterialCanvas = cc.Label.prototype['_updateMaterialCanvas'];
    cc.Label.prototype['_updateMaterialCanvas'] = function () {
        this.setVertsDirty();
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        _updateMaterialCanvas.call(this);
    };

    const _updateMaterialWebgl = cc.Label.prototype['_updateMaterialWebgl'];
    cc.Label.prototype['_updateMaterialWebgl'] = function () {
        this.setVertsDirty();
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;
        _updateMaterialWebgl.call(this);
    };

    // 直接重写
    cc.Label.prototype['_forceUpdateRenderData'] = function () {
        this.setVertsDirty();// 标记顶点脏了
        this._resetAssembler();// 重置装配器 renderdata要重新初始化？
        if (window['blockLabelRender'] && window['blockLabelRender'](this)) return;

        this._applyFontTexture();// 重新申请字图
    };
    // 直接重写
    const _updateRichText = cc.RichText.prototype['_updateRichText'];
    cc.RichText.prototype['_updateRichText'] = function () {
        const self = this;
        if (!self.enabledInHierarchy) return;
        if (CC_EDITOR) return;

        if (!self.enabled) return;

        if (window['blockRichTextRender']) {
            if (window['blockRichTextRender'](self)) {
                if (window['pushRTIntoQueue']) {
                    window['pushRTIntoQueue'](self);// 放入池子里 后续 从label---->image
                    return;
                }
            } else {
                const c = self.node.getChildByName('labelLayout');
                if (c) c.destroy();
            }
        }
        _updateRichText.call(self);
    };

    Object.defineProperty(cc.Node.prototype, 'color', {
        get() {
            return this._color.clone();
        },
        set(value) {
            if (!this._color.equals(value)) {
                this._color.set(value);
                if (CC_DEV && value.a !== 255) {
                    cc['warnID'](1626);
                }

                const comp = this.getComponent(cc.Label);
                comp && comp['setVertsDirty']();
                // this._renderFlag |= cc.RenderFlow.FLAG_COLOR;
                if (this._eventMask) {
                    this.emit(cc.Node.EventType.COLOR_CHANGED, value);
                }
            }
        },
    });
});
