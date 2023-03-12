// 拷贝文本
export class UtilCopy {
    public static CopyTextEvent(copyStr: string): void {
        if (cc.sys.platform === cc.sys.ANDROID) {
            setTimeout(() => {
                jsb.reflection.callStaticMethod('com/cocos/game/AppActivity', 'JavaCopy', '(Ljava/lang/String;)V', copyStr);
            }, 100);
        } else {
            const el = document.createElement('textarea');
            el.value = copyStr;

            // Prevent keyboard from showing on mobile
            el.setAttribute('readonly', '');
            // el.style.contain = 'strict';
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            el.style.fontSize = '12pt'; // Prevent zooming on iOS

            const selection = getSelection()!;
            let originalRange;
            if (selection.rangeCount > 0) {
                originalRange = selection.getRangeAt(0);
            }

            document.body.appendChild(el);
            el.select();
            // Explicit selection workaround for iOS
            el.selectionStart = 0;
            el.selectionEnd = copyStr.length;

            let success = false;
            try {
                success = document.execCommand('copy');
            } catch (err) {
                //
            }
            document.body.removeChild(el);
            if (originalRange) {
                selection.removeAllRanges();
                selection.addRange(originalRange);
            }
        }
    }
}
