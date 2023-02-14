import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { create, remove } from '../utils/language';
import { name as _name } from '../package.json';
import VVue from '../source/vue';

export const template = readFileSync(join(__dirname, './template/home.html'), 'utf-8');
export const style = readFileSync(join(__dirname, 'style/home.css'), 'utf-8');
export const $ = {
    home: '#home',
    current: '.current',
};

export async function ready () {
    const v = new VVue({
        el: this.$.home,
        data () {
            return {
                state: 'normal',
                languages: [],
                current: '',
                _language: '',
            };
        },
        async created () {
            const languages = await Editor.Profile.getProject(_name, 'languages');
            if (languages.length === 0) {
                Editor.Profile.setProject(_name, 'languages', languages.map((name) => name));
            }
            if (languages) {
                languages.forEach((name) => {
                    this.languages.push(name);
                });
            }

            const current = await Editor.Profile.getProject(_name, 'default_language');
            const index = this.languages.indexOf(current);
            if (index !== -1) {
                // this.current = this.languages[0];
            // } else {
                this.current = current;
            }
        },
        methods: {
            async changeCurrent (object) {
                this.languageChanged(object.currentTarget.value);
                this.current = object.currentTarget.value;
            },

            async languageChanged (name) {
                Editor.Profile.setProject(_name, 'default_language', name);

                let url = join(__dirname, '../../../assets/scripts/i18n/i18n.ts');
                let label_script = readFileSync(url, 'utf8');
                let find_name = this.current;
                let new_name = name;
                if (this.current === '') {
                    find_name = 'i18n/';
                    new_name = `i18n/${name}`;
                }

                label_script = label_script.replace(new RegExp(find_name), new_name);
                writeFileSync(url, label_script);

                url = join(__dirname, '../../../assets/scripts/i18n/LocalizedLabel.ts');
                label_script = readFileSync(url, 'utf8');
                if (this.current === '') {
                    find_name = '_dataID: string = \'';
                    new_name = `_dataID: string = '${name}`;
                }
                label_script = label_script.replace(new RegExp(find_name), new_name);
                writeFileSync(url, label_script);

                await Editor.Message.request('asset-db', 'refresh-asset', 'db://assets/scripts/i18n/LabelLocalized.ts');
            },

            languagesChanged (languages) {
                Editor.Profile.setProject(_name, 'languages', languages.map((name) => name));
            },

            updatename (key) {
                return Editor.I18n.t(`i18n.${key}`);
            },

            _getLanguagePath (language) {
                return join('gamelogic/i18n/', `${language}.ts`);
            },

            inputname (object) {
                this._language = object.currentTarget.value;
            },
            changeEdit () {
                if (this.state === 'edit') {
                    this.state = 'normal';
                } else {
                    this.state = 'edit';
                }
            },
            changeCreate () {
                if (this.state === 'create') {
                    this.state = 'normal';
                    this._language = '';
                } else {
                    this.state = 'create';
                    this._language = '';
                }
            },
            createLanguage (name) {
                // 检查是否不存在
                if (!name) {
                    return alert('创建语言失败 - 名称不能为空');
                }
                // 检查是否重名
                if (this.languages.indexOf(name) !== -1) {
                    return alert('创建语言失败 - 该语言已经存在');
                }

                create(name).then(() => {
                    this.languages.push(name);
                    if (!this.current) {
                        this.languageChanged(this.languages[0]);
                        this.current = this.languages[0];
                    }
                    this.languagesChanged(this.languages);
                    this._language = '';
                    this.state = 'normal';
                }).catch(() => {
                    this._language = '';
                    this.state = 'normal';
                    // todo 错误提示
                });
            },
            async deleteLanguage (name) {
                // 检查是否存在
                if (this.languages.indexOf(name) === -1) {
                    return alert('删除语言失败 - 该语言不存在');
                }
                // 弹窗提示
                const dialog_info = await Editor.Dialog.warn('Delete i18n language data, this cannot be undone!', {
                    buttons: ['Cancel', 'OK'],
                    title: 'Delete Language Data',
                    detail: name,
                });

                if (dialog_info.response === 0) {
                    return;
                }

                // 删除 profile
                remove(name).then(() => {
                    const index = this.languages.indexOf(name);
                    this.languages.splice(index, 1);
                    this.languagesChanged(this.languages);
                    if (name === this.current) {
                        const new_language = this.languages[0] || '';
                        this.languageChanged(new_language);
                        this.current = new_language;
                    }
                }).catch(() => {
                    // todo 错误提示
                });
            },
        },
    });
}
