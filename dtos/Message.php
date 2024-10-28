<?php
/**
 * 이 파일은 아이모듈 SMS모듈의 일부입니다. (https://www.imodules.io)
 *
 * 전송메시지 구조체를 정의한다.
 *
 * @file /modules/sms/dtos/Message.php
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2024. 10. 28.
 */
namespace modules\sms\dtos;
class Message
{
    /**
     * @var string $_id 고유값
     */
    private string $_id;

    /**
     * @var string $_type 전송타입
     */
    private string $_type;

    /**
     * @var \modules\sms\dtos\Cellphone $_to 수신자
     */
    private \modules\sms\dtos\Cellphone $_to;

    /**
     * @var \modules\sms\dtos\Cellphone $_from 전송자
     */
    private \modules\sms\dtos\Cellphone $_from;

    /**
     * @var string $_component_type 메시지를 전송한 컴포넌트종류
     */
    private string $_component_type;

    /**
     * @var string $_component_name 메시지를 전송한 컴포넌트명
     */
    private string $_component_name;

    /**
     * @var string $_content 메시지내용
     */
    private string $_content;

    /**
     * @var mixed $_extras 추가내용
     */
    private mixed $_extras;

    /**
     * @var int $_sended_at 전송일시
     */
    private int $_sended_at;

    /**
     * @var string $_status 전송결과
     */
    private string $_status;

    /**
     * @var ?string $_response 전송응답
     */
    private ?string $_response;

    /**
     * 휴대전화번호 구조체를 정의한다.
     *
     * @param string $cellphone 휴대전화번호
     * @param ?string $name 이름
     * @param ?int $member_id 회원고유값
     * @param ?string $photo 회원사진
     */
    public function __construct(object $message)
    {
        /**
         * @var \modules\sms\Sms $mSms
         */
        $mSms = \Modules::get('sms');

        $this->_id = $message->message_id;
        $this->_type = $message->type;
        $this->_to = $mSms->getCellphone($message->cellphone, $message->name, $message->member_id);
        $this->_from = $mSms->getCellphone($message->sended_cellphone);
        $this->_component_type = $message->component_type;
        $this->_component_name = $message->component_name;
        $this->_content = $message->content;
        $this->_extras = json_decode($message->extras ?? 'null');
        $this->_sended_at = $message->sended_at;
        $this->_status = $message->status;
        $this->_response = json_decode($message->response ?? 'null');
    }

    /**
     * 메시지고유값을 가져온다.
     *
     * @return string $id
     */
    public function getId(): string
    {
        return $this->_id;
    }

    /**
     * JSON 으로 변환한다.
     *
     * @return object $message
     */
    public function getJson(): object
    {
        /**
         * @var \modules\sms\Sms $mSms
         */
        $mSms = \Modules::get('sms');

        $message = new \stdClass();
        $message->message_id = $this->_id;
        $message->type = $this->_type;
        $message->type_title = $mSms->getTypeTitle($this->_type);
        $message->to = $this->_to->getJson();
        $message->member = $this->_to->getMember()->getJson();
        $message->from = $this->_from->getJson();
        $message->content = $this->_content;
        $message->sended_at = $this->_sended_at;
        $message->status = $this->_status;
        $message->response = $this->_response;

        return $message;
    }
}
