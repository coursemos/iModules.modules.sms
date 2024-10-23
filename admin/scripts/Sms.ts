/**
 * 이 파일은 아이모듈 SMS모듈의 일부입니다. (https://www.imodules.io)
 *
 * SMS 이벤트를 관리하는 클래스를 정의한다.
 *
 * @file /modules/sms/admin/scripts/Sms.ts
 * @author youlapark <youlapark@naddle.net>
 * @license MIT License
 * @modified 2024. 10. 22.
 */
namespace modules {
    export namespace sms {
        export namespace admin {
            export class Sms extends modules.admin.admin.Component {
                /**
                 * 발송/수신자명을 가져온다.
                 *
                 */
                getMemberName(member): string {
                    return '<i class="photo" style="background-image:url(' + member.photo + ')"></i>' + member.name;
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
                            title: this.printText('admin.messages.show.title'),
                            width: 600,
                            modal: true,
                            resizable: false,
                            items: [
                                new Aui.Form.Panel({
                                    border: false,
                                    layout: 'fit',
                                    readonly: true,
                                    items: [
                                        new Aui.Form.FieldSet({
                                            title: this.printText('admin.messages.show.sms_info'),
                                            items: [
                                                new Aui.Form.Field.Container({
                                                    direction: 'column',
                                                    items: [
                                                        new Aui.Form.Field.Display({
                                                            label: this.printText('admin.messages.show.sended_at'),
                                                            name: 'sended_at',
                                                            renderer: (value) => {
                                                                return Format.date('Y.m.d(D) H:i:s', value);
                                                            },
                                                        }),
                                                        new Aui.Form.Field.TextArea({
                                                            label: this.printText('admin.messages.show.content'),
                                                            name: 'content',
                                                        }),
                                                        new Aui.Form.Field.Display({
                                                            label: this.printText('admin.messages.show.type'),
                                                            name: 'type',
                                                            renderer: (value) => {
                                                                return this.printText('admin.filter.types.' + value);
                                                            },
                                                        }),
                                                        new Aui.Form.Field.Display({
                                                            label: this.printText('admin.messages.show.status'),
                                                            name: 'status',
                                                            renderer: (value) => {
                                                                return this.printText('admin.filter.status.' + value);
                                                            },
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                        new Aui.Form.FieldSet({
                                            title: this.printText('admin.messages.show.receiver_info'),
                                            items: [
                                                new Aui.Form.Field.Container({
                                                    direction: 'row',
                                                    items: [
                                                        new Aui.Form.Field.Display({
                                                            label: this.printText('admin.messages.show.receiver'),
                                                            name: 'name',
                                                            flex: 1,
                                                        }),
                                                        new Aui.Form.Field.Display({
                                                            label: this.printText('admin.messages.show.receive_number'),
                                                            name: 'cellphone',
                                                            flex: 1,
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                        new Aui.Form.FieldSet({
                                            title: '발신자 기본정보',
                                            items: [
                                                new Aui.Form.Field.Container({
                                                    direction: 'row',
                                                    items: [
                                                        new Aui.Form.Field.Display({
                                                            label: this.printText('admin.messages.show.sender'),
                                                            name: 'sender',
                                                            flex: 1,
                                                        }),
                                                        new Aui.Form.Field.Display({
                                                            label: this.printText('admin.messages.show.sender_number'),
                                                            name: 'sended_cellphone',
                                                            flex: 1,
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                            buttons: [
                                new Aui.Button({
                                    text: this.printText('admin.buttons.close'),
                                    handler: (button) => {
                                        const window = button.getParent() as Aui.Window;
                                        window.close();
                                    },
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
                                        if (results.success == false) {
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
