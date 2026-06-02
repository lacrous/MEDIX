export type UserRole = 'SUPER_ADMIN' | 'HOSPITAL_ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PHARMACIST' | 'ACCOUNTANT' | 'LAB_TECHNICIAN' | 'RADIOLOGIST';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ON_LEAVE';

export type HospitalStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'MAINTENANCE';

export type DepartmentStatus = 'ACTIVE' | 'INACTIVE' | 'UNDER_MAINTENANCE';

export type BedType = 'STANDARD' | 'ICU' | 'EMERGENCY' | 'PRIVATE' | 'ISOLATION' | 'PEDIATRIC' | 'MATERNITY';

export type BedStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED' | 'CLEANING';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type BloodType = 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE';

export type VisitType = 'OUTPATIENT' | 'INPATIENT' | 'EMERGENCY' | 'FOLLOW_UP' | 'CONSULTATION' | 'SURGERY' | 'LABORATORY' | 'RADIOLOGY';

export type VisitStatus = 'WAITING' | 'IN_PROGRESS' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'TRANSFERRED';

export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';

export type AppointmentType = 'REGULAR' | 'EMERGENCY' | 'FOLLOW_UP' | 'CONSULTATION' | 'SURGERY' | 'LAB_TEST' | 'RADIOLOGY' | 'VACCINATION' | 'CHECKUP';

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED_BY_PATIENT' | 'CANCELLED_BY_CLINIC' | 'NO_SHOW' | 'RESCHEDULED';

export type PrescriptionStatus = 'DRAFT' | 'ACTIVE' | 'DISPENSED' | 'PARTIALLY_DISPENSED' | 'COMPLETED' | 'CANCELLED';

export type InventoryCategory = 'MEDICATION' | 'MEDICAL_SUPPLY' | 'EQUIPMENT' | 'LAB_REAGENT' | 'RADIOLOGY_SUPPLY' | 'SURGICAL_INSTRUMENT' | 'DISPOSABLE' | 'VACCINE' | 'OTHER';

export type InventoryStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED' | 'RECALLED';

export type AuditAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'EXPORT' | 'PRINT' | 'APPROVE' | 'REJECT' | 'TRANSFER' | 'ARCHIVE' | 'RESTORE';

export interface Hospital {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  licenseNo?: string;
  status: HospitalStatus;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  nameEn?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  hospitalId?: string;
  departmentId?: string;
  zoneId?: string;
  specialization?: string;
  licenseNumber?: string;
  avatarUrl?: string;
  createdBy?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  nameEn?: string;
  code: string;
  description?: string;
  hospitalId: string;
  headDoctorId?: string;
  status: DepartmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bed {
  id: string;
  number: string;
  roomNumber: string;
  floor?: string;
  type: BedType;
  status: BedStatus;
  hospitalId: string;
  departmentId?: string;
  patientId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  firstNameEn?: string;
  lastNameEn?: string;
  dateOfBirth?: Date;
  gender: Gender;
  bloodType?: BloodType;
  nationalId?: string;
  phone?: string;
  email?: string;
  address?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  insuranceExpiry?: Date;
  allergies?: string;
  chronicDiseases?: string;
  currentMedications?: string;
  notes?: string;
  hospitalId: string;
  registeredBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Visit {
  id: string;
  visitNumber: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  departmentId?: string;
  type: VisitType;
  status: VisitStatus;
  priority: Priority;
  chiefComplaint?: string;
  symptoms?: string;
  examination?: string;
  diagnosis?: string;
  diagnosisICD10?: string;
  notes?: string;
  admissionDate?: Date;
  dischargeDate?: Date;
  dischargeSummary?: string;
  totalCost?: number;
  paidAmount?: number;
  paymentStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VitalSigns {
  id: string;
  visitId?: string;
  patientId: string;
  recordedBy: string;
  temperature?: number;
  bloodPressureSys?: number;
  bloodPressureDia?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  bloodGlucose?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  painScale?: number;
  notes?: string;
  recordedAt: Date;
}

export interface Appointment {
  id: string;
  appointmentNo: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  departmentId?: string;
  date: Date;
  time: string;
  duration: number;
  type: AppointmentType;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  diagnosis?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prescription {
  id: string;
  prescriptionNo: string;
  visitId?: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  status: PrescriptionStatus;
  instructions?: string;
  dispensedBy?: string;
  dispensedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrescriptionItem {
  id: string;
  prescriptionId: string;
  medicationName: string;
  medicationNameEn?: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  unit: string;
  instructions?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  nameEn?: string;
  code: string;
  category: InventoryCategory;
  description?: string;
  hospitalId: string;
  quantity: number;
  minStock: number;
  maxStock?: number;
  reorderPoint: number;
  unitPrice: number;
  costPrice?: number;
  unit: string;
  supplier?: string;
  batchNumber?: string;
  expiryDate?: Date;
  storageLocation?: string;
  status: InventoryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  hospitalId?: string;
  description: string;
  createdAt: Date;
}

export interface DashboardStats {
  patients: { total: number; new: number };
  beds: { total: number; occupied: number; available: number; maintenance: number };
  appointments: { total: number; today: number; upcoming: number };
  revenue: { today: number; month: number };
}

export interface Alert {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  description: string;
  hospitalId?: string;
  createdAt: Date;
  read: boolean;
}

export interface AuthResult {
  user: Omit<User, 'password'>;
  token: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}
