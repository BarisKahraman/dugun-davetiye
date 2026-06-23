export type Attendance = "attending" | "not_attending";

export type AccommodationNeed = "yes" | "no" | "unsure";

export type SiteMode = "before" | "day" | "after";

export type AnalyticsMetric = "pageViews" | "rsvpStarted" | "rsvpCompleted";

export type ScheduleItem = {
  id: string;
  order: number;
  title: string;
  time?: string;
  description?: string;
  enabled: boolean;
};

export type WeddingConfig = {
  couple: {
    bride: string;
    groom: string;
    brideAge?: number;
    groomAge?: number;
  };
  families: {
    brideMother?: string;
    brideFather?: string;
    groomMother?: string;
    groomFather?: string;
  };
  event: {
    date: string;
    startTime?: string;
    endTime?: string;
    timezone: string;
    venueName: string;
    address: string;
    city: string;
    dressCode?: string;
    childrenInvited: boolean;
  };
  schedule: ScheduleItem[];
  rsvp: {
    enabled: boolean;
    required: boolean;
    deadline: string;
  };
  transport: {
    shuttleAvailable: boolean;
    parkingInfo?: string;
  };
  contact: {
    phone?: string;
    whatsapp?: string;
  };
  gift: {
    enabled: boolean;
    iban?: string;
    accountName?: string;
    note: string;
  };
  music: {
    enabled: boolean;
    preferredSong?: string;
    localAudioUrl?: string;
    spotifyUrl?: string;
  };
  social: {
    instagramAccounts?: string[];
    hashtag?: string;
  };
  gallery: {
    uploadUrl?: string;
    publicGalleryUrl?: string;
  };
  copy: {
    heroEyebrow: string;
    manifesto: string;
    invitation: string;
    rsvpPositiveThanks: string;
    rsvpNegativeThanks: string;
    guestNotePrompt: string;
    privacyNote: string;
    postWeddingThanks: string;
  };
};

export type RsvpFormInput = {
  fullName: string;
  phone: string;
  attendance: Attendance;
  guestCount?: number;
  accommodationNeed?: AccommodationNeed;
  message?: string;
  songTitle?: string;
  songArtist?: string;
  consent?: boolean;
  honey?: string;
};

export type RsvpSubmission = RsvpFormInput & {
  source: "public-site" | "mock";
};

export type RsvpResult = {
  ok: true;
  id?: string;
  message: string;
};

export type AdminRsvp = {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  attendance: Attendance;
  guestCount: number;
  accommodationNeed?: AccommodationNeed;
  message?: string;
  songTitle?: string;
  songArtist?: string;
};

export type GuestbookEntry = {
  id: string;
  createdAt: string;
  fullName: string;
  note?: string;
  songTitle?: string;
  songArtist?: string;
  approved: boolean;
  displayedName?: string;
};

export type AdminDashboard = {
  totals: {
    rsvpCount: number;
    attendingCount: number;
    notAttendingCount: number;
    guestCount: number;
  };
  dailyRsvps: Array<{ date: string; count: number }>;
  accommodationNeeds: AdminRsvp[];
  rsvps: AdminRsvp[];
  guestbook: GuestbookEntry[];
  songs: Array<{ title: string; artist?: string; fullName: string }>;
  settingsSheetUrl?: string;
  schedule: ScheduleItem[];
};
