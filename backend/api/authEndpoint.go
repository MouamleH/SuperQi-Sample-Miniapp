package api

import (
	"github.com/gofiber/fiber/v2"
	"superQiMiniAppBackend/alipay"
	"superQiMiniAppBackend/jwe"
)

type authRequest struct {
	AuthCode string `json:"auth_code" validate:"required"`
}

func InitAuthEndpoint(group fiber.Router) {
	group.Post("/auth/apply-token", func(ctx *fiber.Ctx) error {
		var request authRequest
		if err := ctx.BodyParser(&request); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
		}

		tokenResponse, err := alipay.Interface.ApplyToken(request.AuthCode)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, err.Error())
		}

		info, err := alipay.Interface.InquiryUserInfo(tokenResponse.AccessToken)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		// Return a JWE to the MiniApp containing the required access token to be used in future calls to A+ backend
		// The user id is just there for the ride :D
		jweToken, err := jwe.CreateJWE(jwe.TokenClaims{
			UserID:      info.UserInfo.UserID,
			AccessToken: tokenResponse.AccessToken,
		})

		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, err.Error())
		}

		// This approach is completely stateless, and it relies on the token returned to the user being encrypted
		// because it contains the access token required by A+ backend
		return ctx.JSON(fiber.Map{
			"token": jweToken,
		})
	})
}
