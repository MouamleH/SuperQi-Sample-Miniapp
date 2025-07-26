package alipay

import "encoding/json"

func (client *Client) ApplyToken(authCode string) (ApplyTokenResponse, error) {
	const path = "/v1/authorizations/applyToken"
	params := map[string]string{
		"grantType": "AUTHORIZATION_CODE",
		"authCode":  authCode,
	}

	headers, err := client.buildHeaders("POST", path, params)
	if err != nil {
		return ApplyTokenResponse{}, err
	}

	response, err := client.sendRequest(path, "POST", headers, params)
	if err != nil {
		return ApplyTokenResponse{}, err
	}

	var body ApplyTokenResponse
	err = json.Unmarshal(response, &body)
	return body, err
}

func (client *Client) InquiryUserInfo(accessToken string) (InquiryUserInfoResponse, error) {
	const path = "/v1/users/inquiryUserInfo"
	params := map[string]string{
		"accessToken": accessToken,
	}

	headers, err := client.buildHeaders("POST", "/v1/users/inquiryUserInfo", params)
	if err != nil {
		return InquiryUserInfoResponse{}, err
	}

	response, err := client.sendRequest(path, "POST", headers, params)
	if err != nil {
		return InquiryUserInfoResponse{}, err
	}

	var body InquiryUserInfoResponse
	err = json.Unmarshal(response, &body)
	return body, err
}

func (client *Client) InquiryUserCardList(accessToken string) (InquiryUserCardListResponse, error) {
	const path = "/v1/users/inquiryUserCardList"
	params := map[string]string{
		"accessToken": accessToken,
	}

	headers, err := client.buildHeaders("POST", path, params)
	if err != nil {
		return InquiryUserCardListResponse{}, err
	}

	response, err := client.sendRequest(path, "POST", headers, params)
	if err != nil {
		return InquiryUserCardListResponse{}, err
	}

	var body InquiryUserCardListResponse
	err = json.Unmarshal(response, &body)
	return body, err
}
