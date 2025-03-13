type DateTime = string;

export type Nullable<T> = T | null;

export interface Team {
	id: number;
	name: string;
	personal_team: boolean;
	created_at: DateTime;
	updated_at: DateTime;
}

export interface Auth {
	user: Nullable<
		User & {
			all_teams?: Team[];
			current_team?: Team;
		}
	>;
}

export type InertiaSharedProps<T = {}> = T & {
	jetstream: {
		canCreateTeams: boolean;
		canManageTwoFactorAuthentication: boolean;
		canUpdatePassword: boolean;
		canUpdateProfileInformation: boolean;
		flash: any;
		hasAccountDeletionFeatures: boolean;
		hasApiFeatures: boolean;
		hasTeamFeatures: boolean;
		hasTermsAndPrivacyPolicyFeature: boolean;
		managesProfilePhotos: boolean;
		hasEmailVerification: boolean;
	};
	auth: Auth;
	errorBags: any;
	errors: any;
};

export interface Session {
	id: number;
	ip_address: string;
	is_current_device: boolean;
	agent: {
		is_desktop: boolean;
		platform: string;
		browser: string;
	};
	last_active: DateTime;
}

export interface ApiToken {
	id: number;
	name: string;
	abilities: string[];
	last_used_ago: Nullable<DateTime>;
	created_at: DateTime;
	updated_at: DateTime;
}

export interface JetstreamTeamPermissions {
	canAddTeamMembers: boolean;
	canDeleteTeam: boolean;
	canRemoveTeamMembers: boolean;
	canUpdateTeam: boolean;
}

export interface Role {
	key: string;
	name: string;
	permissions: string[];
	description: string;
}

export interface TeamInvitation {
	id: number;
	team_id: number;
	email: string;
	role: Nullable<string>;
	created_at: DateTime;
	updated_at: DateTime;
}

export interface IdeasProps {
	ideas: Idea[];
}

export type Idea = {
	title: string;
	description: string;
	tags: Tag[];
	tasks: Task[];
	user: User;
	user_id: number;
	id: number;
	value: number;
	active: boolean;
	created_at: string;
	updated_at: string;
	applications_count: number;
	tasks_count: number;
	expires: string;
};

export type PaginatedIdea = {
	id: number;
	title: string;
	description: string;
	tags: string[];
	active: boolean;
	value: number;
	user: { id: number; name: string };
	applications_count: number;
	tasks_count: number;
	created_at: DateTime;
	updated_at: DateTime;
};

export type PaginationInstance = {
	data: PaginatedIdea[];
	next_cursor: string;
	prev_cursor: string;
	onLastPage: boolean;
}

export type Application = {
	created_at: DateTime;
	description: string;
	id: number;
	include_profile: boolean;
	status: 'sent' | 'approved' | 'declined';
	task_id: number;
	user_id: number;
	updated_at: DateTime;
}

export type ReceivedApplicationsType = {
	created_at: DateTime;
	description: string;
	id: number;
	include_profile: boolean;
	status: 'sent' | 'approved' | 'declined';
	task_id: number;
	user_id: number;
	updated_at: DateTime;
	task: {
		created_at: DateTime;
		description: string;
		has_applied:boolean;
		id:number;
		idea_id:number;
		name:string;
		status: Status;
		updated_at: DateTime;
		user_id: number;
		idea: {
			active: boolean;
			created_at: DateTime;
			description: string;
			expires: DateTime;
			id: number;
			title: string;
			updated_at: DateTime;
		}
	}
	user: {
		bio: string;
		current_team_id: number;
		email: string;
		id: number;
		name: string;
		profile_photo_url: string;
	}
}[];

export type RegularPaginationInstance = {
	data: ReceivedApplicationsType;
	current_page: number;
	first_page_url: string;
	from:number;
	last_page: number;
	last_page_url: string;
	next_page_url: string;
	path: string;
	per_page: number;
	prev_page_url:string;
	to:number;
	total:number;
}

export type User = {
	active: boolean;
	created_at: string;
	current_team_id: number;
	email: string;
	email_verified_at?: string;
	id: number;
	name: string;
	profile_photo_path?: string;
	profile_photo_url?: string;
	two_factor_confirmed_at?: string;
	updated_at: string;
	bio: string;
};

export type Tag = {
	id: number;
	name: string;
	pivot: Record<number, string>;
};

export type Task = {
	created_at?: string;
	description: string;
	id: number;
	idea_id: number;
	updated_at?: string;
	value: number;
	status: Status;
	applications: Application[];
	name: string;
	has_applied: boolean;
};

export type Status = 'to_do' | 'in_progress' | 'done';
