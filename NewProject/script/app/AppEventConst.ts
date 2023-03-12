/*
 * @Author: hrd
 * @Date: 2022-05-06 14:18:02
 * @LastEditors: kexd
 * @LastEditTime: 2022-05-19 14:27:05
 * @FilePath: \SanGuo\assets\script\app\AppEventConst.ts
 * @Description:
 */
export const AppEvent = {
    /** 添加视图 */
    ViewAddToLayer: 'APP_ViewAddToLayer',
    /** 控制器检测 */
    ControllerCheck: 'APP_ControllerCheck',

    /** Socket 连接成功 */
    SocketConnect: 'APP_SocketConnect',
    /** Socket 关闭 */
    SocketClose: 'APP_SocketClose',
    /** Socket 接收消息 */
    SocketMessage: 'APP_SocketMessage',
    /** Socket 开始重连接 */
    SocketStartReconnect: 'APP_SocketStartReconnect',
    /** Socket 重连接成功 */
    SocketReconnectSucc: 'APP_SocketReconnectSucc',
    /** Socket 重连接失败 */
    SocketReconnectFail: 'APP_SocketReconnectFail',
    /** Socket 不能连接上 */
    SocketNoConnect: 'APP_SocketNoConnect',
    /** 当前是否有大型窗口打开了 */
    WinBigAllClose: 'APP_WinBigAllClose',
};
