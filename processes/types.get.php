<?php
/**
 * 이 파일은 아이모듈 SMS모듈의 일부입니다. (https://www.imodules.io)
 *
 * 전송타입을 가져온다.
 *
 * @file /modules/sms/processes/types.get.php
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2024. 10. 28.
 *
 * @var \modules\sms\Sms $me
 */
if (defined('__IM_PROCESS__') == false) {
    exit();
}

$types = $records = [];
foreach ($me->getTypes() as $type => $title) {
    $records[] = ['type' => $type, 'title' => $title];
}

$results->success = true;
$results->records = $records;
