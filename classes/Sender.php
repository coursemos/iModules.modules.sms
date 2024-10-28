<?php
/**
 * 이 파일은 아이모듈 SMS모듈의 일부입니다. (https://www.imodules.io)
 *
 * SMS 전송자 클래스를 정의한다.
 *
 * @file /modules/sms/classes/Sender.php
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2024. 10. 28.
 */
namespace modules\sms;
class Sender
{
    /**
     * @var \Component $_component 알림을 전송하는 컴포넌트 객체
     */
    private \Component $_component;

    /**
     * @var ?\modules\sms\dtos\Cellphone $_to 수신자휴대전화번호
     */
    private ?\modules\sms\dtos\Cellphone $_to;

    /**
     * @var ?\modules\sms\dtos\Cellphone $_from 발송자휴대전화번호
     */
    private ?\modules\sms\dtos\Cellphone $_from = null;

    /**
     * @var string $_content 본문내용
     */
    private string $_content;

    /**
     * @var string $_type 발송타입
     */
    private string $_type = 'SMS';

    /**
     * @var mixed $_extras SMS추가데이터
     */
    private mixed $_extras = null;

    /**
     * @var ?string $_response_id 응답고유값 (응답결과에 따라 추가처리가 필요할 경우 설정)
     */
    private ?string $_response_id = null;

    /**
     * SMS 전송자 클래스를 정의한다.
     *
     * @param \Component $component 알림을 전송하는 컴포넌트 객체
     */
    public function __construct(\Component $component)
    {
        $this->_component = $component;
    }

    /**
     * 컴포넌트를 호출한다.
     *
     * @param \Component $component 알림을 전송하는 컴포넌트 객체
     */
    public function getComponent(): \Component
    {
        return $this->_component;
    }

    /**
     * 수신자를 설정한다.
     *
     * @param \modules\sms\dtos\Cellphone $cellphone 수신자휴대전화번호객체
     * @return \modules\sms\Sender $this
     */
    public function setTo(\modules\sms\dtos\Cellphone $to): \modules\sms\Sender
    {
        $this->_to = $to;

        return $this;
    }

    /**
     * 수신자를 가져온다.
     *
     * @return ?\modules\sms\dtos\Cellphone $to
     */
    public function getTo(): ?\modules\sms\dtos\Cellphone
    {
        return $this->_to;
    }

    /**
     * 발송번호를 설정한다.
     *
     * @param \modules\sms\dtos\Cellphone $from 발송휴대전화번호객체
     * @return \modules\sms\Sender $this
     */
    public function setFrom(\modules\sms\dtos\Cellphone $from): \modules\sms\Sender
    {
        $this->_from = $from;
        return $this;
    }

    /**
     * 발송번호를 가져온다.
     *
     * @return ?\modules\sms\dtos\Cellphone $from
     */
    public function getFrom(): ?\modules\sms\dtos\Cellphone
    {
        if ($this->_from === null) {
            /**
             * @var \modules\sms\Sms $mSms
             */
            $mSms = \Modules::get('sms');
            $mSms->getConfigs('cellphone');

            $this->_from = $mSms->getCellphone($mSms->getConfigs('cellphone'), $mSms->getConfigs('country'));
        }
        return $this->_from;
    }

    /**
     * 본문내용을 설정한다.
     *
     * @param string $content 본문
     * @return \modules\sms\Sender $this
     */
    public function setContent(string $content): \modules\sms\Sender
    {
        $this->_content = $content;
        return $this;
    }

    /**
     * 본문내용을 가져온다.
     *
     * @return string $content
     */
    public function getContent(): string
    {
        return $this->_content;
    }

    /**
     * 추가데이터를 설정한다.
     *
     * @param mixed $extras
     * @return \modules\sms\Sender $this
     */
    public function setExtras(mixed $extras): \modules\sms\Sender
    {
        $this->_extras = $extras;
        return $this;
    }

    /**
     * 추가데이터를 가져온다.
     *
     * @return mixed $extras
     */
    public function getExtras(): mixed
    {
        return $this->_extras;
    }

    /**
     * 발송타입을 설정한다.
     *
     * @param string $type 발송타입
     * @return \modules\sms\Sender $this
     */
    public function setType(string $type): \modules\sms\Sender
    {
        $this->_type = $type;
        return $this;
    }

    /**
     * 발송타입을 가져온다.
     *
     * @return string $type 발송타입
     */
    public function getType(): string
    {
        return $this->_type;
    }

    /**
     * 응답고유값을 설정한다.
     *
     * @params string $response_id 응답고유값
     * @return \modules\sms\Sender $this
     */
    public function setResponseId(?string $response_id): \modules\sms\Sender
    {
        $this->_response_id = $response_id;
        return $this;
    }

    /**
     * SMS를 전송한다.
     *
     * @param ?int $sended_at - 전송시각(NULL 인 경우 현재시각)
     * @return bool $success 성공여부
     */
    public function send(?int $sended_at = null): bool
    {
        if (isset($this->_to) == false || isset($this->_content) == false) {
            return false;
        }

        /**
         * @var \modules\sms\Sms $mSms
         */
        $mSms = \Modules::get('sms');

        $sended_at ??= time();

        /**
         * SMS 전송 플러그인을 이용하여 SMS 를 발송한다.
         */
        $success =
            \Events::fireEvent($mSms, 'send', [$this, $sended_at], 'NOTNULL') ??
            $mSms->getErrorText('NOT_FOUND_SENDER_PLUGIN');

        /**
         * 설정된 타입이 존재하지 않을 경우 문자열의 길이에 따라 $type을 LMS, SMS로 지정한다.
         */
        $type = $this->getType();
        if ($this->getType() === null) {
            $type = $mSms->getContentLength($this->_content) > 80 ? 'LMS' : 'SMS';
            $this->setType($type);
        }

        $message_id = \UUID::v1($this->getTo()->getCellphone());
        $mSms
            ->db()
            ->insert($mSms->table('messages'), [
                'message_id' => $message_id,
                'type' => $type,
                'member_id' => $this->getTo()->getMemberId(),
                'country' => $this->getTo()
                    ->getCountry()
                    ->getCode(),
                'cellphone' => $this->getTo()->getCellphone(),
                'name' => $this->getTo()->getName(),
                'component_type' => $this->_component->getType(),
                'component_name' => $this->_component->getName(),
                'content' => $this->getContent(),
                'extras' => $this->_extras !== null ? \Format::toJson($this->_extras) : null,
                'sended_cellphone' => $this->getFrom()->getCellphone(),
                'sended_at' => $sended_at,
                'status' => $success === true ? 'TRUE' : 'FALSE',
                'response' => is_bool($success) == false ? \Format::toJson($success) : null,
                'response_id' => $this->_response_id,
            ])
            ->execute();

        return $success === true;
    }
}
