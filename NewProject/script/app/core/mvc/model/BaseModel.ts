/*
 * @Author: hrd
 * @Date: 2022-03-28 09:59:36
 * @Description: model 基础类
 * @FilePath: \SanGuo\assets\script\app\core\mvc\model\BaseModel.ts
 */
export default abstract class BaseModel {
    public constructor() {
        this._init();
    }

    private _init() {
        this.init();
    }

    public init(): void {
        //
    }

    /** 初始化该模块下的红点监听，子类需要的时候重写 */
    public registerRedDotListen(): void {
        // const cfgRoleSkinItem = Config.Get(Config.Type.Cfg_RoleSkinItem).getValueByKey(FuncId.Skin, { LSItem: 0, ZLItem: 0 });
        // const rid1 = RID.Role.Role.Skin.SkinPage.LianShen;
        // const listenInfo1: IListenInfo = {
        //     // 协议1 :炼神升级协议 协议    2：时装基础信息
        //     ProtoId: [ProtoId.S2CRoleSkinGodNum_ID, ProtoId.S2CRoleSkinInfo_ID],
        //     // 关注升级需要消耗的道具
        //     ItemId: [cfgRoleSkinItem.LSItem],
        //     // 此处写Win界面。也就是监听的外层UI 填写Win界面即可。
        //     CheckVid: [ViewConst.RoleSkinWin],
        //     // 代理ID的作用是：当页面未打开的时候，只会走这个监听。否则会走上面两个协议监听
        //     ProxyRid: [RID.Role.Role.Skin.Id],
        // };
        // RedDotMgr.I.emit(
        //     REDDOT_ADD_LISTEN_INFO,
        //     { rid: rid1, info: listenInfo1 },
        // );
    }

    /**
     * 添加红点事件发送的监听
     */
    public onRedDotEventListen(): void {
        // todo
    }

    /** 移除红点事件发送的监听 */
    public offRedDotEventListen(): void {
        // todo
    }

    public abstract clearAll(): void;

    public reset(): void {
        this.clearAll();
    }

    private do(): void {
        // todo
    }
}
