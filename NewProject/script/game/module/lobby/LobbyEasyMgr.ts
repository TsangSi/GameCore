/*
 * @Author: kexd
 * @Date: 2022-06-13 18:56:46
 * @FilePath: \SanGuo\assets\script\game\module\lobby\LobbyEasyMgr.ts
 * @Description: 作为LobbyEasy的控制类，主要用于动态加载LobbyEasy，其它挂在主界面但可以动态加载的预制都应作动态加载考虑
 *
 */

// 加载完之后要设置哪个快捷按钮可见，这里为他们设置类型
export enum LobbyType {
    Mail = 0,
    // 有新的快捷按钮就往下加
}

export class LobbyEasyMgr {
    private static _Instance: LobbyEasyMgr;
    public static get I(): LobbyEasyMgr {
        if (!this._Instance) {
            this._Instance = new LobbyEasyMgr();
        }
        return this._Instance;
    }
}
