import { API_URL } from '../constants';

// ── Types — match the real Drizzle schema exactly ─────────────────────────────

export interface Course {
  id: number;
  organizationId: number;
  title: string;
  slug?: string;
  description?: string;
  shortDescription?: string;   // short_description in DB
  price?: number;
  thumbnailUrl?: string;        // thumbnail_url in DB
  durationWeeks?: number;       // duration_weeks in DB
  language?: string;
  isPublished?: boolean;        // is_published in DB
  createdByUserId?: number;
  createdAt?: string;
  updatedAt?: string;
  // Joined from API
  organization?: Organization;
  instructors?: CourseInstructor[];
  enrollmentCount?: number;
}

export interface CourseInstructor {
  courseId: number;
  userId: number;
  role: 'primary' | 'co_instructor' | 'ta';
  user?: { id: number; firstName?: string; lastName?: string; email: string };
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  orderIndex: number;
  contentType: 'video' | 'text' | 'quiz' | 'attachment' | 'live';
  videoUrl?: string;
  contentText?: string;
  durationMinutes?: number;     // duration_minutes in DB
  isFreePreview?: boolean;      // is_free_preview in DB
  instructorId?: number;
  createdAt?: string;
}

export interface LessonProgress {
  id: number;
  enrollmentId: number;
  lessonId: number;
  completed: boolean;
  watchedPercentage: number;
  lastWatchedAt?: string;
}

export interface Organization {
  id: number;
  slug: string;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  contactEmail?: string;
  isPublic?: boolean;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt?: string;
  completedAt?: string;
  paymentStatus: 'pending' | 'paid' | 'free' | 'refunded';
  progressPercentage?: number;
  course?: Course;
}

export interface UserProfile {
  id: number;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  firstName?: string;
  lastName?: string;
  profile?: {
    bio?: string;
    profilePictureUrl?: string;
    timezone?: string;
    country?: string;
  };
}

export interface LoginResponse {
  statusCode?: number;
  message?: string;
  data?: { access_token: string; user?: any };
  access_token?: string;
  user?: any;
}

// ── Token ─────────────────────────────────────────────────────────────────────
let _token: string | null = null;
export function setAuthToken(t: string | null) { _token = t; }
export function getAuthToken() { return _token; }

// ── Request ───────────────────────────────────────────────────────────────────
async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;
  const res = await fetch(`${API_URL}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const e = await res.json(); msg = e.message || msg; } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return {} as T;
  return res.json();
}

// ── Unwrap { statusCode, data } wrapper your backend uses ─────────────────────
function unwrap<T>(r: any): T {
  if (r && typeof r === 'object' && 'statusCode' in r && 'data' in r) return r.data as T;
  return r as T;
}
async function unwrapReq<T>(method: string, path: string, body?: unknown): Promise<T> {
  const r = await req<any>(method, path, body);
  return unwrap<T>(r);
}

// ── API ───────────────────────────────────────────────────────────────────────
export const api = {
  // Auth
  login:    (email: string, password: string) => req<LoginResponse>('POST', '/users/login', { email, password }),
  register: (data: { email:string; password:string; role?:string; firstName?:string; lastName?:string }) =>
              req<LoginResponse>('POST', '/users/create', data),
  getMe:    () => unwrapReq<UserProfile>('GET', '/auth/me'),

  // Courses
  getCourses: async (params?: { page?:number; limit?:number; search?:string }) => {
    const q = new URLSearchParams();
    if (params?.page)   q.set('page',   String(params.page));
    if (params?.limit)  q.set('limit',  String(params.limit));
    if (params?.search) q.set('search', params.search);
    const qs = q.toString();
    const r = await req<any>('GET', `/courses${qs ? '?'+qs : ''}`);
    const u = unwrap<any>(r);
    if (Array.isArray(u)) return u as Course[];
    if (u?.data && Array.isArray(u.data)) return u.data as Course[];
    return [] as Course[];
  },
  getCourse:        (id: number)  => unwrapReq<Course>('GET',    `/courses/${id}`),
  getFeaturedCourses: async () => {
    const r = await req<any>('GET', '/courses/public/featured');
    const u = unwrap<any>(r);
    return Array.isArray(u) ? u as Course[] : [];
  },

  // Lessons
  getLessons: async (courseId: number) => {
    const r = await req<any>('GET', `/lessons/course/${courseId}`);
    const u = unwrap<any>(r);
    return Array.isArray(u) ? u as Lesson[] : [];
  },
  getLesson:            (id: number) => unwrapReq<Lesson>('GET', `/lessons/${id}`),
  updateLessonProgress: (lessonId: number, data: { watchedPercentage?: number; completed?: boolean }) =>
    unwrapReq<any>('PUT', `/lessons/${lessonId}/progress`, data),

  // Enrollments
  getMyEnrollments: async () => {
    const r = await req<any>('GET', '/enrollments/my-enrollments');
    const u = unwrap<any>(r);
    return Array.isArray(u) ? u as Enrollment[] : [];
  },
  enroll:               (courseId: number)  => unwrapReq<Enrollment>('POST', '/enrollments', { courseId }),
  getEnrollmentProgress:(courseId: number)  => unwrapReq<any>('GET',  `/enrollments/progress/${courseId}`),

  // Organizations
  getOrganisations: async () => {
    const r = await req<any>('GET', '/organizations');
    const u = unwrap<any>(r);
    return Array.isArray(u) ? u as Organization[] : [];
  },
  getOrganisation: (id: number) => unwrapReq<Organization>('GET', `/organizations/${id}`),
};