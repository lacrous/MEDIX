import Dexie, { type Table } from 'dexie';
import type {
  Hospital, User, Department, Patient, Bed, Appointment,
  Visit, VitalSigns, Prescription, PrescriptionItem, InventoryItem, AuditLog
} from '@/types';

class MEDIXDatabase extends Dexie {
  hospitals!: Table<Hospital>;
  users!: Table<User>;
  departments!: Table<Department>;
  patients!: Table<Patient>;
  beds!: Table<Bed>;
  appointments!: Table<Appointment>;
  visits!: Table<Visit>;
  vitalSigns!: Table<VitalSigns>;
  prescriptions!: Table<Prescription>;
  prescriptionItems!: Table<PrescriptionItem>;
  inventoryItems!: Table<InventoryItem>;
  auditLogs!: Table<AuditLog>;

  constructor() {
    super('MEDIX_DB');
    this.version(1).stores({
      hospitals: '++id, code, status',
      users: '++id, email, hospitalId, role, status',
      departments: '++id, hospitalId, code',
      patients: '++id, patientId, hospitalId',
      beds: '++id, hospitalId, departmentId, status, patientId',
      appointments: '++id, hospitalId, date, doctorId, status',
      visits: '++id, hospitalId, patientId, doctorId, status',
      vitalSigns: '++id, patientId, visitId',
      prescriptions: '++id, hospitalId, patientId, doctorId',
      prescriptionItems: '++id, prescriptionId',
      inventoryItems: '++id, hospitalId, code, category',
      auditLogs: '++id, userId, hospitalId, createdAt',
    });
  }
}

export const db = new MEDIXDatabase();
