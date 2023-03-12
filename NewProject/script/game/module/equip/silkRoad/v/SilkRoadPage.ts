/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventClient } from '../../../../../app/base/event/EventClient';
import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilColor } from '../../../../../app/base/utils/UtilColor';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { UtilString } from '../../../../../app/base/utils/UtilString';
import { UtilTime } from '../../../../../app/base/utils/UtilTime';
import WinMgr from '../../../../../app/core/mvc/WinMgr';
import { ResMgr } from '../../../../../app/core/res/ResMgr';
import { CCAtlas } from '../../../../../app/engine/atlas/CCAtlas';
import { i18n, Lang } from '../../../../../i18n/i18n';
import { DynamicImage } from '../../../../base/components/DynamicImage';
import { TickTimer } from '../../../../base/components/TickTimer';
import MsgToastMgr from '../../../../base/msgtoast/MsgToastMgr';
import { UtilCurrency } from '../../../../base/utils/UtilCurrency';
import UtilItem from '../../../../base/utils/UtilItem';
import { ItemWhere } from '../../../../com/item/ItemConst';
import { ItemIcon } from '../../../../com/item/ItemIcon';
import { WinTabPage } from '../../../../com/win/WinTabPage';
import { E } from '../../../../const/EventName';
import { UI_PATH_ENUM } from '../../../../const/UIPath';
import { ViewConst } from '../../../../const/ViewConst';
import ControllerMgr from '../../../../manager/ControllerMgr';
import ModelMgr from '../../../../manager/ModelMgr';
import { RoleMgr } from '../../../role/RoleMgr';
import { RoadData } from '../SilkRoadConst';
import { SilkRoadMapView } from './SilkRoadMapView';
import { SilkRoadSelectView } from './SilkRoadSelectView';

const { ccclass, property } = cc._decorator;

/**
 * 西域行商
 * @author juny
 */
@ccclass
export class SilkRoadPage extends WinTabPage {
    private mapView: cc.Node = null;

    private selectView: cc.Node = null;

    public addE(): void {
        EventClient.I.on(E.SilkRoad.loadInfo, this.onSilkRoadLoadInfo, this);
        EventClient.I.on(E.SilkRoad.start, this.onSilkRoadStart, this);
    }

    public remE(): void {
        EventClient.I.off(E.SilkRoad.loadInfo, this.onSilkRoadLoadInfo, this);
        EventClient.I.off(E.SilkRoad.start, this.onSilkRoadStart, this);
    }

    protected start(): void {
        super.start();
        this.addE();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.remE();
    }

    public onSilkRoadLoadInfo(info: SilkRoadInfo): void {
        console.log(info);
        if (info.Id) {
            this.showMapView();
        } else {
            this.showSelectView();
        }
    }

    public onSilkRoadStart() {
        this.showMapView();
    }

    public init(): void {
        ControllerMgr.I.SilkRoadController.reqInfo();
    }

    private hideSelectView(): void {
        if (this.selectView) {
            this.selectView.destroyAllChildren();
            this.selectView.destroy();
            this.selectView = null;
        }
    }

    private showSelectView(): void {
        this.hideMapView();
        if (this.selectView) return;
        ResMgr.I.showPrefab(UI_PATH_ENUM.SilkRoadSelectView, this.node, (err, node) => {
            this.selectView = node;
            node.getComponent(SilkRoadSelectView).init();
        });
    }

    private hideMapView(): void {
        if (this.mapView) {
            this.mapView.destroyAllChildren();
            this.mapView.destroy();
            this.mapView = null;
        }
    }

    private showMapView(): void {
        this.hideSelectView();
        if (this.mapView) return;
        ResMgr.I.showPrefab(UI_PATH_ENUM.SilkRoadMapView, this.node, (err, node) => {
            this.mapView = node;
            node.getComponent(SilkRoadMapView).init();
        });
    }
}
