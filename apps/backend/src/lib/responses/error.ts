import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

const serveNotFound = (c: Context) => {
	return c.json(
		{ error: getReasonPhrase(StatusCodes.NOT_FOUND) },
		StatusCodes.NOT_FOUND,
	);
};

const serveBadRequest = (c: Context, message: string) => {
	return c.json({ error: message }, StatusCodes.BAD_REQUEST);
};

const serveUnprocessableEntity = (c: Context, message: string) => {
	return c.json({ error: message }, StatusCodes.UNPROCESSABLE_ENTITY);
};

const serveUnauthorized = (c: Context) => {
	return c.json(
		{ error: getReasonPhrase(StatusCodes.UNAUTHORIZED) },
		StatusCodes.UNAUTHORIZED,
	);
};

const serveInternalServerError = (c: Context, error: unknown) => {
	if (error instanceof HTTPException) {
		return c.json({ error: error.message }, error.status);
	}

	if (error instanceof Error) {
		return c.json({ error: error.message }, StatusCodes.INTERNAL_SERVER_ERROR);
	}

	return c.json(
		{ error: "Internal Server Error" },
		StatusCodes.INTERNAL_SERVER_ERROR,
	);
};

const serveError = (
	c: Context,
	message: string,
	statusCode: ContentfulStatusCode,
) => {
	return c.json({ error: message }, statusCode);
};

const ERRORS = {
	USER_EXISTS: "User already exists",
	USER_NOT_FOUND: "User not found",
};

export {
	ERRORS,
	serveBadRequest,
	serveError,
	serveInternalServerError,
	serveNotFound,
	serveUnauthorized,
	serveUnprocessableEntity,
};
