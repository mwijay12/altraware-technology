import { db } from "./firebase";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

export interface SystemInquiry {
  id: string;
  name: string;
  org?: string;
  phone: string;
  email?: string;
  type: string; // "Website" | "Faida POS" | "CareTrack" | "ShuleDirect Pro" | "Custom Software" | "Consultation"
  message: string;
  budget?: string;
  timeline?: string;
  status: "new" | "contacted" | "in_progress" | "converted" | "closed";
  notes?: string;
  createdAt: string; // ISO date
  refCode?: string;
}

const STORAGE_KEY = "altraware_inquiries_v1";

const DEFAULT_INQUIRIES: SystemInquiry[] = [
  {
    id: "inq-1728391001",
    refCode: "ALT-4891",
    name: "Baraka Mwangi",
    org: "Kariakoo Wholesalers Ltd",
    phone: "+255 754 112 233",
    email: "baraka@kariakoowholesale.co.tz",
    type: "Faida POS",
    message: "Tunahitaji mfumo wa Faida POS kwa matawi 3 Kariakoo na Tegeta, uwe na ripoti za kila siku za M-Pesa na stoo ya pamoja bila intaneti kutusimamisha.",
    budget: "TSh 1,200,000",
    timeline: "Wiki 2 zijazo",
    status: "new",
    notes: "Ameomba demo ya offline sync na Bluetooth printer.",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "inq-1728391002",
    refCode: "ALT-7120",
    name: "Dr. Grace Mrema",
    org: "Afya Bora Daycare & Clinic",
    phone: "+255 655 443 322",
    email: "grace@afyaboratz.org",
    type: "CareTrack",
    message: "Tunataka mfumo wa kufuatilia mahudhurio ya watoto, rekodi za chanjo na taarifa za wazazi kwa SMS papo kwa hapo.",
    budget: "TSh 850,000",
    timeline: "Ndani ya mwezi huu",
    status: "contacted",
    notes: "Tumezungumza kwenye simu, ametumiwa quotation ya CareTrack Pro.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "inq-1728391003",
    refCode: "ALT-3392",
    name: "Juma Ally",
    org: "Safari Serengeti Tours",
    phone: "+255 788 998 877",
    email: "info@serengetitours.co.tz",
    type: "Website",
    message: "Tunahitaji tovuti ya kisasa ya utalii yenye booking engine, Kiswahili na Kiingereza, na malipo ya moja kwa moja ya M-Pesa & Card.",
    budget: "TSh 650,000",
    timeline: "Haraka iwezekanavyo",
    status: "in_progress",
    notes: "Wireframes tayari, tunasubiri nembo na picha za magari.",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];

export function loadLocalInquiries(): SystemInquiry[] {
  if (typeof window === "undefined") return DEFAULT_INQUIRIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INQUIRIES));
      return DEFAULT_INQUIRIES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_INQUIRIES;
  }
}

export function saveLocalInquiries(items: SystemInquiry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save local inquiries:", err);
  }
}

export async function fetchAllInquiries(): Promise<SystemInquiry[]> {
  const local = loadLocalInquiries();
  if (typeof window === "undefined") return local;

  try {
    const colRef = collection(db, "inquiries");
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const remoteList: SystemInquiry[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data() as SystemInquiry;
        remoteList.push({ ...data, id: docSnap.id });
      });

      // Merge remote with local ensuring no loss
      const map = new Map<string, SystemInquiry>();
      local.forEach((item) => map.set(item.id, item));
      remoteList.forEach((item) => map.set(item.id, item));
      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      saveLocalInquiries(merged);
      return merged;
    }
  } catch (err) {
    console.warn("Firestore fetch error, using local storage:", err);
  }
  return local;
}

export async function createInquiry(
  inquiry: Omit<SystemInquiry, "id" | "createdAt" | "status"> & { id?: string; status?: SystemInquiry["status"] }
): Promise<SystemInquiry> {
  const id = inquiry.id || "inq-" + Date.now();
  const full: SystemInquiry = {
    ...inquiry,
    id,
    status: inquiry.status || "new",
    createdAt: new Date().toISOString(),
    refCode: inquiry.refCode || "#ALT-" + Math.floor(1000 + Math.random() * 9000),
  };

  // 1. Save locally
  const current = loadLocalInquiries();
  const updated = [full, ...current.filter((x) => x.id !== id)];
  saveLocalInquiries(updated);

  // 2. Try Firestore
  try {
    await setDoc(doc(db, "inquiries", id), full);
  } catch (err) {
    console.warn("Firestore save error, preserved locally:", err);
  }

  return full;
}

export async function updateInquiry(id: string, patch: Partial<SystemInquiry>): Promise<SystemInquiry[]> {
  const current = loadLocalInquiries();
  const updated = current.map((item) => (item.id === id ? { ...item, ...patch } : item));
  saveLocalInquiries(updated);

  try {
    const found = updated.find((x) => x.id === id);
    if (found) {
      await setDoc(doc(db, "inquiries", id), found, { merge: true });
    }
  } catch (err) {
    console.warn("Firestore update error:", err);
  }

  return updated;
}

export async function removeInquiry(id: string): Promise<SystemInquiry[]> {
  const current = loadLocalInquiries();
  const updated = current.filter((x) => x.id !== id);
  saveLocalInquiries(updated);

  try {
    await deleteDoc(doc(db, "inquiries", id));
  } catch (err) {
    console.warn("Firestore delete error:", err);
  }

  return updated;
}
