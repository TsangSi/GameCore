/*
 * @Author: myl
 * @Date: 2023-03-02 10:21:57
 * @Description: 聊天数据处理工具类
 */

export default class ChatDataMgr {
    /** 组合唯一key */
    public static ChatDataKey(time: number, index: number): string {
        return `${time}_${index}`;
    }
}
