import { API_URL } from '../constants';

export interface SignedInUser {
  id: number;
  email: string;
  displayName: string;
  accountType: 'parent' | 'teacher' | 'admin' | 'staff' | 'student';
  globalRole: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  user: SignedInUser;
}

export interface ParentChild {
  id: number;
  schoolId: number;
  schoolName: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth?: string;
  photoUrl?: string;
}

export interface CommunicationGroup {
  id: number;
  schoolId: number;
  schoolName: string;
  name: string;
  teacherName?: string;
  childNames: string[];
  latestPostAt?: string;
  unreadCount: number;
}

export interface CommunicationAttachment {
  id: number;
  kind: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
}

export interface CommunicationPost {
  id: number;
  groupId: number;
  groupName: string;
  authorName: string;
  authorRole: string;
  body: string;
  isPinned: boolean;
  publishedAt: string;
  attachments: CommunicationAttachment[];
}

export interface ParentPayment {
  id: number;
  studentId: number;
  studentName: string;
  amount: number;
  reference: string;
  paidAt: string;
  receiptNumber: string;
  notes?: string;
}

type ApiEnvelope<T> = { statusCode: number; data: T; message?: string };

let authToken: string | null = null;
export function setAuthToken(token: string | null) { authToken = token; }
export function getAuthToken() { return authToken; }

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const error = await response.json();
      message = error.detail || error.message || message;
    } catch {}
    throw new Error(message);
  }

  const payload = await response.json() as ApiEnvelope<T> | T;
  return typeof payload === 'object' && payload !== null && 'data' in payload
    ? (payload as ApiEnvelope<T>).data
    : payload as T;
}

export const api = {
  login: (email: string, password: string) => request<LoginResponse>('POST', '/auth/login', { email, password }),
  getChildren: () => request<ParentChild[]>('GET', '/communication/children'),
  getGroups: () => request<CommunicationGroup[]>('GET', '/communication/groups'),
  getGroupPosts: (groupId: number) => request<CommunicationPost[]>('GET', `/communication/groups/${groupId}/posts`),
  getPayments: () => request<ParentPayment[]>('GET', '/parent/payments'),
  emailReceipt: (paymentId: number) => request<{ message: string }>('POST', `/parent/payments/${paymentId}/email-receipt`),
  registerPushDevice: (expoPushToken: string, platform: 'ios' | 'android', deviceName?: string) =>
    request('POST', '/notifications/devices', { expoPushToken, platform, deviceName }),
};
