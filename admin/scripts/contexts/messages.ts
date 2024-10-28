/**
 * 이 파일은 아이모듈 SMS모듈의 일부입니다. (https://www.imodules.io)
 *
 * SMS 관리화면을 구성한다.
 *
 * @file /modules/sms/admin/scripts/contexts/messages.ts
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2024. 10. 28.
 */
Admin.ready(async () => {
    const me = Admin.getModule('sms') as modules.sms.admin.Sms;

    return new Aui.Grid.Panel({
        id: 'messages-context',
        title: await me.getText('admin.contexts.messages'),
        iconClass: 'xi xi-tablet',
        layout: 'fit',
        border: false,
        selection: { selectable: true },
        store: new Aui.Store.Remote({
            url: me.getProcessUrl('messages'),
            primaryKeys: ['message_id'],
            sorters: { sended_at: 'DESC' },
            limit: 50,
            remoteSort: true,
            remoteFilter: true,
        }),
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
                text: await me.getText('admin.columns.member'),
                dataIndex: 'member',
                width: 180,
                filter: new Aui.Grid.Filter.List({
                    store: new Aui.Store.Local({
                        fields: ['display', 'value'],
                        records: [
                            [await me.getText('member'), 'member'],
                            [await me.getText('guest'), 'guest'],
                        ],
                    }),
                    displayField: 'display',
                    valueField: 'value',
                    multiple: false,
                }),
                renderer: (value) => {
                    return me.getMemberName(value);
                },
            },
            {
                text: await me.getText('admin.columns.to'),
                dataIndex: 'to',
                width: 165,
                filter: new Aui.Grid.Filter.List({
                    store: new Aui.Store.Remote({
                        url: me.getProcessUrl('countries'),
                        limit: 100,
                        remoteFilter: true,
                    }),
                    multiple: true,
                    search: true,
                    renderer: (display, record) => {
                        let sHTML = '';
                        if (record.get('flag') != null) {
                            sHTML += '<i class="icon" style="background-image:url(' + record.get('flag') + ')"></i>';
                        }

                        sHTML += display;

                        return sHTML;
                    },
                }),
                renderer: (value) => {
                    return me.getCellphone(value);
                },
            },
            {
                text: await me.getText('admin.columns.from'),
                dataIndex: 'from',
                width: 165,
                renderer: (value) => {
                    return me.getCellphone(value);
                },
            },
            {
                text: await me.getText('admin.columns.content'),
                dataIndex: 'content',
                minWidth: 250,
                flex: 1,
            },
            {
                text: await me.getText('admin.columns.sended_at'),
                dataIndex: 'sended_at',
                width: 170,
                sortable: true,
                filter: new Aui.Grid.Filter.Date({ format: 'timestamp' }),
                renderer: (value) => {
                    return Format.date('Y.m.d(D) H:i:s', value);
                },
            },
            {
                text: await me.getText('admin.columns.type'),
                dataIndex: 'type',
                width: 100,
                textAlign: 'center',
                sortable: true,
                filter: new Aui.Grid.Filter.List({
                    store: new Aui.Store.Remote({
                        url: me.getProcessUrl('types'),
                    }),
                    displayField: 'title',
                    valueField: 'type',
                    multiple: true,
                }),
                renderer: (_value, record) => {
                    return record.get('type_title');
                },
            },
            {
                text: await me.getText('admin.columns.status'),
                dataIndex: 'status',
                width: 140,
                filter: new Aui.Grid.Filter.List({
                    dataIndex: 'status',
                    store: new Aui.Store.Local({
                        fields: ['display', 'value'],
                        records: [
                            [await me.getText('admin.status.TRUE'), 'TRUE'],
                            [await me.getText('admin.status.FALSE'), 'FALSE'],
                        ],
                    }),
                }),
                renderer: (value, record, $dom) => {
                    $dom.addClass(value);

                    if (value == 'TRUE') {
                        $dom.addClass('center');
                        return me.printText('admin.status.' + value);
                    } else {
                        return record.get('response') ?? me.printText('admin.status.' + value);
                    }
                },
            },
        ],
        listeners: {
            openItem: (record) => {
                me.messages.show(record.get('message_id'));
            },
        },
    });
});
