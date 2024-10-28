/**
 * 이 파일은 아이모듈 SMS모듈의 일부입니다. (https://www.imodules.io)
 *
 * SMS 이벤트를 관리하는 클래스를 정의한다.
 *
 * @file /modules/sms/admin/scripts/Sms.ts
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2024. 10. 28.
 */
var modules;
(function (modules) {
    let sms;
    (function (sms) {
        let admin;
        (function (admin) {
            class Sms extends modules.admin.admin.Component {
                /**
                 * 모듈 환경설정 폼을 가져온다.
                 *
                 * @return {Promise<Aui.Form.Panel>} configs
                 */
                async getConfigsForm() {
                    return new Aui.Form.Panel({
                        items: [
                            new Aui.Form.FieldSet({
                                title: await this.getText('admin.configs.default'),
                                items: [
                                    new Aui.Form.Field.Select({
                                        label: await this.getText('admin.configs.country'),
                                        name: 'country',
                                        store: new Aui.Store.Remote({
                                            url: this.getProcessUrl('countries'),
                                            fields: ['code', 'country'],
                                        }),
                                        search: true,
                                        helpText: await this.getText('admin.configs.country_help'),
                                        listRenderer: (display, record) => {
                                            let sHTML = '';
                                            if (record.get('flag') != null) {
                                                sHTML +=
                                                    '<i class="icon" style="background-image:url(' +
                                                        record.get('flag') +
                                                        ')"></i>';
                                            }
                                            sHTML += display;
                                            return sHTML;
                                        },
                                        renderer: (display, record) => {
                                            let sHTML = '';
                                            if (record.get('flag') != null) {
                                                sHTML +=
                                                    '<i class="icon" style="background-image:url(' +
                                                        record.get('flag') +
                                                        ')"></i>';
                                            }
                                            sHTML += display;
                                            return sHTML;
                                        },
                                    }),
                                    new Aui.Form.Field.Text({
                                        label: await this.getText('admin.configs.cellphone'),
                                        name: 'cellphone',
                                        helpText: await this.getText('admin.configs.cellphone_help'),
                                    }),
                                ],
                            }),
                        ],
                    });
                }
                /**
                 * 수신자 정보를 가져온다.
                 *
                 * @param {object} member
                 */
                getMemberName(member) {
                    if (member === null) {
                        return '';
                    }
                    return '<i class="photo" style="background-image:url(' + member.photo + ')"></i>' + member.name;
                }
                /**
                 * 번호를 국기와 함께 가져온다.
                 *
                 * @param {object} cellphone
                 */
                getCellphone(cellphone) {
                    if (cellphone === null) {
                        return '';
                    }
                    return ('<i class="icon flag" style="background-image:url(' +
                        cellphone.country.flag +
                        ');"></i>' +
                        cellphone.cellphone);
                }
                /**
                 * 메세지관리
                 */
                messages = {
                    /**
                     * 메세지 상세보기 기능을 가져온다.
                     */
                    show: async (message_id) => {
                        new Aui.Window({
                            title: await this.getText('admin.message.title'),
                            width: 540,
                            modal: true,
                            resizable: false,
                            items: [
                                new Aui.Form.Panel({
                                    border: false,
                                    layout: 'fit',
                                    readonly: true,
                                    items: [
                                        new Aui.Form.Field.Container({
                                            direction: 'row',
                                            items: [
                                                new Aui.Form.Field.Display({
                                                    label: await this.getText('admin.columns.member'),
                                                    name: 'member',
                                                    renderer: (value) => {
                                                        return this.getMemberName(value);
                                                    },
                                                }),
                                                new Aui.Form.Field.Display({
                                                    name: 'to',
                                                    renderer: (value) => {
                                                        return this.getCellphone(value);
                                                    },
                                                }),
                                            ],
                                        }),
                                        new Aui.Form.Field.TextArea({
                                            label: await this.getText('admin.message.content'),
                                            name: 'content',
                                            readonly: true,
                                        }),
                                        new Aui.Form.Field.Display({
                                            label: await this.getText('admin.message.type'),
                                            name: 'type_title',
                                        }),
                                        new Aui.Form.Field.Display({
                                            label: await this.getText('admin.message.sended_at'),
                                            name: 'sended_at',
                                            renderer: (value) => {
                                                return Format.date('Y.m.d(D) H:i:s', value, null, false);
                                            },
                                        }),
                                        new Aui.Form.Field.Display({
                                            label: await this.getText('admin.message.status'),
                                            name: 'status',
                                            renderer: (value) => {
                                                if (value == 'TRUE' || value == 'FALES') {
                                                    return this.printText('admin.status.' + value);
                                                }
                                                else {
                                                    return value;
                                                }
                                            },
                                        }),
                                        new Aui.Form.Field.Display({
                                            label: this.printText('admin.message.from'),
                                            name: 'from',
                                            renderer: (value) => {
                                                return this.getCellphone(value);
                                            },
                                        }),
                                    ],
                                }),
                            ],
                            listeners: {
                                show: async (window) => {
                                    if (message_id !== null) {
                                        const form = window.getItemAt(0);
                                        const results = await form.load({
                                            url: this.getProcessUrl('message'),
                                            params: { message_id: message_id },
                                        });
                                        if (results.success == true) {
                                            if (results.data.status == 'FALSE' && results.data.response !== null) {
                                                form.getField('status').setValue(results.data.response);
                                            }
                                        }
                                        else {
                                            window.close();
                                        }
                                    }
                                },
                            },
                        }).show();
                    },
                };
            }
            admin.Sms = Sms;
        })(admin = sms.admin || (sms.admin = {}));
    })(sms = modules.sms || (modules.sms = {}));
})(modules || (modules = {}));
