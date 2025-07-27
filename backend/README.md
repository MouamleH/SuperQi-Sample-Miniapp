# Alipay Package Documentation

## Overview

The Alipay package provides a Go client for interacting with Alipay's API services. It implements secure authentication, request signing, and provides methods for common Alipay operations including token management, user information retrieval, and card list inquiries.

## Package Structure

```
alipay/
├── alipay.go      # Main API methods
├── client.go      # HTTP client and signature generation
├── model.go       # Data structures and response models
├── util.go        # Utility functions for key loading
└── README.md      # This documentation
```

## Configuration

The package requires the following environment variables:

- `ALIPAY_GATEWAY_URL`: Alipay API gateway URL
- `ALIPAY_MERCHANT_PRIVATE_KEY_PATH`: Path to Merchant's RSA private key file
- `ALIPAY_PUBLIC_KEY_PATH`: Path to Merchant's RSA public key file
- `ALIPAY_CLIENT_ID`: Your Alipay client ID

## Initialization

```go
err := alipay.InitAlipayClient()
if err != nil {
    log.Fatal(err)
}
```

## API Methods

### 1. ApplyToken

Exchanges an authorization code for access and refresh tokens.

**Method**: `ApplyToken(authCode string) (ApplyTokenResponse, error)`

**Request Body**:
```json
{
    "grantType": "AUTHORIZATION_CODE",
    "authCode": "your_auth_code_here"
}
```

**Response**:
```json
{
    "result": {
        "resultCode": "SUCCESS",
        "resultStatus": "S",
        "resultMessage": "Success"
    },
    "accessToken": "access_token_here",
    "accessTokenExpiryTime": "2024-01-01T12:00:00Z",
    "refreshToken": "refresh_token_here",
    "refreshTokenExpiryTime": "2024-01-08T12:00:00Z",
    "customerId": "customer_id_here"
}
```

### 2. InquiryUserInfo

Retrieves user information using an access token.

**Method**: `InquiryUserInfo(accessToken string) (InquiryUserInfoResponse, error)`

**Request Body**:
```json
{
    "accessToken": "your_access_token_here"
}
```

**Response**:
> Fields returned here depend on the scope provided in the client when calling `my.getAuthCode()` and allowed or blocked by merchant config
```json
{
    "result": {
        "resultCode": "SUCCESS",
        "resultStatus": "S",
        "resultMessage": "Success"
    },
    "userInfo": {
        "userId": "user_id_here",
        "loginIdInfos": [
            {
                "loginId": "login_id",
                "hashLoginId": "hash_login_id",
                "maskLoginId": "mask_login_id",
                "loginIdType": "EMAIL"
            }
        ],
        "userName": {
            "fullName": "Full Name",
            "firstName": "First",
            "secondName": "Second",
            "thirdName": "Third",
            "lastName": "Last"
        },
        "userNameInArabic": {
            "fullName": "الاسم الكامل",
            "firstName": "الاسم الأول",
            "secondName": "الاسم الثاني",
            "thirdName": "الاسم الثالث",
            "lastName": "اسم العائلة"
        },
        "avatar": "avatar_url",
        "gender": "MALE",
        "birthDate": "1990-01-01",
        "nationality": "SA",
        "contactInfos": [
            {
                "contactType": "MOBILE",
                "contactNo": "+966501234567"
            }
        ]
    }
}
```

### 3. InquiryUserCardList

> This call requires the scope "CARD_LIST" in the `my.getAuthCode()`

Retrieves the user's card list using an access token.

**Method**: `InquiryUserCardList(accessToken string) (InquiryUserCardListResponse, error)`

**Request Body**:
```json
{
    "accessToken": "your_access_token_here"
}
```

**Response**:
```json
{
    "result": {
        "resultCode": "SUCCESS",
        "resultStatus": "S",
        "resultMessage": "Success"
    },
    "cardList": [
        {
            "maskedCardNo": "****1234",
            "accountNumber": "account_number_here"
        }
    ]
}
```

## Request Body Generation

### 1. Parameter Structure

All request bodies are generated as JSON objects containing the required parameters for each API endpoint:

- **ApplyToken**: Contains `grantType` and `authCode`
- **InquiryUserInfo**: Contains `accessToken`
- **InquiryUserCardList**: Contains `accessToken`

### 2. JSON Marshaling

Request bodies are generated using Go's `json.Marshal()` function:

```go
params := map[string]string{
    "grantType": "AUTHORIZATION_CODE",
    "authCode":  authCode,
}

paramsJSON, err := json.Marshal(params)
```

## Authentication and Security

### 1. Request Headers

Each request includes the following headers:

```
Content-Type: application/json; charset=UTF-8
Client-Id: your_client_id
Request-Time: 2024-01-01T12:00:00-07:00
Signature: algorithm=RSA256, keyVersion=1, signature=base64_encoded_signature
```

### 2. Signature Generation

The signature is generated using the following process:

1. **Create Sign Content**:
   ```
   {HTTP_METHOD} {PATH}
   {CLIENT_ID}.{REQUEST_TIME}.{JSON_CONTENT}
   ```

2. **Hash the Content**:
   - Use SHA-256 to hash the sign content

3. **Sign with RSA**:
   - Use the merchant's private key to sign the hash
   - Use PKCS1v15 padding

4. **Base64 Encode**:
   - Encode the signature in base64 format

**Example**:
```go
signContent := fmt.Sprintf( "%s %s\n%s.%s.%s", 
    httpMethod, path, clientID, 
    requestTime, content,
)

hash := sha256.Sum256([]byte(signContent))
signature, err := rsa.SignPKCS1v15(nil, 
    privateKey, crypto.SHA256, hash[:],
)

base64Signature := base64.StdEncoding.EncodeToString(signature)
```

### 3. Key Management

The package supports both PKCS1 and PKCS8 private key formats:

- **Private Key**: Used for signing requests

## Error Handling

The package returns structured errors for various failure scenarios:

- Configuration errors (missing environment variables)
- Key loading errors (invalid key files)
- Network errors (HTTP request failures)
- JSON parsing errors (malformed responses)

## Usage Example

```go
package main

import (
    "log"
    "your-project/alipay"
)

func main() {
    // Initialize the client
    err := alipay.InitAlipayClient()
    if err != nil {
        log.Fatal(err)
    }

    // Apply for access token
    response, err := alipay.Interface.ApplyToken("your_auth_code")
    if err != nil {
        log.Fatal(err)
    }

    // Use the access token to get user info
    userInfo, err := alipay.Interface.InquiryUserInfo(response.AccessToken)
    if err != nil {
        log.Fatal(err)
    }

    log.Printf("User ID: %s", userInfo.UserInfo.UserID)
}
```

## Security Considerations

1. **Private Key Security**: Ensure the merchant private key is stored securely and has appropriate file permissions
2. **Environment Variables**: Use secure methods to manage environment variables in production
3. **HTTPS**: Always use HTTPS for API communications
4. **Token Management**: Implement proper token storage and refresh mechanisms
5. **Error Logging**: Avoid logging sensitive information like tokens and signatures

## Dependencies

- `crypto/rsa`: RSA encryption and signing
- `crypto/sha256`: SHA-256 hashing
- `encoding/base64`: Base64 encoding
- `encoding/json`: JSON marshaling/unmarshaling
- `net/http`: HTTP client functionality
- `time`: Timestamp generation 