import { db } from '@/db/database';
import type { Hospital, User, Patient, Appointment, Department, Bed, InventoryItem } from '@/types';

// Hospital Service
export async function getHospitals(): Promise<Hospital[]> {
  return db.hospitals.toArray();
}

export async function getHospitalById(id: string): Promise<Hospital | undefined> {
  return db.hospitals.get(id);
}

export async function createHospital(data: Partial<Hospital>): Promise<string> {
  return db.hospitals.add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Hospital) as Promise<string>;
}

export async function updateHospital(id: string, data: Partial<Hospital>): Promise<number> {
  return db.hospitals.update(id, { ...data, updatedAt: new Date() });
}

export async function deleteHospital(id: string): Promise<void> {
  await db.hospitals.delete(id);
}

export async function getHospitalStats(hospitalId?: string) {
  const patients = hospitalId
    ? await db.patients.where('hospitalId').equals(hospitalId).count()
    : await db.patients.count();

  const beds = hospitalId
    ? await db.beds.where('hospitalId').equals(hospitalId).toArray()
    : await db.beds.toArray();

  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED').length;
  const totalBeds = beds.length;

  const appointments = hospitalId
    ? await db.appointments.where('hospitalId').equals(hospitalId).toArray()
    : await db.appointments.toArray();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayAppts = appointments.filter(a => {
    const d = new Date(a.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  const users = hospitalId
    ? await db.users.where('hospitalId').equals(hospitalId).toArray()
    : await db.users.toArray();

  return {
    patients: { total: patients, new: Math.floor(patients * 0.1) },
    beds: {
      total: totalBeds,
      occupied: occupiedBeds,
      available: totalBeds - occupiedBeds,
      maintenance: beds.filter(b => b.status === 'MAINTENANCE').length,
    },
    appointments: {
      total: appointments.length,
      today: todayAppts.length,
      upcoming: appointments.filter(a => new Date(a.date) > today).length,
    },
    users: {
      total: users.length,
      doctors: users.filter(u => u.role === 'DOCTOR').length,
      nurses: users.filter(u => u.role === 'NURSE').length,
    },
    revenue: {
      today: todayAppts.length * 150,
      month: appointments.length * 150,
    },
  };
}

// User Service
export async function getUsers(hospitalId?: string): Promise<User[]> {
  if (hospitalId) {
    return db.users.where('hospitalId').equals(hospitalId).toArray();
  }
  return db.users.toArray();
}

export async function getUsersByZone(zoneId: string, hospitalId?: string): Promise<User[]> {
  let users = hospitalId
    ? await db.users.where('hospitalId').equals(hospitalId).toArray()
    : await db.users.toArray();
  return users.filter(u => u.zoneId === zoneId);
}

export async function getUserById(id: string): Promise<User | undefined> {
  return db.users.get(id);
}

export async function createUser(data: Partial<User>): Promise<string> {
  return db.users.add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User) as Promise<string>;
}

export async function updateUser(id: string, data: Partial<User>): Promise<number> {
  return db.users.update(id, { ...data, updatedAt: new Date() });
}

export async function deleteUser(id: string): Promise<void> {
  await db.users.delete(id);
}

// Patient Service
export async function getPatients(hospitalId?: string): Promise<Patient[]> {
  if (hospitalId) {
    return db.patients.where('hospitalId').equals(hospitalId).toArray();
  }
  return db.patients.toArray();
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  return db.patients.get(id);
}

export async function searchPatients(query: string, hospitalId?: string): Promise<Patient[]> {
  let patients = hospitalId
    ? await db.patients.where('hospitalId').equals(hospitalId).toArray()
    : await db.patients.toArray();

  if (!query) return patients;

  const q = query.toLowerCase();
  return patients.filter(p =>
    p.firstName.toLowerCase().includes(q) ||
    p.lastName.toLowerCase().includes(q) ||
    p.patientId.toLowerCase().includes(q) ||
    (p.phone && p.phone.includes(q)) ||
    (p.nationalId && p.nationalId.includes(q))
  );
}

export async function createPatient(data: Partial<Patient>): Promise<string> {
  return db.patients.add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Patient) as Promise<string>;
}

export async function updatePatient(id: string, data: Partial<Patient>): Promise<number> {
  return db.patients.update(id, { ...data, updatedAt: new Date() });
}

export async function deletePatient(id: string): Promise<void> {
  await db.patients.delete(id);
}

// Appointment Service
export async function getAppointments(hospitalId?: string): Promise<Appointment[]> {
  if (hospitalId) {
    return db.appointments.where('hospitalId').equals(hospitalId).toArray();
  }
  return db.appointments.toArray();
}

export async function getTodaysAppointments(hospitalId?: string): Promise<Appointment[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let appts = hospitalId
    ? await db.appointments.where('hospitalId').equals(hospitalId).toArray()
    : await db.appointments.toArray();

  return appts.filter(a => {
    const d = new Date(a.date);
    return d >= today && d < tomorrow;
  });
}

export async function createAppointment(data: Partial<Appointment>): Promise<string> {
  return db.appointments.add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Appointment) as Promise<string>;
}

export async function updateAppointment(id: string, data: Partial<Appointment>): Promise<number> {
  return db.appointments.update(id, { ...data, updatedAt: new Date() });
}

export async function deleteAppointment(id: string): Promise<void> {
  await db.appointments.delete(id);
}

// Department Service
export async function getDepartments(hospitalId?: string): Promise<Department[]> {
  if (hospitalId) {
    return db.departments.where('hospitalId').equals(hospitalId).toArray();
  }
  return db.departments.toArray();
}

// Bed Service
export async function getBeds(hospitalId?: string): Promise<Bed[]> {
  if (hospitalId) {
    return db.beds.where('hospitalId').equals(hospitalId).toArray();
  }
  return db.beds.toArray();
}

export async function updateBed(id: string, data: Partial<Bed>): Promise<number> {
  return db.beds.update(id, { ...data, updatedAt: new Date() });
}

// Inventory Service
export async function getInventoryItems(hospitalId?: string): Promise<InventoryItem[]> {
  if (hospitalId) {
    return db.inventoryItems.where('hospitalId').equals(hospitalId).toArray();
  }
  return db.inventoryItems.toArray();
}

export async function getLowStockItems(hospitalId?: string): Promise<InventoryItem[]> {
  const items = hospitalId
    ? await db.inventoryItems.where('hospitalId').equals(hospitalId).toArray()
    : await db.inventoryItems.toArray();
  return items.filter(item => item.quantity <= item.minStock);
}

export async function getExpiringItems(hospitalId?: string): Promise<InventoryItem[]> {
  const threeMonths = new Date();
  threeMonths.setMonth(threeMonths.getMonth() + 3);

  const items = hospitalId
    ? await db.inventoryItems.where('hospitalId').equals(hospitalId).toArray()
    : await db.inventoryItems.toArray();

  return items.filter(item => item.expiryDate && item.expiryDate <= threeMonths);
}
