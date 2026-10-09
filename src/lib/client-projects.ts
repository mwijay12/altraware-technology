import { db } from "./firebase";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

export type ProjectStage = "discovery" | "design" | "development" | "staging" | "live";

export interface ProjectDocSection {
  title: string;
  content: string;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  status: "completed" | "in_progress" | "pending";
  completedAt?: string | null;
  notes?: string;
  order: number;
}

export interface ProjectDeliverable {
  id: string;
  name: string;
  url: string;
  fileType?: string;
  size?: string;
  uploadedAt?: string;
}

export interface ClientProject {
  id: string;
  clientId?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  company?: string;
  systemName: string; // e.g. "Faida POS Multi-Branch", "CareTrack Daycare", "Altraware Custom ERP"
  stage: ProjectStage;
  progressPercent: number; // 0 - 100
  totalAmount?: number;
  amountPaid?: number;
  startDate: string;
  targetLaunchDate: string;
  liveUrl?: string;
  apkDownloadUrl?: string;
  adminCredentials?: {
    portalUrl?: string;
    username?: string;
    tempPassword?: string;
    note?: string;
  };
  milestones?: ProjectMilestone[];
  deliverables?: ProjectDeliverable[];
  documentation: {
    overview: string;
    architecture: string;
    userGuide: string;
    apiEndpoints: string;
    slaSupport: string;
  };
  updatedAt: string;
}

export const DEFAULT_MILESTONES: ProjectMilestone[] = [
  { id: "m1", name: "Discovery & Technical Scope", status: "completed", completedAt: "2026-09-15", notes: "Requirements gathering, user stories, and architecture sign-off completed.", order: 1 },
  { id: "m2", name: "UI/UX Design & Prototyping", status: "completed", completedAt: "2026-09-22", notes: "All user flows, interactive prototypes, and design systems approved by client.", order: 2 },
  { id: "m3", name: "Agile Engineering & Database", status: "in_progress", completedAt: null, notes: "Core POS engine, SQLite offline sync, and REST API microservices under active development.", order: 3 },
  { id: "m4", name: "QA & Client Staging Sandbox", status: "pending", completedAt: null, notes: "End-to-end testing, printer compatibility, and mock store rehearsal.", order: 4 },
  { id: "m5", name: "Live Production Deployment", status: "pending", completedAt: null, notes: "Cloud deployment, APK signing, and official administrative credentials handover.", order: 5 },
  { id: "m6", name: "Hypercare & 24/7 SLA Support", status: "pending", completedAt: null, notes: "Continuous monitoring, staff onboarding, and monthly feature rollouts.", order: 6 },
];

const STORAGE_KEY = "altraware_client_projects_v2";

export const DEFAULT_PROJECTS: ClientProject[] = [
  {
    id: "proj-faida-pos-01",
    clientName: "Kariakoo Wholesalers Ltd",
    clientEmail: "admin@kariakoowholesale.co.tz",
    clientPhone: "+255 754 112 233",
    company: "Kariakoo Wholesalers Group",
    systemName: "Faida POS — Multi-Branch Edition",
    stage: "development",
    progressPercent: 65,
    totalAmount: 2000000,
    amountPaid: 1300000,
    startDate: "2026-09-15",
    targetLaunchDate: "2026-10-25",
    liveUrl: "https://pos.kariakoowholesale.co.tz",
    apkDownloadUrl: "https://github.com/mwijay12/faida-pos-releases/releases/download/Faida/faida.pos.apk",
    adminCredentials: {
      portalUrl: "https://pos.kariakoowholesale.co.tz/admin",
      username: "manager@kariakoo.tz",
      tempPassword: "KariakooSafe2026!",
      note: "Please change password on initial sign-in.",
    },
    milestones: DEFAULT_MILESTONES,
    deliverables: [
      { id: "d1", name: "Faida_POS_v1.2.0_Production.apk", url: "https://github.com/mwijay12/faida-pos-releases/releases/download/Faida/faida.pos.apk", fileType: "apk", size: "28.4 MB", uploadedAt: "2026-10-01" },
      { id: "d2", name: "Altraware_Faida_POS_Architecture_Blueprint.pdf", url: "#", fileType: "pdf", size: "4.2 MB", uploadedAt: "2026-09-20" },
    ],
    documentation: {
      overview: "Offline-first retail POS and multi-branch inventory operating system built with Flutter for Android and Desktop terminals. Operates 100% offline with automatic cloud synchronization when network connects.",
      architecture: "Frontend: Flutter 3.29 (Dart) + SQLite Database. Backend Sync: Node.js Microservice with PostgreSQL. Cloud Backup: Google Cloud Storage.",
      userGuide: "1. Download the production APK via the button above.\n2. Enable Bluetooth permission for the 58mm/80mm thermal receipt printer.\n3. Input cashier username and security PIN.\n4. Process your first sale and verify receipt printing.",
      apiEndpoints: "Sync Webhook: POST /api/v1/sync/transactions\nInventory Push: POST /api/v1/inventory/batch\nAuth Token: POST /api/v1/auth/device",
      slaSupport: "Technical support: 24/7 hotline and WhatsApp (+255 757 939 444). Critical emergency SLA response: Under 2 hours.",
    },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-caretrack-02",
    clientName: "Afya Bora Daycare & Clinic",
    clientEmail: "admin@afyaboratz.org",
    clientPhone: "+255 655 443 322",
    systemName: "CareTrack — Child Attendance & Health Records",
    stage: "staging",
    progressPercent: 88,
    startDate: "2026-08-20",
    targetLaunchDate: "2026-10-15",
    liveUrl: "https://staging.afyabora.altraware.co.tz",
    adminCredentials: {
      portalUrl: "https://staging.afyabora.altraware.co.tz/login",
      username: "director@afyaboratz.org",
      tempPassword: "CareTrack2026#Secure",
      note: "Staging environment for instructor and nurse rehearsals.",
    },
    documentation: {
      overview: "Secure attendance management, pediatric health monitoring, and SMS notification platform for parents and care centres.",
      architecture: "Next.js 16 + Tailwind CSS + Supabase / PostgreSQL. SMS Gateway: Beem SMS API.",
      userGuide: "1. Sign in to Dashboard using administrator credentials.\n2. Select 'Register Child' to link guardian phone number.\n3. Use Attendance screen to record daily check-ins and temperature.",
      apiEndpoints: "SMS Webhook: https://api.beem.africa/v1/send\nGuardian Notify: POST /api/notify/parent",
      slaSupport: "Technical support: Monday - Saturday 8:00 AM - 6:00 PM. Direct escalation via WhatsApp.",
    },
    updatedAt: new Date().toISOString(),
  },
];

export function loadLocalProjects(): ClientProject[] {
  if (typeof window === "undefined") return DEFAULT_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export function saveLocalProjects(items: ClientProject[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save local projects:", err);
  }
}

export async function fetchAllProjects(): Promise<ClientProject[]> {
  const local = loadLocalProjects();
  if (typeof window === "undefined") return local;

  try {
    const colRef = collection(db, "client_projects");
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const remoteList: ClientProject[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data() as ClientProject;
        remoteList.push({ ...data, id: docSnap.id });
      });

      const map = new Map<string, ClientProject>();
      local.forEach((p) => map.set(p.id, p));
      remoteList.forEach((p) => map.set(p.id, p));
      const merged = Array.from(map.values());
      saveLocalProjects(merged);
      return merged;
    }
  } catch (err) {
    console.warn("Firestore fetch error for projects:", err);
  }

  return local;
}

export async function saveProject(project: ClientProject): Promise<ClientProject[]> {
  const current = loadLocalProjects();
  const exists = current.some((p) => p.id === project.id);
  const updated = exists
    ? current.map((p) => (p.id === project.id ? { ...project, updatedAt: new Date().toISOString() } : p))
    : [{ ...project, updatedAt: new Date().toISOString() }, ...current];

  saveLocalProjects(updated);

  try {
    await setDoc(doc(db, "client_projects", project.id), project, { merge: true });
  } catch (err) {
    console.warn("Firestore saveProject error:", err);
  }

  return updated;
}

export async function deleteProject(id: string): Promise<ClientProject[]> {
  const current = loadLocalProjects();
  const updated = current.filter((p) => p.id !== id);
  saveLocalProjects(updated);

  try {
    await deleteDoc(doc(db, "client_projects", id));
  } catch (err) {
    console.warn("Firestore deleteProject error:", err);
  }

  return updated;
}

export async function fetchProjectsForClient(emailOrUid?: string | null): Promise<ClientProject[]> {
  const all = await fetchAllProjects();
  if (!emailOrUid) return all;
  const clean = emailOrUid.toLowerCase().trim();
  const matched = all.filter(
    (p) =>
      (p.clientEmail && p.clientEmail.toLowerCase().trim() === clean) ||
      (p.clientId && p.clientId === clean)
  );
  return matched;
}

