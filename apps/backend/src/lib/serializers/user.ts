import type { User } from "#lib/database";

type UserResponse = {
	id: string;
	name: string | null;
	email: string;
	avatarUrl: string | null;
	emailVerified: boolean | null;
	emailVerifiedAt: Date | null;
	createdAt: Date;
};

const serializeUser = (user: User): UserResponse => {
	return {
		id: user.id.toString(),
		name: user.name,
		email: user.email,
		avatarUrl: user.avatar_url,
		emailVerified: user.email_verified,
		emailVerifiedAt: user.email_verified_at,
		createdAt: user.created_at,
	};
};

export { serializeUser };
