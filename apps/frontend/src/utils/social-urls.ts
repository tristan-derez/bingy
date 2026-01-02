type SocialIds = {
	instagram_id: string | null;
	twitter_id: string | null;
};

type SocialUrls = Partial<{
	instagram: string;
	twitter: string;
}>;

export const getSocialUrls = (data: SocialIds): SocialUrls => {
	const urls: SocialUrls = {};

	if (data.instagram_id) {
		urls.instagram = `https://www.instagram.com/${data.instagram_id}`;
	}

	if (data.twitter_id) {
		urls.twitter = `https://x.com/${data.twitter_id}`;
	}

	return urls;
};
