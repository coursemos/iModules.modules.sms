<?php
/**
 * 이 파일은 아이모듈 SMS모듈의 일부입니다. (https://www.imodules.io)
 *
 * SMS 발송 목록을 가져온다.
 *
 * @file /modules/sms/processes/messages.get.php
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2024. 10. 28.
 *
 * @var \modules\sms\Sms $me
 */
if (defined('__IM_PROCESS__') == false) {
    exit();
}

/**
 * 관리자권한이 존재하는지 확인한다.
 */
if ($me->getAdmin()->checkPermission('messages') == false) {
    $results->success = false;
    $results->message = $me->getErrorText('FORBIDDEN');
    return;
}

$start = Request::getInt('start') ?? 0;
$limit = Request::getInt('limit') ?? 50;
$sorters = Request::getJson('sorters');
$filters = Request::getJson('filters');
$keyword = Request::get('keyword');

$records = $me
    ->db()
    ->select()
    ->from($me->table('messages'));

if ($filters !== null) {
    $records->setFilters($filters, 'AND', [
        'status' => 'status',
        'type' => 'type',
        'sended_at' => 'sended_at',
    ]);

    if (isset($filters->member) == true) {
        if ($filters->member->value == 'member') {
            $records->where('member_id', 0, '>');
        } else {
            $records->where('member_id', 0);
        }
    }

    if (isset($filters->to) == true && count($filters->to->value) > 0) {
        $records->where('country', $filters->to->value, 'IN');
    }
}

if ($keyword !== null) {
    $records->where('(');
    $records->where('name', '%' . $keyword . '%', 'LIKE');
    $records->orWhere('cellphone', '%' . $keyword . '%', 'LIKE');
    $records->orWhere('sended_cellphone', '%' . $keyword . '%', 'LIKE');
    $records->where(')');
}

$total = $records->copy()->count();

if ($sorters !== null) {
    foreach ($sorters as $field => $direction) {
        $records->orderBy($field, $direction);
    }
}

$records = $records->limit($start, $limit)->get();
foreach ($records as &$record) {
    $record = $me->getMessage($record)->getJson();
}

$results->success = true;
$results->records = $records;
$results->total = $total;
