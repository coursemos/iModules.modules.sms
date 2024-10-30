<?php
/**
 * 이 파일은 아이모듈 SMS모듈의 일부입니다. (https://www.imodules.io)
 *
 * 휴대전화번호 주소 구조체를 정의한다.
 *
 * @file /modules/sms/dtos/Cellphone.php
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2024. 10. 30.
 */
namespace modules\sms\dtos;
class Cellphone
{
    /**
     * @var \libphonenumber\PhoneNumber $_cellphone 전화번호
     */
    private \libphonenumber\PhoneNumber $_cellphone;

    /**
     * @var string $_name 이름
     */
    private ?string $_name;

    /**
     * @var int $_member_id 회원고유값
     */
    private int $_member_id;

    /**
     * @var \modules\member\dtos\Member $_member 회원정보
     */
    private \modules\member\dtos\Member $_member;

    /**
     * 휴대전화번호 구조체를 정의한다.
     *
     * @param string $cellphone 휴대전화번호
     * @param ?string $name 이름
     * @param ?int $member_id 회원고유값
     */
    public function __construct(string $cellphone, ?string $name = null, ?int $member_id = null)
    {
        /**
         * @var \modules\sms\Sms $mSms
         */
        $mSms = \Modules::get('sms');
        $this->_cellphone = \libphonenumber\PhoneNumberUtil::getInstance()->parse(
            $cellphone,
            $mSms->getConfigs('country') ?? 'KR'
        );
        $this->_name = $name;
        $this->_member_id = $member_id ?? 0;
    }

    /**
     * 국가코드를 가져온다.
     *
     * @return ?\modules\country\dtos\Country $country_code
     */
    public function getCountry(): \modules\country\dtos\Country
    {
        /**
         * @var \modules\country\Country $mCountry
         */
        $mCountry = \Modules::get('country');
        return $mCountry->getCountry(
            \libphonenumber\PhoneNumberUtil::getInstance()->getRegionCodeForNumber($this->_cellphone)
        );
    }

    /**
     * 휴대전화번호를 가져온다.
     *
     * @return string $cellphone
     */
    public function getCellphone(bool $is_international = false): string
    {
        if ($is_international == false) {
            return \libphonenumber\PhoneNumberUtil::getInstance()->format(
                $this->_cellphone,
                \libphonenumber\PhoneNumberFormat::NATIONAL
            );
        } else {
            return \libphonenumber\PhoneNumberUtil::getInstance()->format(
                $this->_cellphone,
                \libphonenumber\PhoneNumberFormat::INTERNATIONAL
            );
        }
    }

    /**
     * 이름을 가져온다.
     *
     * @return ?string $name
     */
    public function getName(): ?string
    {
        if ($this->_name === null) {
            return null;
        }

        return $this->_name;
    }

    /**
     * 회원고유값을 가져온다.
     *
     * @return ?int $member_id
     */
    public function getMemberId(): ?int
    {
        return $this->_member_id;
    }

    /**
     * 회원정보를 가져온다.
     *
     * @return \modules\member\dtos\Member $member
     */
    public function getMember(): \modules\member\dtos\Member
    {
        if (isset($this->_member) == false) {
            /**
             * @var \modules\member\Member $mMember
             */
            $mMember = \Modules::get('member');
            $this->_member = $mMember->getMember($this->_member_id)->setNicknamePlaceHolder($this->_name);
        }

        return $this->_member;
    }

    /**
     * JSON 으로 변환한다.
     *
     * @return object $json
     */
    public function getJson(): object
    {
        $address = new \stdClass();
        $address->country = $this->getCountry()?->getJson();
        $address->cellphone = $this->getCellphone();
        $address->member = $this->getMember()->getJson();

        return $address;
    }
}
