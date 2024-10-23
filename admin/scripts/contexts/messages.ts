/**
 * 이 파일은 아이모듈 SMS모듈의 일부입니다. (https://www.imodules.io)
 *
 * SMS 관리화면을 구성한다.
 *
 * @file /modules/sms/admin/scripts/contexts/messages.ts
 * @author youlapark <youlapark@naddle.net>
 * @license MIT License
 * @modified 2024. 10. 22.
 */
Admin.ready(async () => {
    const me = Admin.getModule('sms') as modules.sms.admin.Sms;

    return new Aui.Panel({
        id: 'messages-context',
        title: await me.getText('admin.contexts.messages'),
        border: false,
        layout: 'fit',
        iconClass: 'xi xi-tablet',
        topbar: [
            new Aui.Form.Field.Search({
                id: 'keyword',
                width: 200,
                emptyText: await me.getText('admin.keyword'),
                handler: async (keyword) => {
                    const context = Aui.getComponent('messages-context') as Aui.Tab.Panel;
                    const messages = context.getItemAt(0) as Aui.Grid.Panel;
                    if (keyword.length > 0) {
                        messages.getStore().setParam('keyword', keyword);
                    } else {
                        messages.getStore().setParam('keyword', null);
                    }
                    messages.getStore().loadPage(1);
                },
            }),
        ],
        items: [
            new Aui.Grid.Panel({
                layout: 'fit',
                border: false,
                flex: 1,
                store: new Aui.Store.Remote({
                    url: me.getProcessUrl('messages'),
                    primaryKeys: ['message_id'],
                    sorters: { sended_at: 'DESC' },
                    limit: 50,
                    remoteSort: true,
                    remoteFilter: true,
                }),
                bottombar: new Aui.Grid.Pagination([
                    new Aui.Button({
                        iconClass: 'mi mi-refresh',
                        handler: (button) => {
                            const grid = button.getParent().getParent() as Aui.Grid.Panel;
                            grid.getStore().reload();
                        },
                    }),
                ]),
                columns: [
                    {
                        text: await me.getText('admin.columns.receiver'),
                        dataIndex: 'sended_by',
                        textAlign: 'center',
                        width: 150,
                        renderer: (value) => {
                            return me.getMemberName(value);
                        },
                    },
                    {
                        text: await me.getText('admin.columns.receiveNumber'),
                        dataIndex: 'cellphone',
                        textAlign: 'center',
                        width: 150,
                    },
                    {
                        text: await me.getText('admin.columns.sender'),
                        dataIndex: 'sender',
                        width: 150,
                    },
                    {
                        text: await me.getText('admin.columns.senderNumber'),
                        dataIndex: 'sended_cellphone',
                        textAlign: 'center',
                        width: 160,
                    },
                    {
                        text: await me.getText('admin.columns.content'),
                        dataIndex: 'content',
                        minWidth: 250,
                        flex: 1,
                    },
                    {
                        text: await me.getText('admin.columns.date'),
                        dataIndex: 'sended_at',
                        width: 250,
                        sortable: true,
                        filter: new Aui.Grid.Filter.Date({ format: 'timestamp' }),
                        renderer: (value) => {
                            return Format.date('Y.m.d(D) H:i:s', value);
                        },
                    },
                    {
                        text: await me.getText('admin.columns.type'),
                        dataIndex: 'type',
                        width: 120,
                        textAlign: 'center',
                        sortable: true,
                        filter: new Aui.Grid.Filter.List({
                            store: new Aui.Store.Local({
                                fields: ['display', 'value'],
                                records: [
                                    ['SMS', 'SMS'],
                                    ['LMS', 'LMS'],
                                    [await me.getText('admin.filter.types.KAKAO'), 'KAKAO'],
                                ],
                            }),
                            displayField: 'display',
                            valueField: 'value',
                            multiple: true,
                        }),
                        renderer: (value) => {
                            return me.printText('admin.filter.types.' + value);
                        },
                    },
                    {
                        text: await me.getText('admin.columns.status'),
                        sortable: true,
                        width: 120,
                        textAlign: 'center',
                        filter: new Aui.Grid.Filter.List({
                            dataIndex: 'status',
                            store: new Aui.Store.Local({
                                fields: ['display', 'value'],
                                records: [
                                    [await me.getText('admin.filter.status.TRUE'), 'TRUE'],
                                    [await me.getText('admin.filter.status.FALSE'), 'FALSE'],
                                ],
                            }),
                        }),
                        renderer: (_value, record, $dom) => {
                            const status = record.get('status');
                            $dom.addClass(status);
                            return me.printText('admin.filter.status.' + status);
                        },
                    },
                ],
                listeners: {
                    openItem: (record) => {
                        me.messages.show(record.get('message_id'));
                    },
                },
            }),
        ],
    });
});
