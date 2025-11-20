type SocialIds = {
	facebook_id: string | null;
	instagram_id: string | null;
	twitter_id: string | null;
};

type SocialUrls = Partial<{
	facebook: string;
	instagram: string;
	twitter: string;
}>;

export const getSocialUrls = (data: SocialIds): SocialUrls => {
	const urls: SocialUrls = {};

	if (data.facebook_id) {
		urls.facebook = `https://www.facebook.com/${data.facebook_id}`;
	}

	if (data.instagram_id) {
		urls.instagram = `https://www.instagram.com/${data.instagram_id}`;
	}

	if (data.twitter_id) {
		urls.twitter = `https://x.com/${data.twitter_id}`;
	}

	return urls;
};
