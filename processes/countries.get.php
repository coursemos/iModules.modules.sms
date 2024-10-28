<?php
/**
 * 이 파일은 아이모듈 SMS모듈의 일부입니다. (https://www.imodules.io)
 *
 * 국가코드번호 목록을 가져온다.
 *
 * @file /modules/sms/processes/countries.get.php
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
 * @var \modules\country\Country $mCountry
 */
$mCountry = Modules::get('country');

$records = [];
$countries = $mCountry->load();
foreach ($countries as $code => $country) {
    $country = $mCountry->getCountry($code);
    if ($country->getCallingCode() !== null) {
        $records[] = [
            'display' => $country->getName() . ' (' . $country->getCallingCode() . ')',
            'value' => $country->getCode(),
            'flag' => $country->getFlag(),
        ];
    }
}

$results->success = true;
$results->records = $records;
