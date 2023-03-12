import { CCDynamicAtlasMgr } from '../../../app/engine/atlas/CCDynamicAtlasMgr';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('自定义组件/CCDAN')
export default class CCDAN extends cc.Component {
    @property(cc.String)
    private key: string = '';

    private _danState = false;
    protected onLoad(): void {
        // super.onLoad();
        if (this.key === 'WinTab') {
            this.key = `WinTab${new Date().getTime()}`;
        }
        CCDynamicAtlasMgr.I.addRef(this.key);
    }
    protected onDestroy(): void {
        // super.onDestroy();
        if (this._danState) return;
        // eslint-disable-next-line dot-notation
        if (this['_objFlags']) {
            CCDynamicAtlasMgr.I.delRef(this.key);
        }
    }
}
