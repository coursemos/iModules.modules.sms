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
namespace modules {
    export namespace sms {
        export namespace admin {
            export class Sms extends modules.admin.admin.Component {
                /**
                 * 모듈 환경설정 폼을 가져온다.
                 *
                 * @return {Promise<Aui.Form.Panel>} configs
                 */
                async getConfigsForm(): Promise<Aui.Form.Panel> {
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
                                        renderer: (display: string, record: Aui.Data.Record) => {
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
                 * @param {object} cellphone
                 */
                getMemberName(cellphone: { [key: string]: any }): string {
                    if (cellphone === null) {
                        return '';
                    }

                    let sHTML = '';

                    sHTML +=
                        '<i class="icon" style="background-image:url(' +
                        cellphone.country.flag +
                        '); aspect-ratio:1.2;"></i>';
                    sHTML +=
                        '<i class="photo" style="background-image:url(' +
                        cellphone.member.photo +
                        ')"></i>' +
                        cellphone.member.name;
                    sHTML += ' &lt;' + cellphone.cellphone + '&gt;';

                    return sHTML;
                }

                /**
                 * 메세지관리
                 */
                messages = {
                    /**
                     * 메세지 상세보기 기능을 가져온다.
                     */
                    show: async (message_id: string) => {
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
                                            direction: 'column',
                                            items: [
                                                new Aui.Form.Field.Display({
                                                    label: await this.getText('admin.columns.to'),
                                                    name: 'to',
                                                    value: null,
                                                    renderer: (value) => {
                                                        return this.getMemberName(value);
                                                    },
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
                                                        } else {
                                                            return value;
                                                        }
                                                    },
                                                }),
                                                new Aui.Form.Field.Display({
                                                    label: this.printText('admin.message.from'),
                                                    name: 'from',
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                            listeners: {
                                show: async (window) => {
                                    if (message_id !== null) {
                                        const form = window.getItemAt(0) as Aui.Form.Panel;
                                        const results = await form.load({
                                            url: this.getProcessUrl('message'),
                                            params: { message_id: message_id },
                                        });

                                        if (results.success == true) {
                                            if (results.data.status == 'FALSE' && results.data.response !== null) {
                                                form.getField('status').setValue(results.data.response);
                                            }
                                        } else {
                                            window.close();
                                        }
                                    }
                                },
                            },
                        }).show();
                    },
                };
            }
        }
    }
}
