/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/*
 * @Author: kexd
 * @Date: 2022-09-20 14:33:14
 * @FilePath: \SanGuo\assets\script\game\base\utils\UtilFile.ts
 * @Description:  读写本地文件操作
 *
 */

export default class UtilFile {
    private _fileInput: HTMLInputElement;

    private _img: HTMLImageElement;

    private loadComplete: Function = null;

    private file: File = null;

    private fileType: number = 0;

    public constructor() {
        this.init();
    }

    private init() {
        this._fileInput = document.createElement('input');
        this._fileInput.id = 'finput';
        this._fileInput.type = 'file';
        this._fileInput.accept = 'image/*';

        this._fileInput.style.height = '0px';
        this._fileInput.style.display = 'block';
        this._fileInput.style.overflow = 'hidden';
        // this._fileInput.multiple = "multiple"; // 多选
        document.body.insertBefore(this._fileInput, document.body.firstChild);

        this._fileInput.addEventListener(
            'change',
            (evt: Event) => {
                this.onSelectFile(evt);
            },
            false,
        );
    }

    /**
     * 打开图片文件选择窗口 chrome浏览器需要点击页面（激活）才有效
     */
    public openImageWin(callback: Function): void {
        this.fileType = 0;
        this._fileInput.accept = 'image/png,image/jpeg';
        this.loadComplete = callback;
        setTimeout(() => { this._fileInput.click(); }, 100);
    }

    /**
     * 打开文本文件选择窗口 chrome浏览器需要点击页面（激活）才有效
     */
    public openTextWin(callback: Function): void {
        this.fileType = 1;
        this._fileInput.accept = 'application/json';
        this.loadComplete = callback;
        setTimeout(() => { this._fileInput.click(); }, 100);
    }

    private onSelectFile(evt) {
        this.file = evt.target.files[0];

        if (this.fileType === 0) {
            const url = this.createObjectURL(this.file);
            this.loadLocalImg(url);
        } else if (this.fileType === 1) {
            this.loadLocalText(this.file);
        }
    }

    private loadLocalImg(uri: string) {
        if (!this._img) {
            this._img = document.getElementById('f_img') as HTMLImageElement;

            if (!this._img) {
                this._img = document.createElement('img');
                this._img.id = 'f_img';
            }

            this._img.onload = () => {
                const texture: cc.Texture2D = new cc.Texture2D();
                // texture.image = new ImageAsset(this._img);
                texture.initWithElement(this._img);

                if (this.loadComplete) this.loadComplete(texture, this.file);
            };
        }

        this._img.src = uri;
    }

    private loadLocalText(file: File) {
        const reader = new FileReader();
        reader.readAsText(file, 'utf-8');
        // 显示进度
        reader.onprogress = (e) => {
            console.log('pg =', e.loaded);
        };
        reader.onload = () => {
            if (this.loadComplete) this.loadComplete(reader.result, this.file);
        };
    }

    private createObjectURL(blob: Blob): string {
        if (window.URL !== undefined) { return window.URL.createObjectURL(blob); } else { return window.webkitURL.createObjectURL(blob); }
    }
}
