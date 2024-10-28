<?php
/**
 * 이 파일은 아이모듈 SMS모듈의 일부입니다. (https://www.imodules.io)
 *
 * SMS모듈의 이벤트를 정의한다.
 *
 * @file /modules/sms/classes/Event.php
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2024. 10. 28.
 */
namespace modules\sms;
class Event extends \Event
{
    /**
     * 전송타입을 가져올 때 발생한다.
     *
     * @param string[] $types [타입종류=>타입종류명]
     */
    public static function getTypes(array &$types): void
    {
    }

    /**
     * SMS를 전송할 때 발생한다.
     *
     * @param \modules\sms\Sender $sender SMS를 보내고 있는 전송자 객체
     * @param int $sended_at 전송시각
     * @return bool|string|null $success 발송성공여부 또는 실패메시지 (NULL 인 경우, 다른 이벤트리스너나 이메일 모듈에서 이어서 발송한다.)
     */
    public static function send(\modules\sms\Sender $sender, int $sended_at): bool|string|null
    {
        return null;
    }
}
