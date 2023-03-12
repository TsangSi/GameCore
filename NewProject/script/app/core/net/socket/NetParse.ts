/*
 * @Author: hrd
 * @Date: 2022-03-28 16:43:09
 * @LastEditors: hrd
 * @LastEditTime: 2022-05-13 19:05:06
 * @FilePath: \SanGuo\assets\script\app\core\net\socket\NetParse.ts
 * @Description: net数据解析类
 */
export default class NetParse {
    private static MaxSize: number = 1024 * 20;
    private static AddProtoIdBuffer = new Uint8Array(NetParse.MaxSize);
    private static Offset = 0;
    public static Idx = 0;
    public static HeadLen = 6;
    public static HeadParLen = 8;
    public static IntToUint8Array(value: number): Uint8Array {
        const a = new Uint8Array(2);
        a[0] = (value >> 8) & 0xFF;
        a[1] = value & 0xFF;
        return a;
    }

    public static IntToUint32Array(value: number): Uint8Array {
        const a = new Uint8Array(4);
        a[0] = (value >> 24) & 0xFF;
        a[1] = (value >> 16) & 0xFF;
        a[2] = (value >> 8) & 0xFF;
        a[3] = value & 0xFF;
        return a;
    }

    public static protoBufAddtag(protoId: number, buffer: Uint8Array): [Uint8Array, number] {
        if (buffer.length + NetParse.HeadLen > NetParse.MaxSize) {
            return null;
        }

        if (NetParse.Offset + buffer.length + NetParse.HeadLen > NetParse.MaxSize) {
            NetParse.Offset = 0;
        }
        // NetParse.AddProtoIdBuffer[NetParse.Offset + 0] = (this.Idx >> 8) & 0xFF;
        // NetParse.AddProtoIdBuffer[NetParse.Offset + 1] = this.Idx & 0xFF;
        // NetParse.AddProtoIdBuffer[NetParse.Offset + 2] = (protoId >> 8) & 0xFF;
        // NetParse.AddProtoIdBuffer[NetParse.Offset + 3] = protoId & 0xFF;

        NetParse.AddProtoIdBuffer[NetParse.Offset + 0] = (this.Idx >> 24) & 0xFF;
        NetParse.AddProtoIdBuffer[NetParse.Offset + 1] = (this.Idx >> 16) & 0xFF;
        NetParse.AddProtoIdBuffer[NetParse.Offset + 2] = (this.Idx >> 8) & 0xFF;
        NetParse.AddProtoIdBuffer[NetParse.Offset + 3] = this.Idx & 0xFF;
        NetParse.AddProtoIdBuffer[NetParse.Offset + 4] = (protoId >> 8) & 0xFF;
        NetParse.AddProtoIdBuffer[NetParse.Offset + 5] = protoId & 0xFF;

        NetParse.AddProtoIdBuffer.set(buffer.subarray(0, buffer.length), NetParse.Offset + NetParse.HeadLen);

        const oldOffset = NetParse.Offset;
        NetParse.Offset += buffer.length + NetParse.HeadLen;
        return [NetParse.AddProtoIdBuffer, oldOffset];
    }
    /**
         * Uint8Array[]转int
         * 相当于二进制加上4位。同时，使用|=号拼接数据，将其还原成最终的int数据
         * @param uint8Ary Uint8Array类型数组
         * @return int数字
         */
    public static Uint8ArrayToInt(uint8Ary: Uint8Array): number {
        let retInt = 0;
        for (let i = 0; i < uint8Ary.length; i++) { retInt |= uint8Ary[i] << (8 * (uint8Ary.length - i - 1)); }

        return retInt;
    }

    public static parseProtoBufId(obj: MessageEvent): { id: number, data: Uint8Array, mid: number } {
        const arrayBuffer: ArrayBuffer = obj.data;
        let dataUnit8Array = new Uint8Array(arrayBuffer);

        // 如果是寻路包，不增加这个
        // if (id !== ProtoId.S2CRoutePath_ID) {
        this.Idx = NetParse.Uint8ArrayToInt(dataUnit8Array.slice(0, 4));
        // 记录一下idx是0的情况，方便查询
        if (this.Idx === 0) {
            // console.error("__FILETER__ this.Idx == 0, id:", id);
        }
        // }
        // 模块id
        const mid = NetParse.Uint8ArrayToInt(dataUnit8Array.slice(4, 6));
        // 协议id
        const id = NetParse.Uint8ArrayToInt(dataUnit8Array.slice(6, 8));

        dataUnit8Array = dataUnit8Array.slice(NetParse.HeadParLen);

        return { id, data: dataUnit8Array, mid };
    }
}
