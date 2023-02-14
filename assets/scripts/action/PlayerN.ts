import { PlayerInfo } from '../common/PlayerInfo';
import { ServerMonitor } from '../common/ServerMonitor';
import EntityManager from '../map/EntityManager';
import LoginManager from '../ui/login/LoginManager';
import Utils from '../utils/Utils';
import PlayerManager from './PlayerManager';

export class PlayerN {
    private static _I: PlayerN = null;
    static get I(): PlayerN {
        if (this._I == null) {
            this._I = new PlayerN();
        }
        return this._I;
    }

    init() {
        ServerMonitor.I.proxyOn(ProtoId.S2CRoleInfo_ID, this.onS2CRoleInfo, this);
    }

    fini() {
        ServerMonitor.I.proxyOff(ProtoId.S2CRoleInfo_ID, this.onS2CRoleInfo, this);
    }

    onS2CRoleInfo(d: S2CRoleInfo) {
        // if (d.UserId === LoginManager.I.user_id) {
        //     EntityManager.I.createMainEntity(d.UserId);
        //     const player = EntityManager.I.getPlayerAvatar();

        //     if (!Utils.isNullOrUndefined(d.A)) {
        //         d.A.forEach((element) => {
        //             if (element.v != null) {
        //                 player.updateInfo(element.k, element.v);
        //             }
        //         });
        //     }
        //     if (!Utils.isNullOrUndefined(d.B)) {
        //         d.B.forEach((element) => {
        //             if (element.v != null) {
        //                 player.updateInfo(element.k, element.v);
        //             }
        //         });
        //     }
        //     // player.updateAttri('Show_Horse_Skin', 4046);
        //     // console.log('S2CRoleInfo data=', d);
        // }
    }
}
