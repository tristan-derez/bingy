type Pretty<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export namespace Schemas {
	// biome-ignore format: keep union type compact
	type BaseCertificationCountry = Pretty<
		"AU" | "BR" | "CA" | "CA-QC" | "DE" | "ES" | "FR" | "GB" | "HU"
		| "KR" | "LT" | "NL" | "PH" | "PT" | "RU" | "SK" | "TH" | "US" 
		| "IT" | "FI" | "MY" | "NZ" | "NO" | "BG" | "MX" | "IN" | "DK"
		| "SE" | "ID" | "TR" | "AR" | "GR" | "IL" | "TW" | "ZA" | "SG"
		| "PR" | "VI"
	>;

	type MovieOnlyCountry = Pretty<
		"JP" | "CH" | "HK" | "MO" | "LV" | "LU" | "IE"
	>;
	type TvOnlyCountry = Pretty<"PL" | "MA">;
	export type MovieCertificationCountry = Pretty<
		BaseCertificationCountry | MovieOnlyCountry
	>;
	export type TvCertificationCountry = Pretty<
		BaseCertificationCountry | TvOnlyCountry
	>;

	export type CertificationMovieList = Pretty<{
		certifications: {
			[K in MovieCertificationCountry]: Array<{
				certification: string;
				meaning: string;
				order: number;
			}>;
		};
	}>;

	export type CertificationTvList = Pretty<{
		certifications: {
			[K in TvCertificationCountry]: Array<{
				certification: string;
				meaning: string;
				order: number;
			}>;
		};
	}>;

	// biome-ignore format: keep union type compact
	export type ExternalId = Pretty<
		| "imdb_id" | "facebook_id" | "instagram_id" | "tvdb_id"
		| "tiktok_id" | "twitter_id" | "wikidata_id" | "youtube_id"
	>

	export type MovieInCollection = Pretty<{
		adult: boolean;
		backdrop_path: string | null;
		id: number;
		title: string;
		original_title: string;
		overview: string;
		poster_path: string | null;
		media_type: string;
		original_language: string;
		genre_ids: number[];
		popularity: number;
		release_date: string;
		video: boolean;
		vote_average: number;
		vote_count: number;
	}>;

	export type Movie = Pretty<{
		adult: boolean;
		backdrop_path: string | null;
		id: number;
		title: string;
		original_title: string;
		overview: string;
		poster_path: string | null;
		original_language: string;
		genre_ids: number[];
		popularity: number;
		release_date: string;
		video: boolean;
		vote_average: number;
		vote_count: number;
	}>;

	export type MovieWithMediaTypeItem = Pretty<
		Movie & {
			media_type: "movie";
		}
	>;

	type CollectionItem = Pretty<{
		id: number;
		name: string;
		poster_path: string | null;
		backdrop_path: string | null;
	}>;

	export type Tv = Pretty<{
		adult: boolean;
		backdrop_path: string | null;
		first_air_date: string;
		genre_ids: number[];
		id: number;
		name: string;
		origin_country: string[];
		original_language: string;
		original_name: string;
		overview: string;
		popularity: number;
		poster_path: string | null;
		vote_average: number;
		vote_count: number;
	}>;

	export type TvWithMediaType = Pretty<
		Tv & {
			media_type: "tv";
		}
	>;

	export type TvDetails = Pretty<
		Omit<Tv, "genre_ids"> & {
			created_by: PersonShort[];
			episode_run_time: number[];
			genres: Genre[];
			in_production: string;
			languages: string[];
			last_air_date: string;
			last_episode_to_air: Pretty<Omit<Episode, "media_type"> | null>;
			next_episode_to_air: Pretty<Omit<Episode, "media_type"> | null>;
			networks: Pretty<Omit<NetworkDetails, "homepage" | "headquarters">>;
			production_companies: ProductionCompany[];
			production_countries: ProductionCountry[];
			seasons: (Season & { vote_average: number })[];
			spoken_languages: SpokenLanguage[];
			status: string;
			tagline: string;
			type: string;
		}
	>;

	export type TvAggregatedCredits = Pretty<{
		cast: CastPersonInAggregatedTvCredits[];
		crew: CrewPersonInAggregatedTvCredits[];
		id: number;
	}>;

	export type TvAlternativeTitles = Pretty<{
		id: number;
		results: AlternativeTitle[];
	}>;

	type TvRating = Pretty<{
		descriptors: string[];
		iso_3166_1: string;
		rating: string;
	}>;

	export type TvContentRatings = Pretty<{
		results: TvRating[];
		id: number;
	}>;

	export type TvCredits = Pretty<{
		cast: PersonFromCast[];
		crew: PersonFromCrew[];
		id: number;
	}>;

	export type TvEpisodeGroups = Pretty<{
		results: EpisodeGroup[];
		id: number;
	}>;

	export type TvEpisodeGroupDetails = Pretty<{
		description: string;
		episode_count: number;
		group_count: number;
		groups: Group[];
		id: string;
		name: string;
		network: ProductionCompany;
		type: number;
	}>;

	type Group = Pretty<{
		id: string;
		name: string;
		order: number;
		episodes: EpisodeInGroup[];
		locked: boolean;
	}>;

	type EpisodeInGroup = Pretty<
		Episode & {
			order: number;
		}
	>;

	type EpisodeGroup = Pretty<{
		description: string;
		episode_count: number;
		group_count: number;
		id: string;
		name: string;
		network: ProductionCompany[];
		type: number;
	}>;

	export type TvExternalIds = Pretty<{
		id: number;
		imdb_id: string | null;
		freebase_mid: string | null;
		freebase_id: string | null;
		tvdb_id: number | null;
		tvrage_id: number | null;
		wikidata_id: string | null;
		facebook_id: string | null;
		instagram_id: string | null;
		twitter_id: string | null;
	}>;

	export type TvImages = Pretty<MovieImages>;

	export type TvKeywords = Pretty<{
		id: number;
		results: Pretty<Keyword[]>;
	}>;

	export type TvLatest = Pretty<TvDetails>;

	export type List = Pretty<{
		description: string;
		favorite_count: number;
		id: number;
		item_count: number;
		iso_639_1?: string | null;
		iso_3166_1?: string | null;
		name: string;
		poster_path: string | null;
	}>;

	export type Reviews = Pretty<{
		author: string;
		author_details: Author;
		content: string;
		created_at: string;
		id: string;
		updated_at: string;
		url: string;
	}>;

	export type Author = Pretty<{
		name: string;
		username: string;
		avatar_path: string | null;
		rating: number;
	}>;

	export type TvScreenedTheatricallyResponse = Pretty<{
		id: number;
		results: TvScreenedTheatrically[];
	}>;

	type TvScreenedTheatrically = Pretty<{
		id: number;
		episode_number: number;
		season_number: number;
	}>;

	export type TvTranslations = Pretty<{
		id: number;
		translations: Translation<TvTranslation>[];
	}>;

	type TvTranslation = Pretty<{
		iso_3166_1: string;
		iso_639_1: string;
		name: string;
		english_name: string;
		data: TvTranslationData;
	}>;

	type TvTranslationData = Pretty<{
		name: string;
		overview: string;
		homepage: string | null;
		tagline: string;
	}>;

	export type TvVideos = Pretty<{
		id: number;
		results: Video[];
	}>;

	export type TvSeasonDetails = Pretty<{
		_id: string;
		air_date: string | null;
		episodes: EpisodeWithCrewAndGuestStars[];
		name: string;
		networks: ProductionCompany[];
		overview: string;
		id: number;
		poster_path: string | null;
		season_number: number;
		vote_average: number;
	}>;

	type EpisodeWithCrewAndGuestStars = Pretty<
		Omit<Episode, "media_type"> & {
			crew: CrewMember[];
			guest_star: CastMember[];
		}
	>;

	export type TvSeasonExternalIds = Pretty<{
		id: number;
		freebase_mid: string | null;
		freebase_id: string | null;
		tvdb_id: number;
		tvrage_id: string | null;
		wikidata_id: string | null;
	}>;

	export type TvSeasonImages = Pretty<
		Omit<Schemas.TvImages, "backdrops" | "logos">
	>;

	export type TvSeasonTranslations = Pretty<{
		id: number;
		translations: Translation<TvSeasonTranslationData>[];
	}>;

	type TvSeasonTranslationData = Pretty<{
		name: string;
		overview: string;
	}>;

	export type TvEpisodeDetails = Pretty<{
		air_date: string | null;
		crew: CrewMember[];
		episode_number: number;
		guest_stars: CastMemberForEpisode[];
		name: string;
		overview: string;
		id: number;
		production_code: string;
		runtime: number | null;
		season_number: number;
		still_path: string | null;
		vote_average: number;
		vote_count: number;
	}>;

	type CastMemberForEpisode = Pretty<Omit<CastMember, "cast_id">>;

	export type TvEpisodeCredits = Pretty<{
		cast: CastMemberForEpisode[];
		crew: CrewMember[];
		guest_stars: CastMemberForEpisode[];
		id: number;
	}>;

	export type TvEpisodeExternalIds = Pretty<
		TvSeasonExternalIds & { imdb_id: string | null }
	>;

	export type TvEpisodeImages = Pretty<{
		id: number;
		stills: Image[];
	}>;

	export type TvEpisodeTranslations = Pretty<{
		id: number;
		translations: Translation<TvEpisodeTranslationData>[];
	}>;

	type TvEpisodeTranslationData = Pretty<{
		name: string;
		overview: string;
	}>;

	type Season = Pretty<{
		air_date: string | null;
		episode_count: number;
		id: number;
		name: string;
		overview: string;
		poster_path: string | null;
		season_number: number;
		show_id: number;
	}>;

	type SeasonExtended = Pretty<
		Season & {
			media_type: string;
			vote_average: string;
		}
	>;

	type Episode = Pretty<{
		id: number;
		name: string;
		overview: string;
		media_type: "tv_episode";
		vote_average: number;
		vote_count: string;
		air_date: string | null;
		episode_number: number;
		episode_type: string;
		production_code: string;
		runtime: number | null;
		season_number: number;
		show_id: number;
		still_path: string | null;
	}>;

	type BaseMedia = Pretty<{
		adult: boolean;
		backdrop_path: string | null;
		id: number;
		original_language: string;
		overview: string;
		poster_path: string | null;
		media_type: "movie" | "tv";
		genre_ids: number[];
		popularity: number;
		vote_average: number;
		vote_count: number;
		character: string;
	}>;

	export type MovieMedia = Pretty<
		BaseMedia & {
			media_type: "movie";
			title: string;
			original_title: string;
			release_date: string;
			video: boolean;
		}
	>;

	type TvMedia = Pretty<
		BaseMedia & {
			media_type: "tv";
			name: string;
			original_name: string;
			first_air_date: string;
			origin_country: string[];
			episodes: Episode[];
			seasons: Season[];
		}
	>;

	export type TvMediaRecommendation = Pretty<
		Omit<TvMedia, "episodes" | "seasons">
	>;

	export type Media = MovieMedia | TvMedia;

	export type MediaMulti = Pretty<Media | PersonExtended>;

	export type MovieDetails = Pretty<
		Omit<MovieMedia, "genre_ids"> & {
			belongs_to_collection: CollectionItem | null;
			budget: number;
			genres: Genre[];
			homepage: string | null;
			imdb_id: string | null;
			origin_country: string[];
			production_company: ProductionCompany[];
			production_countries: ProductionCountry[];
			revenue: number;
			runtime: number | null;
			spoken_languages: SpokenLanguage[];
			status: string;
			tagline: string;
		}
	>;

	type AlternativeTitle = Pretty<{
		iso_3166_1: string;
		title: string;
		type: string;
	}>;

	export type MovieAlternativeTitles = Pretty<{
		id: number;
		titles: AlternativeTitle[];
	}>;

	export type MovieCredits = Pretty<{
		id: number;
		cast: PersonFromCast[];
		crew: PersonFromCrew[];
	}>;

	export type MovieExternalIds = Pretty<{
		id: number;
		imdb_id: string | null;
		wikidata_id: string | null;
		facebook_id: string | null;
		instagram_id: string | null;
		twitter_id: string | null;
	}>;

	export type MovieImages = Pretty<{
		backdrops: Pretty<Image[]>;
		id: number;
		logos: Pretty<Image[]>;
		posters: Pretty<Image[]>;
	}>;

	export type MovieKeywords = Pretty<{
		id: number;
		keywords: Keyword[];
	}>;

	export type Keyword = Pretty<{
		id: number;
		name: string;
	}>;

	export type MovieReleaseDates = Pretty<{
		id: number;
		results: Array<{
			iso_3166_1: string;
			release_dates: ReleaseDate[];
		}>;
	}>;

	type ReleaseDate = Pretty<{
		certification: "string";
		descriptors: string[];
		iso_639_1: string;
		note: string;
		release_date: string;
		type: string;
	}>;

	export type MovieTranslations = Pretty<{
		id: number;
		translations: Translation<MovieTranslationData>[];
	}>;

	export type MovieVideos = Pretty<{
		id: number;
		results: Video[];
	}>;

	// biome-ignore format: keep union type compact
	type WatchProviderCountry = Pretty<
		| "AE" | "AL" | "AR" | "AT" | "AU" | "BA" | "BB" | "BE" | "BG" | "BH"
		| "BO" | "BR" | "BS" | "CA" | "CH" | "CL" | "CO" | "CR" | "CV" | "CZ"
		| "DE" | "DK" | "DO" | "EC" | "EE" | "EG" | "ES" | "FI" | "FJ" | "FR"
		| "GB" | "GF" | "GI" | "GR" | "GT" | "HK" | "HN" | "HR" | "HU" | "ID"
		| "IE" | "IL" | "IN" | "IQ" | "IS" | "IT" | "JM" | "JO" | "JP" | "KR"
		| "KW" | "LB" | "LI" | "LT" | "LV" | "MD" | "MK" | "MT" | "MU" | "MX"
		| "MY" | "MZ" | "NL" | "NO" | "NZ" | "OM" | "PA" | "PE" | "PH" | "PK"
		| "PL" | "PS" | "PT" | "PY" | "QA" | "RO" | "RS" | "RU" | "SA" | "SE"
		| "SG" | "SI" | "SK" | "SM" | "SV" | "TH" | "TR" | "TT" | "TW" | "UG"
		| "US" | "UY" | "VE" | "YE" | "ZA"
	>;

	type WatchProvider = Pretty<{
		logo_path: string | null;
		provider_id: number;
		provider_name: string;
		display_priority: number;
	}>;

	type CountryWatchProviders = Pretty<{
		link: string;
		flatrate?: WatchProvider[];
		rent?: WatchProvider[];
		buy?: WatchProvider[];
		ads?: WatchProvider[];
	}>;

	type WatchProviderResults = Pretty<{
		[K in WatchProviderCountry]?: CountryWatchProviders;
	}>;

	export type WatchProviders = Pretty<{
		id: number;
		results: WatchProviderResults;
	}>;

	export type getWatchProvidersAvailableRegions = Pretty<{
		results: WatchProviderRegion[];
	}>;

	type WatchProviderRegion = Pretty<{
		iso_3166_1: string;
		english_name: string;
		native_name: string;
	}>;

	type Person = Pretty<{
		adult: boolean;
		id: number;
		name: string;
		original_name: string;
		media_type: string;
		popularity: number;
		gender: number;
		known_for_department: string;
		profile_path: string | null;
	}>;

	type PersonShort = Pretty<{
		id: number;
		credit_id: string;
		name: string;
		original_name?: string;
		gender: number;
		profile_path: string | null;
	}>;

	export type PersonExtended = Pretty<
		Person & {
			known_for: Media[];
		}
	>;

	export type PersonDetails = Pretty<
		Person & {
			also_known_as: string[];
			biography: string;
			birthday: string;
			deathday: string | null;
			homepage: string | null;
			imdb_id: string;
			place_of_birth: string;
		}
	>;

	type MovieMediaWithCastCredits = Pretty<
		MovieMedia & {
			order: number;
			character: string;
			credit_id: string;
		}
	>;

	type TvMediaWithCastCredits = Pretty<
		Omit<TvMedia, "seasons" | "origin_country" | "episodes"> & {
			origin_country: string[];
			credit_id: string;
			department: string;
			character: string;
			first_credit_air_date: string;
		}
	>;

	type MediaWithCastCredits =
		| MovieMediaWithCastCredits
		| TvMediaWithCastCredits;

	type MovieMediaWithCrewCredits = Pretty<
		MovieMedia & {
			department: string;
			job: string;
			credit_id: string;
		}
	>;

	type TvMediaWithCrewCredits = Pretty<
		Omit<TvMedia, "seasons" | "origin_country" | "episodes"> & {
			first_credit_air_date: string;
			department: string;
			credit_id: string;
			origin_country: string[];
		}
	>;

	type MediaWithCrewCredits =
		| MovieMediaWithCrewCredits
		| TvMediaWithCrewCredits;

	type PersonFromCast = Pretty<
		Omit<Person, "media_type"> & {
			cast_id: number;
			credit_id: string;
			character: string;
			order: number;
		}
	>;

	type PersonFromCrew = Pretty<
		Omit<Person, "media_type"> & {
			credit_id: string;
			department: string;
			job: string;
		}
	>;

	export type CastPersonInAggregatedTvCredits = Pretty<
		Omit<Person, "media_type"> & {
			roles: Role[];
			total_episode_count: number;
			order: number;
		}
	>;

	export type CrewPersonInAggregatedTvCredits = Pretty<
		Omit<Person, "media_type"> & {
			jobs: Job[];
			total_episode_count: number;
			department: string;
		}
	>;

	type CrewMember = {
		adult: boolean;
		gender: number | null;
		id: number;
		known_for_department: string;
		name: string;
		original_name: string;
		popularity: number;
		profile_path: string | null;
		credit_id: string;
		department: string;
		job: string;
	};

	export type CastMember = {
		adult: boolean;
		gender: number | null;
		id: number;
		known_for_department: string;
		name: string;
		original_name: string;
		popularity: number;
		profile_path: string | null;
		cast_id: number;
		character: string;
		credit_id: string;
		order: number;
	};

	type Role = Pretty<{
		credit_id: string;
		character: string;
		episode_count: number;
	}>;

	type Job = Pretty<{
		credit_id: string;
		job: string;
		episode_count: number;
	}>;

	export type PersonCombinedCredits = Pretty<{
		cast: MediaWithCastCredits[];
		crew: MediaWithCrewCredits[];
		id: number;
	}>;

	export type PersonMovieCredits = Pretty<{
		cast: MovieMediaWithCastCredits[];
		crew: MovieMediaWithCrewCredits[];
		id: number;
	}>;

	export type PersonTvCredits = Pretty<{
		cast: TvMediaWithCastCredits[];
		crew: TvMediaWithCrewCredits[];
		id: number;
	}>;

	export type PersonImages = Pretty<{
		id: number;
		profiles: Image[];
	}>;

	export type PersonExternalIds = Pretty<{
		id: number;
		freebase_mid: string;
		freebase_id: string;
		imdb_id: string;
		tvrage_id: number;
		wikidata_id: string;
		facebook_id: string;
		instagram_id: string;
		tiktok_id: string;
		twitter_id: string;
		youtube_id: string;
	}>;

	export type PersonTranslations = Pretty<{
		id: number;
		translations: Translation<PersonTranslationsData>[];
	}>;

	type PersonTranslationsData = Pretty<{
		biography: string;
		name: string;
	}>;

	export type Image = Pretty<{
		aspect_ratio: number;
		height: number;
		iso_3166_1?: string | null;
		iso_639_1?: string | null;
		file_path: string | null;
		vote_average: number;
		vote_count: number;
		width: number;
	}>;

	export type Video = Pretty<{
		iso_639_1?: string | null;
		iso_3166_1?: string | null;
		name: string;
		key: string;
		site: string;
		size: number;
		type: string;
		official: boolean;
		published_at: string;
		id: string;
	}>;

	export type CollectionsImages = Pretty<{
		id: number;
		backdrops: Image[];
		posters: Image[];
	}>;

	export type CollectionDetails = Pretty<{
		id: number;
		name: string;
		original_language: string;
		original_name: string;
		overview: string;
		poster_path: string | null;
		backdrop_path: string | null;
		parts: MovieInCollection[];
	}>;

	export type CollectionInSearch = Pretty<Omit<CollectionDetails, "parts">>;

	export type Translation<T> = {
		iso_3166_1: string;
		iso_639_1: string;
		name: string;
		english_name: string;
		data: T[];
	};

	type MovieTranslationData = Pretty<{
		title: string;
		overview: string;
		homepage: string | null;
		runtime: number | null;
		tagline: string;
	}>;

	type SpokenLanguage = {
		english_name: string;
		iso_639_1: string;
		name: string;
	};

	export type CollectionTranslations = Pretty<{
		id: number;
		translations: Translation<MovieTranslationData>[];
	}>;

	export type ProductionCompany = Pretty<{
		id: number;
		logo_path: string | null;
		name: string;
		origin_country: string;
	}>;

	export type ProductionCountry = Pretty<{
		iso_3166_1: string;
		name: string;
	}>;

	export type CompanyDetails = Pretty<{
		description: string;
		headquarters: string;
		homepage: string | null;
		id: number;
		logo_path: string | null;
		name: string;
		origin_country: string;
		parent_company: string;
	}>;

	export type NetworkDetails = Omit<
		CompanyDetails,
		"description" | "parent_company"
	>;

	type AlternativeNames = Pretty<{
		name: string;
		type: string;
	}>;

	export type CompanyAlternativeNames = Pretty<{
		id: number;
		results: AlternativeNames[];
	}>;

	type Logo = {
		aspect_ratio: number;
		file_path: string;
		height: number;
		id: string;
		file_type: ".svg" | ".png";
		vote_average: number;
		vote_count: number;
		width: number;
	};

	export type CompanyImages = Pretty<{
		id: number;
		logos: Logo[];
	}>;

	export type ConfigurationDetails = Pretty<{
		images: {
			base_url: string;
			secure_base_url: string;
			backdrop_sizes: string[];
			logo_sizes: string[];
			poster_sizes: string[];
			profile_sizes: string[];
			still_sizes: string[];
		};
		change_keys: string[];
	}>;

	type ConfigCountry = Pretty<{
		iso_3166_1: string;
		english_name: string;
		native_name: string;
	}>;

	type ConfigLanguage = Pretty<{
		iso_639_1: string;
		english_name: string;
		name: string;
	}>;

	type ConfigTimezone = Pretty<{
		iso_3166_1: string;
		zones: string[];
	}>;

	export type ConfigurationCountries = ConfigCountry[];

	export type ConfigurationJobs = Array<{
		department: string;
		jobs: string[];
	}>;

	export type ConfigurationLanguages = ConfigLanguage[];
	export type ConfigurationTimezones = ConfigTimezone[];

	export type CreditDetails = Pretty<{
		credit_type: string;
		department: string;
		job: string;
		media: Media;
		media_type: string;
		id: string;
		person: Person;
	}>;

	export type QueryParamsDiscoverMovie = Pretty<{
		certification: string;
		"certification.gte": string;
		"certification.lte": string;
		certification_country: string;
		include_adult: boolean;
		include_video: boolean;
		language: string;
		page: number;
		primary_release_year: number;
		"primary_release_date.gte": string;
		"primary_release_date.lte": string;
		region: string;
		"release_date.gte": string;
		"release_date.lte": string;
		sort_by:
			| "original_title.asc"
			| "original_title.desc"
			| "popularity.asc"
			| "popularity.desc"
			| "revenue.asc"
			| "revenue.desc"
			| "primary_release_date.asc"
			| "title.asc"
			| "title.desc"
			| "primary_release_date.desc"
			| "vote_average.asc"
			| "vote_average.desc"
			| "vote_count.asc"
			| "vote_count.desc";
		"vote_average.gte": number;
		"vote_average.lte": number;
		"vote_count.gte": number;
		"vote_count.lte": number;
		watch_region: string;
		with_cast: string;
		with_companies: string;
		with_crew: string;
		with_genres: string;
		with_keywords: string;
		with_origin_country: string;
		with_original_language: string;
		with_people: string;
		with_release_type: number;
		"with_runtime.gte": number;
		"with_runtime.lte": number;
		with_watch_monetization_types: string;
		with_watch_providers: string;
		without_companies: string;
		without_genres: string;
		without_keywords: string;
		without_watch_providers: string;
		year: number;
	}>;

	export type QueryParamsDiscoverTv = Pretty<{
		"air_date.gte": string;
		"air_date.lte": string;
		first_air_date_year: number;
		"first_air_date.gte": string;
		"first_air_date.lte": string;
		include_adult: boolean;
		include_null_first_air_dates: boolean;
		language: string;
		page: number;
		screened_theatrically: boolean;
		sort_by:
			| "first_air_date.asc"
			| "first_air_date.desc"
			| "name.asc"
			| "name.desc"
			| "original_name.asc"
			| "original_name.desc"
			| "popularity.asc"
			| "popularity.desc"
			| "vote_average.asc"
			| "vote_average.desc"
			| "vote_count.asc"
			| "vote_count.desc";
		timezone: string;
		"vote_average.gte": number;
		"vote_average.lte": number;
		"vote_count.gte": number;
		"vote_count.lte": number;
		watch_region: string;
		with_companies: string;
		with_genres: string;
		with_keywords: string;
		with_networks: number;
		with_origin_country: string;
		with_original_language: string;
		"with_runtime.gte": number;
		"with_runtime.lte": number;
		with_status: string;
		with_watch_monetization_types: string;
		with_watch_providers: string;
		without_companies: string;
		without_genres: string;
		without_keywords: string;
		without_watch_providers: string;
		with_type: string;
	}>;

	export type PaginatedResponse<T> = Pretty<{
		page: number;
		results: T[];
		total_pages: number;
		total_results: number;
	}>;

	export type DatedPaginatedResponse<T> = Pretty<
		PaginatedResponse<T> & {
			dates: {
				maximum: string;
				minimum: string;
			};
		}
	>;

	export type FindByIdResponse = Pretty<{
		movie_results: MovieMedia[];
		person_results: PersonExtended[];
		tv_results: TvMedia[];
		tv_episode_results: Episode[];
		tv_season_results: SeasonExtended[];
	}>;

	type Genre = Pretty<{
		id: number;
		name: string;
	}>;

	export type MoviesGenres = Pretty<{
		genres: Genre[];
	}>;

	export type TvGenres = Pretty<{
		genres: Genre[];
	}>;
}

export namespace Endpoints {
	export type getCertificationMovieList = {
		method: "GET";
		path: "/certification/movie/list";
		parameters: never;
		response: Schemas.CertificationMovieList;
	};
	export type getCertificationsTvList = {
		method: "GET";
		path: "/certification/tv/list";
		parameters: never;
		response: Schemas.CertificationTvList;
	};
	export type getCollectionDetails = {
		method: "GET";
		path: "/collection/{collection_id}";
		parameters: {
			query: Partial<{ language: string }>;
			path: Required<{ collection_id: number }>;
		};
		response: Schemas.CollectionDetails;
	};
	export type getCollectionImages = {
		method: "GET";
		path: "/collection/{collection_id}/images";
		parameters: {
			query: Partial<{ include_image_language: string; language: string }>;
			path: Required<{ collection_id: number }>;
		};
		response: Schemas.CollectionsImages;
	};
	export type getCollectionTranslations = {
		method: "GET";
		path: "/collection/{collection_id}/translations";
		parameters: {
			path: Required<{ collection_id: number }>;
		};
		response: Schemas.CollectionsImages;
	};
	export type getCompanyDetails = {
		method: "GET";
		path: "/company/{company_id}";
		parameters: {
			path: Required<{ company_id: number }>;
		};
		response: Schemas.CompanyDetails;
	};
	export type getCompanyAlternativeNames = {
		method: "GET";
		path: "/company/{company_id}/alternative_names";
		parameters: {
			path: Required<{ company_id: number }>;
		};
		response: Schemas.CompanyAlternativeNames;
	};
	export type getCompanyImages = {
		method: "GET";
		path: "/company/{company_id}/images";
		parameters: {
			path: Required<{ company_id: number }>;
		};
		response: Schemas.CompanyImages;
	};
	export type getConfigurationDetails = {
		method: "GET";
		path: "/configuration";
		parameters: never;
		response: Schemas.ConfigurationDetails;
	};
	export type getConfigurationCountries = {
		method: "GET";
		path: "/configuration/countries";
		parameters: {
			query: Partial<{ language: string }>;
		};
		response: Schemas.ConfigurationCountries;
	};
	export type getConfigurationJobs = {
		method: "GET";
		path: "/configuration/jobs";
		parameters: never;
		response: Schemas.ConfigurationJobs;
	};
	export type getConfigurationLanguages = {
		method: "GET";
		path: "/configuration/languages";
		parameters: never;
		response: Schemas.ConfigurationLanguages;
	};
	export type getConfigurationPrimaryTranslations = {
		method: "GET";
		path: "/configuration/primary_translations";
		parameters: never;
		response: string[];
	};
	export type getConfigurationTimezones = {
		method: "GET";
		path: "/configuration/timezones";
		parameters: never;
		response: Schemas.ConfigurationTimezones;
	};
	export type getCreditDetails = {
		method: "GET";
		path: "/credit/{credit_id}";
		parameters: {
			path: Required<{ credit_id: string }>;
		};
		response: Schemas.CreditDetails;
	};
	export type getDiscoverMovie = {
		method: "GET";
		path: "/discover/movie";
		parameters: {
			query: Partial<Schemas.QueryParamsDiscoverMovie>;
		};
		response: Schemas.PaginatedResponse<Schemas.Movie>;
	};
	export type getDiscoverTv = {
		method: "GET";
		path: "/discover/tv";
		parameters: {
			query: Partial<Schemas.QueryParamsDiscoverTv>;
		};
		response: Schemas.PaginatedResponse<Schemas.Tv>;
	};
	export type getFindByExternalId = {
		method: "GET";
		path: "/find/{external_id}";
		parameters: {
			query: {
				external_source: Schemas.ExternalId;
				language?: string;
			};
			path: Required<{
				external_id: string;
			}>;
		};
		response: Schemas.FindByIdResponse;
	};
	export type getGenresMovieList = {
		method: "GET";
		path: "/genre/movie/list";
		parameters: {
			query: Partial<{
				language: string;
			}>;
		};
		response: Schemas.MoviesGenres;
	};
	export type getGenresTvList = {
		method: "GET";
		path: "/genre/tv/list";
		parameters: {
			query: Partial<{
				language: string;
			}>;
		};
		response: Schemas.TvGenres;
	};
	export type getMovieNowPlaying = {
		method: "GET";
		path: "/movie/now_playing";
		parameters: {
			query: Partial<{ language: string; page: number; region: string }>;
		};
		response: Schemas.PaginatedResponse<Schemas.MovieMedia>;
	};
	export type getMoviePopularList = {
		method: "GET";
		path: "/movie/popular";
		parameters: {
			query: Partial<{ language: string; page: number; region: string }>;
		};
		response: Schemas.PaginatedResponse<Schemas.MovieMedia>;
	};
	export type getMovieTopRated = {
		method: "GET";
		path: "/movie/top_rated";
		parameters: {
			query: Partial<{ language: string; page: number; region: string }>;
		};
		response: Schemas.PaginatedResponse<Schemas.MovieMedia>;
	};
	export type getMovieUpcoming = {
		method: "GET";
		path: "/movie/upcoming";
		parameters: {
			query: Partial<{ language: string; page: number; region: string }>;
		};
		response: Schemas.DatedPaginatedResponse<Schemas.MovieMedia>;
	};
	export type getMovieDetails = {
		method: "GET";
		path: "/movie/{movie_id}";
		parameters: {
			query: Partial<{ append_to_response: string; language: string }>;
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.MovieDetails;
	};
	export type getMovieAlternativeTitles = {
		method: "GET";
		path: "/movie/{movie_id}/alternative_titles";
		parameters: {
			query: Partial<{ country: string }>;
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.MovieAlternativeTitles;
	};
	export type getMovieCredits = {
		method: "GET";
		path: "/movie/{movie_id}/credits";
		parameters: {
			query: Partial<{ language: string }>;
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.MovieCredits;
	};
	export type getMovieExternalIds = {
		method: "GET";
		path: "/movie/{movie_id}/external_ids";
		parameters: {
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.MovieExternalIds;
	};
	export type getMovieImages = {
		method: "GET";
		path: "/movie/{movie_id}/images";
		parameters: {
			query: Partial<{ include_image_language: string; language: string }>;
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.MovieImages;
	};
	export type getMovieKeywords = {
		method: "GET";
		path: "/movie/{movie_id}/keywords";
		parameters: {
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.MovieKeywords;
	};
	export type getMovieLatest = {
		method: "GET";
		path: "/movie/latest";
		parameters: never;
		response: Schemas.MovieDetails;
	};
	export type getMovieLists = {
		method: "GET";
		path: "/movie/{movie_id}/lists";
		parameters: {
			query: Partial<{ language: string; page: number }>;
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.PaginatedResponse<Schemas.List> & { id: number };
	};
	export type getMovieRecommendations = {
		method: "GET";
		path: "/movie/{movie_id}/recommendations";
		parameters: {
			query: Partial<{ language: string; page: number }>;
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.PaginatedResponse<Schemas.MovieWithMediaTypeItem>;
	};
	export type getMovieReleaseDates = {
		method: "GET";
		path: "/movie/{movie_id}/release_dates";
		parameters: {
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.MovieReleaseDates;
	};
	export type getMovieReviews = {
		method: "GET";
		path: "/movie/{movie_id}/reviews";
		parameters: {
			query: Partial<{ language: string; page: number }>;
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.Reviews;
	};
	export type getMovieSimilar = {
		method: "GET";
		path: "/movie/{movie_id}/similar";
		parameters: {
			query: Partial<{ language: string; page: number }>;
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.PaginatedResponse<Schemas.MovieMedia>;
	};
	export type getMovieTranslations = {
		method: "GET";
		path: "/movie/{movie_id}/translations";
		parameters: {
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.MovieTranslations;
	};
	export type getMovieVideos = {
		method: "GET";
		path: "/movie/{movie_id}/videos";
		parameters: {
			query: Partial<{ language: string }>;
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.MovieVideos;
	};
	export type getMovieWatchProviders = {
		method: "GET";
		path: "/movie/{movie_id}/watch/providers";
		parameters: {
			path: Required<{ movie_id: number }>;
		};
		response: Schemas.WatchProviders;
	};
	export type getNetworkDetails = {
		method: "GET";
		path: "/network/{network_id}";
		parameters: {
			path: Required<{ network_id: number }>;
		};
		response: Schemas.NetworkDetails;
	};
	export type getNetworkAlternativeNames = {
		method: "GET";
		path: "/network/{network_id}/alternative_names";
		parameters: {
			path: Required<{ network_id: number }>;
		};
		response: Schemas.CompanyAlternativeNames;
	};
	export type getNetworkImages = {
		method: "GET";
		path: "/network/{network_id}/images";
		parameters: {
			path: Required<{ network_id: number }>;
		};
		response: Schemas.CompanyImages;
	};
	export type getPersonPopularList = {
		method: "GET";
		path: "/person/popular";
		parameters: {
			query: Partial<{ language: string; page: number }>;
		};
		response: Schemas.PaginatedResponse<Schemas.PersonExtended>;
	};
	export type getPersonDetails = {
		method: "GET";
		path: "/person/{person_id}";
		parameters: {
			query: Partial<{ append_to_response: string; language: string }>;
			path: Required<{ person_id: number }>;
		};
		response: Schemas.PersonDetails;
	};
	export type getPersonCombinedCredits = {
		method: "GET";
		path: "/person/{person_id}/combined_credits";
		parameters: {
			query: Partial<{ language: string }>;
			path: Required<{ person_id: number }>;
		};
		response: Schemas.PersonCombinedCredits;
	};
	export type getPersonExternalIds = {
		method: "GET";
		path: "/person/{person_id}/external_ids";
		parameters: {
			path: Required<{ person_id: number }>;
		};
		response: Partial<Schemas.PersonExternalIds>;
	};
	export type getPersonImages = {
		method: "GET";
		path: "/person/{person_id}/images";
		parameters: {
			path: Required<{ person_id: number }>;
		};
		response: Schemas.PersonImages;
	};
	export type getPersonLatestId = {
		method: "GET";
		path: "/person/latest";
		parameters: never;
		response: Partial<Schemas.PersonDetails>;
	};
	export type getPersonMovieCredits = {
		method: "GET";
		path: "/person/{person_id}/movie_credits";
		parameters: {
			query: Partial<{ language: string }>;
			path: Required<{ person_id: number }>;
		};
		response: Schemas.PersonMovieCredits;
	};
	export type getPersonTvCredits = {
		method: "GET";
		path: "/person/{person_id}/movie_credits";
		parameters: {
			query: Partial<{ language: string }>;
			path: Required<{ person_id: number }>;
		};
		response: Schemas.PersonTvCredits;
	};
	export type getPersonTranslations = {
		method: "GET";
		path: "/person/{person_id}/translations";
		parameters: {
			path: Required<{ person_id: number }>;
		};
		response: Schemas.PersonTranslations;
	};
	export type getSearchCollection = {
		method: "GET";
		path: "/search/collection";
		parameters: {
			query: {
				query: string;
				include_adult?: boolean;
				language?: string;
				page?: number;
				region?: string;
			};
		};
		response: Schemas.PaginatedResponse<Schemas.CollectionInSearch>;
	};
	export type getSearchCompany = {
		method: "GET";
		path: "/search/company";
		parameters: {
			query: { query: string; page?: number };
		};
		response: Schemas.PaginatedResponse<Schemas.ProductionCompany>;
	};
	export type getSearchKeyword = {
		method: "GET";
		path: "/search/keyword";
		parameters: {
			query: { query: string; page?: number };
		};
		response: Schemas.PaginatedResponse<Schemas.Keyword>;
	};
	export type getSearchMovie = {
		method: "GET";
		path: "/search/movie";
		parameters: {
			query: {
				query: string;
				include_adult?: boolean;
				language?: string;
				primary_release_year?: string;
				page?: number;
				region?: string;
				year?: string;
			};
		};
		response: Schemas.PaginatedResponse<Schemas.Movie>;
	};
	export type getSearchMulti = {
		method: "GET";
		path: "/search/multi";
		parameters: {
			query: {
				query: string;
				include_adult?: boolean;
				language?: string;
				page?: number;
			};
		};
		response: Schemas.PaginatedResponse<Schemas.MediaMulti>;
	};
	export type getSearchPerson = {
		method: "GET";
		path: "/search/person";
		parameters: {
			query: {
				query: string;
				include_adult?: boolean;
				language?: string;
				page?: number;
			};
		};
		response: Schemas.PaginatedResponse<Schemas.PersonExtended>;
	};
	export type getSearchTv = {
		method: "GET";
		path: "/search/tv";
		parameters: {
			query: {
				query: string;
				first_air_date_year?: number;
				include_adult?: boolean;
				language?: string;
				page?: number;
				year?: number;
			};
		};
		response: Schemas.PaginatedResponse<Schemas.Tv>;
	};
	export type getTrendingAll = {
		method: "GET";
		path: "/trending/all/{time_window}";
		parameters: {
			query: Partial<{ language: string; page: number }>;
			path: Required<{ time_window: "day" | "week" }>;
		};
		response: Schemas.PaginatedResponse<Schemas.MediaMulti>;
	};
	export type getTrendingMovies = {
		method: "GET";
		path: "/trending/movie/{time_window}";
		parameters: {
			query: Partial<{ language: string; page: number }>;
			path: Required<{ time_window: "day" | "week" }>;
		};
		response: Schemas.PaginatedResponse<Schemas.MovieWithMediaTypeItem>;
	};
	export type getTrendingPeople = {
		method: "GET";
		path: "/trending/person/{time_window}";
		parameters: {
			query: Partial<{ language: string; page: number }>;
			path: Required<{ time_window: "day" | "week" }>;
		};
		response: Schemas.PaginatedResponse<Schemas.PersonExtended>;
	};
	export type getTrendingTv = {
		method: "GET";
		path: "/trending/tv/{time_window}";
		parameters: {
			query: Partial<{ language: string; page: number }>;
			path: { time_window: "day" | "week" };
		};
		response: Schemas.PaginatedResponse<Schemas.TvWithMediaType>;
	};
	export type getTvPopularList = {
		method: "GET";
		path: "/tv/popular";
		parameters: {
			query: Partial<{ language: string; page: number }>;
		};
		response: Schemas.PaginatedResponse<Schemas.Tv>;
	};
	export type getTvTopRatedList = {
		method: "GET";
		path: "/tv/top_rated";
		parameters: {
			query: Partial<{ language: string; page: number }>;
		};
		response: Schemas.PaginatedResponse<Schemas.Tv>;
	};
	export type getTvDetails = {
		method: "GET";
		path: "/tv/{series_id}";
		parameters: {
			query: Partial<{ append_to_response: string; language: string }>;
			path: Required<{ series_id: number }>;
		};
		response: Schemas.TvDetails;
	};
	export type getTvAggregateCredits = {
		method: "GET";
		path: "/tv/{series_id}/aggregate_credits";
		parameters: {
			query: Partial<{ language: string }>;
			path: Required<{ series_id: number }>;
		};
		response: Schemas.TvAggregatedCredits;
	};
	export type getTvAlternativeTitles = {
		method: "GET";
		path: "/tv/{series_id}/alternative_titles";
		parameters: {
			path: Required<{ series_id: number }>;
		};
		response: Schemas.TvAlternativeTitles;
	};
	export type getTvContentRatings = {
		method: "GET";
		path: "/tv/{series_id}/content_ratings";
		parameters: {
			path: Required<{ series_id: number }>;
		};
		response: Schemas.TvContentRatings;
	};
	export type getTvCredits = {
		method: "GET";
		path: "/tv/{series_id}/credits";
		parameters: {
			query: Partial<{ language: string }>;
			path: Required<{ series_id: number }>;
		};
		response: Schemas.TvCredits;
	};
	export type getTvEpisodeGroups = {
		method: "GET";
		path: "/tv/{series_id}/episode_groups";
		parameters: {
			path: Required<{ series_id: number }>;
		};
		response: Schemas.TvEpisodeGroups;
	};
	export type getTvExternalIDs = {
		method: "GET";
		path: "/tv/{series_id}/external_ids";
		parameters: {
			path: Required<{ series_id: number }>;
		};
		response: Schemas.TvExternalIds;
	};
	export type getTvImages = {
		method: "GET";
		path: "/tv/{series_id}/images";
		parameters: {
			query: Partial<{ include_image_language: string; language: string }>;
			path: Required<{ series_id: number }>;
		};
		response: Schemas.TvImages;
	};
	export type getTvKeywords = {
		method: "GET";
		path: "/tv/{series_id}/keywords";
		parameters: {
			path: Required<{ series_id: number }>;
		};
		response: Schemas.TvKeywords;
	};
	export type getTvLatestId = {
		method: "GET";
		path: "/tv/latest";
		parameters: never;
		response: Schemas.TvDetails;
	};
	export type getTvLists = {
		method: "GET";
		path: "/tv/{series_id}/lists";
		parameters: {
			query: Partial<{ language: string; page: number }>;
			path: Required<{ series_id: number }>;
		};
		response: Schemas.PaginatedResponse<Schemas.List> & { id: number };
	};
	export type getTvRecommendations = {
		method: "GET";
		path: "/tv/{series_id}/recommendations";
		parameters: {
			query: Partial<{ language: string; page: number }>;
			path: Required<{ series_id: number }>;
		};
		response: Schemas.PaginatedResponse<Schemas.TvMediaRecommendation>;
	};
	export type getTvReviews = {
		method: "GET";
		path: "/tv/{series_id}/reviews";
		parameters: {
			query: Partial<{ language: string; page: number }>;
			path: Required<{ series_id: number }>;
		};
		response: Schemas.PaginatedResponse<Schemas.Reviews>;
	};
	export type getTvScreenedTheatrically = {
		method: "GET";
		path: "/tv/{series_id}/screened_theatrically";
		parameters: {
			path: Required<{ series_id: number }>;
		};
		response: Schemas.TvScreenedTheatricallyResponse;
	};
	export type getTvSimilar = {
		method: "GET";
		path: "/tv/{series_id}/similar";
		parameters: {
			query: Partial<{ language: string; page: number }>;
			path: Required<{ series_id: number }>;
		};
		response: Schemas.PaginatedResponse<Schemas.Tv>;
	};
	export type getTvTranslations = {
		method: "GET";
		path: "/tv/{series_id}/translations";
		parameters: {
			path: Required<{ series_id: number }>;
		};
		response: Schemas.TvTranslations;
	};
	export type getTvVideos = {
		method: "GET";
		path: "/tv/{series_id}/videos";
		parameters: {
			query: Partial<{ include_video_language: string; language: string }>;
			path: Required<{ series_id: number }>;
		};
		response: Schemas.TvVideos;
	};
	export type getTvWatchProviders = {
		method: "GET";
		path: "/tv/{series_id}/watch/providers";
		parameters: {
			path: { series_id: number };
		};
		response: Schemas.WatchProviders;
	};
	export type getTvSeasonDetails = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}";
		parameters: {
			query: Partial<{ append_to_response: string; language: string }>;
			path: Required<{ series_id: number; season_number: number }>;
		};
		response: Schemas.TvSeasonDetails;
	};
	export type getTvSeasonAggregateCredits = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}/aggregate_credits";
		parameters: {
			query: Partial<{ language: string }>;
			path: Required<{ series_id: number; season_number: number }>;
		};
		response: Schemas.TvAggregatedCredits;
	};
	export type getTvSeasonCredits = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}/credits";
		parameters: {
			query: Partial<{ language: string }>;
			path: Required<{ series_id: number; season_number: number }>;
		};
		response: Schemas.TvCredits;
	};
	export type getTvSeasonExternalIds = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}/external_ids";
		parameters: {
			path: Required<{ series_id: number; season_number: number }>;
		};
		response: Schemas.TvSeasonExternalIds;
	};
	export type getTvSeasonImages = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}/images";
		parameters: {
			query: Partial<{ include_image_language: string; language: string }>;
			path: Required<{ series_id: number; season_number: number }>;
		};
		response: Schemas.TvSeasonImages;
	};
	export type getTvSeasonTranslations = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}/translations";
		parameters: {
			path: Required<{ series_id: number; season_number: number }>;
		};
		response: Schemas.TvSeasonTranslations;
	};
	export type getTvSeasonVideos = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}/videos";
		parameters: {
			query: Partial<{ include_video_language: string; language: string }>;
			path: Required<{ series_id: number; season_number: number }>;
		};
		response: Schemas.TvVideos;
	};
	export type getTvSeasonWatchProviders = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}/watch/providers";
		parameters: {
			query: Partial<{ language: string }>;
			path: Required<{ series_id: number; season_number: number }>;
		};
		response: Schemas.WatchProviders;
	};
	export type getTvEpisodeDetails = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}/episode/{episode_number}";
		parameters: {
			query: Partial<{ append_to_response: string; language: string }>;
			path: Required<{
				series_id: number;
				season_number: number;
				episode_number: number;
			}>;
		};
		response: Schemas.TvEpisodeDetails;
	};
	export type getTvEpisodeCredits = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}/episode/{episode_number}/credits";
		parameters: {
			query: Partial<{ language: string }>;
			path: Required<{
				series_id: number;
				season_number: number;
				episode_number: number;
			}>;
		};
		response: Schemas.TvEpisodeCredits;
	};
	export type getTvEpisodeExternalIds = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}/episode/{episode_number}/external_ids";
		parameters: {
			path: Required<{
				series_id: number;
				season_number: number;
				episode_number: number;
			}>;
		};
		response: Schemas.TvEpisodeExternalIds;
	};
	export type getTvEpisodeImages = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}/episode/{episode_number}/images";
		parameters: {
			query: Partial<{ include_image_language: string; language: string }>;
			path: Required<{
				series_id: number;
				season_number: number;
				episode_number: number;
			}>;
		};
		response: Schemas.TvEpisodeImages;
	};
	export type getTvEpisodeTranslations = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}/episode/{episode_number}/translations";
		parameters: {
			path: {
				series_id: number;
				season_number: number;
				episode_number: number;
			};
		};
		response: Schemas.TvEpisodeTranslations;
	};
	export type getTvEpisodeVideos = {
		method: "GET";
		path: "/tv/{series_id}/season/{season_number}/episode/{episode_number}/videos";
		parameters: {
			query: Partial<{ include_video_language: string; language: string }>;
			path: {
				series_id: number;
				season_number: number;
				episode_number: number;
			};
		};
		response: Schemas.TvVideos;
	};
	export type getTvEpisodeGroupDetails = {
		method: "GET";
		path: "/tv/episode_group/{tv_episode_group_id}";
		parameters: {
			path: Required<{ tv_episode_group_id: string }>;
		};
		response: Schemas.TvEpisodeGroupDetails;
	};
	export type getWatchProvidersAvailableRegions = {
		method: "GET";
		path: "/watch/providers/regions";
		parameters: {
			query: Partial<{ language: string }>;
		};
		response: Partial<{
			results: Array<
				Partial<{
					iso_3166_1: string;
					english_name: string;
					native_name: string;
				}>
			>;
		}>;
	};
}

export type EndpointByMethod = {
	get: {
		"/certification/movie/list": Endpoints.getCertificationMovieList;
		"/certification/tv/list": Endpoints.getCertificationsTvList;
		"/collection/{collection_id}": Endpoints.getCollectionDetails;
		"/collection/{collection_id}/images": Endpoints.getCollectionImages;
		"/collection/{collection_id}/translations": Endpoints.getCollectionTranslations;
		"/company/{company_id}": Endpoints.getCompanyDetails;
		"/company/{company_id}/alternative_names": Endpoints.getCompanyAlternativeNames;
		"/company/{company_id}/images": Endpoints.getCompanyImages;
		"/credit/{credit_id}": Endpoints.getCreditDetails;
		"/discover/movie": Endpoints.getDiscoverMovie;
		"/discover/tv": Endpoints.getDiscoverTv;
		"/find/{external_id}": Endpoints.getFindByExternalId;
		"/genre/movie/list": Endpoints.getGenresMovieList;
		"/genre/tv/list": Endpoints.getGenresTvList;
		"/movie/now_playing": Endpoints.getMovieNowPlaying;
		"/movie/popular": Endpoints.getMoviePopularList;
		"/movie/top_rated": Endpoints.getMovieTopRated;
		"/movie/upcoming": Endpoints.getMovieUpcoming;
		"/movie/{movie_id}": Endpoints.getMovieDetails;
		"/movie/{movie_id}/alternative_titles": Endpoints.getMovieAlternativeTitles;
		"/movie/{movie_id}/credits": Endpoints.getMovieCredits;
		"/movie/{movie_id}/external_ids": Endpoints.getMovieExternalIds;
		"/movie/{movie_id}/images": Endpoints.getMovieImages;
		"/movie/{movie_id}/keywords": Endpoints.getMovieKeywords;
		"/movie/latest": Endpoints.getMovieLatest;
		"/movie/{movie_id}/lists": Endpoints.getMovieLists;
		"/movie/{movie_id}/recommendations": Endpoints.getMovieRecommendations;
		"/movie/{movie_id}/release_dates": Endpoints.getMovieReleaseDates;
		"/movie/{movie_id}/reviews": Endpoints.getMovieReviews;
		"/movie/{movie_id}/similar": Endpoints.getMovieSimilar;
		"/movie/{movie_id}/translations": Endpoints.getMovieTranslations;
		"/movie/{movie_id}/videos": Endpoints.getMovieVideos;
		"/movie/{movie_id}/watch/providers": Endpoints.getMovieWatchProviders;
		"/network/{network_id}": Endpoints.getNetworkDetails;
		"/network/{network_id}/alternative_names": Endpoints.getNetworkAlternativeNames;
		"/network/{network_id}/images": Endpoints.getNetworkImages;
		"/person/popular": Endpoints.getPersonPopularList;
		"/person/{person_id}": Endpoints.getPersonDetails;
		"/person/{person_id}/combined_credits": Endpoints.getPersonCombinedCredits;
		"/person/{person_id}/external_ids": Endpoints.getPersonExternalIds;
		"/person/{person_id}/images": Endpoints.getPersonImages;
		"/person/latest": Endpoints.getPersonLatestId;
		"/person/{person_id}/movie_credits": Endpoints.getPersonMovieCredits;
		"/person/{person_id}/tv_credits": Endpoints.getPersonTvCredits;
		"/person/{person_id}/translations": Endpoints.getPersonTranslations;
		"/search/collection": Endpoints.getSearchCollection;
		"/search/company": Endpoints.getSearchCompany;
		"/search/keyword": Endpoints.getSearchKeyword;
		"/search/movie": Endpoints.getSearchMovie;
		"/search/multi": Endpoints.getSearchMulti;
		"/search/person": Endpoints.getSearchPerson;
		"/search/tv": Endpoints.getSearchTv;
		"/trending/all/{time_window}": Endpoints.getTrendingAll;
		"/trending/movie/{time_window}": Endpoints.getTrendingMovies;
		"/trending/person/{time_window}": Endpoints.getTrendingPeople;
		"/trending/tv/{time_window}": Endpoints.getTrendingTv;
		"/tv/top_rated": Endpoints.getTvTopRatedList;
		"/tv/{series_id}": Endpoints.getTvDetails;
		"/tv/{series_id}/aggregate_credits": Endpoints.getTvAggregateCredits;
		"/tv/{series_id}/alternative_titles": Endpoints.getTvAlternativeTitles;
		"/tv/{series_id}/content_ratings": Endpoints.getTvContentRatings;
		"/tv/{series_id}/credits": Endpoints.getTvCredits;
		"/tv/{series_id}/episode_groups": Endpoints.getTvEpisodeGroups;
		"/tv/{series_id}/external_ids": Endpoints.getTvExternalIDs;
		"/tv/{series_id}/images": Endpoints.getTvImages;
		"/tv/{series_id}/keywords": Endpoints.getTvKeywords;
		"/tv/latest": Endpoints.getTvLatestId;
		"/tv/{series_id}/lists": Endpoints.getTvLists;
		"/tv/{series_id}/recommendations": Endpoints.getTvRecommendations;
		"/tv/{series_id}/reviews": Endpoints.getTvReviews;
		"/tv/{series_id}/screened_theatrically": Endpoints.getTvScreenedTheatrically;
		"/tv/{series_id}/similar": Endpoints.getTvSimilar;
		"/tv/{series_id}/translations": Endpoints.getTvTranslations;
		"/tv/{series_id}/videos": Endpoints.getTvVideos;
		"/tv/{series_id}/watch/providers": Endpoints.getTvWatchProviders;
		"/tv/{series_id}/season/{season_number}": Endpoints.getTvSeasonDetails;
		"/tv/{series_id}/season/{season_number}/aggregate_credits": Endpoints.getTvSeasonAggregateCredits;
		"/tv/{series_id}/season/{season_number}/credits": Endpoints.getTvSeasonCredits;
		"/tv/{series_id}/season/{season_number}/external_ids": Endpoints.getTvSeasonExternalIds;
		"/tv/{series_id}/season/{season_number}/images": Endpoints.getTvSeasonImages;
		"/tv/{series_id}/season/{season_number}/translations": Endpoints.getTvSeasonTranslations;
		"/tv/{series_id}/season/{season_number}/videos": Endpoints.getTvSeasonVideos;
		"/tv/{series_id}/season/{season_number}/watch/providers": Endpoints.getTvSeasonWatchProviders;
		"/tv/{series_id}/season/{season_number}/episode/{episode_number}": Endpoints.getTvEpisodeDetails;
		"/tv/{series_id}/season/{season_number}/episode/{episode_number}/credits": Endpoints.getTvEpisodeCredits;
		"/tv/{series_id}/season/{season_number}/episode/{episode_number}/external_ids": Endpoints.getTvEpisodeExternalIds;
		"/tv/{series_id}/season/{season_number}/episode/{episode_number}/images": Endpoints.getTvEpisodeImages;
		"/tv/{series_id}/season/{season_number}/episode/{episode_number}/translations": Endpoints.getTvEpisodeTranslations;
		"/tv/{series_id}/season/{season_number}/episode/{episode_number}/videos": Endpoints.getTvEpisodeVideos;
		"/tv/episode_group/{tv_episode_group_id}": Endpoints.getTvEpisodeGroupDetails;
		"/watch/providers/regions": Endpoints.getWatchProvidersAvailableRegions;
	};
};

// <EndpointByMethod.Shorthands>
export type GetEndpoints = EndpointByMethod["get"];
export type EndpointPath = keyof GetEndpoints;
export type AllEndpoints = EndpointByMethod[keyof EndpointByMethod];
// </EndpointByMethod.Shorthands>

// <ApiClientTypes>
export type EndpointParameters = {
	body?: unknown;
	query?: Record<string, unknown>;
	header?: Record<string, unknown>;
	path?: Record<string, unknown>;
};

export type MutationMethod = "post" | "put" | "patch" | "delete";
export type Method = "get" | "head" | MutationMethod;

export type DefaultEndpoint = {
	parameters?: EndpointParameters | undefined;
	response: unknown;
};

export type Endpoint<TConfig extends DefaultEndpoint = DefaultEndpoint> = {
	operationId: string;
	method: Method;
	path: string;
	parameters?: TConfig["parameters"];
	meta: {
		alias: string;
		hasParameters: boolean;
		areParametersRequired: boolean;
	};
	response: TConfig["response"];
};

export type Fetcher = <TResponse>(
	method: Method,
	baseUrl: string,
	path: EndpointPath,
	apiKey: string,
	parameters?: EndpointParameters | undefined,
) => Promise<TResponse>;

export type RequiredKeys<T> = {
	[P in keyof T]-?: undefined extends T[P] ? never : P;
}[keyof T];

export type MaybeOptionalArg<T> = RequiredKeys<T> extends never
	? [config?: T]
	: [config: T];
// </ApiClientTypes>

/**
 Example usage:
 const api = createApiClient((method, url, params) =>
   fetch(url, { method, body: JSON.stringify(params) }).then((res) => res.json()),
 );
 api.get("/users").then((users) => console.log(users));
 api.post("/users", { body: { name: "John" } }).then((user) => console.log(user));
 api.put("/users/:id", { path: { id: 1 }, body: { name: "John" } }).then((user) => console.log(user));
*/

// </ApiClient
