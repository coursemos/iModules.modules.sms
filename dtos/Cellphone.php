<?php
/**
 * 이 파일은 아이모듈 SMS모듈의 일부입니다. (https://www.imodules.io)
 *
 * 휴대전화번호 주소 구조체를 정의한다.
 *
 * @file /modules/sms/dtos/Cellphone.php
 * @author Arzz <arzz@arzz.com>
 * @license MIT License
 * @modified 2024. 10. 21.
 */
namespace modules\sms\dtos;
class Cellphone
{
    /**
     * @var string $_cellphone 전화번호
     */
    private string $_cellphone;

    /**
     * @var string $_name 이름
     */
    private ?string $_name;

    /**
     * @var int $_member_id 회원고유값
     */
    private ?int $_member_id;

    /**
     * @var string $_photo 회원사진
     */
    private ?string $_photo;

    /**
     * 휴대전화번호 구조체를 정의한다.
     *
     * @param string $cellphone 휴대전화번호
     * @param ?string $name 이름
     * @param ?int $member_id 회원고유값
     * @param ?string $photo 회원사진
     */
    public function __construct(string $cellphone, ?string $name = null, ?int $member_id = null, ?string $photo = null)
    {
        $this->_cellphone = $cellphone;
        $this->_name = $name;
        $this->_member_id = $member_id;
        $this->_photo = $photo;
    }

    /**
     * 휴대전화번호를 가져온다.
     *
     * @return string $cellphone
     */
    public function getCellphone(): string
    {
        return $this->_cellphone;
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
     * 회원사진을 가져온다.
     *
     * @return string $_photo
     */
    public function getPhoto(): string
    {
        /**
         * @var \modules\member\Member $mMember
         */
        $mMember = \Modules::get('member');
        return $mMember->getMemberPhoto($this->_member_id);
    }

    /**
     * JSON 으로 변환한다.
     *
     * @return object $json
     */
    public function getJson(): object
    {
        $address = new \stdClass();
        $address->cellphone = $this->_cellphone;
        $address->name = $this->_name;
        $address->member_id = $this->_member_id;
        $address->photo = $this->_photo;

        return $address;
    }
}
