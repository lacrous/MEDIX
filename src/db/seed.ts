import { db } from './database';
import bcryptjs from 'bcryptjs';

const now = new Date();
const hashPassword = async (pwd: string) => bcryptjs.hash(pwd, 10);

const hospitalsData = [
  { code: 'MED-001', name: 'مستشفى النور', nameEn: 'Al-Noor Hospital', address: 'شارع النور، الرياض', phone: '011-2345678', email: 'info@alnoor.med', licenseNo: 'LH-001-2024', status: 'ACTIVE' as const },
  { code: 'MED-002', name: 'مستشفى الأمل', nameEn: 'Al-Amal Hospital', address: 'شارع الأمل، جدة', phone: '012-3456789', email: 'info@alamal.med', licenseNo: 'LH-002-2024', status: 'ACTIVE' as const },
  { code: 'MED-003', name: 'مستشفى الصفا', nameEn: 'Al-Safa Hospital', address: 'شارع الصفا، الدمام', phone: '013-4567890', email: 'info@alsafa.med', licenseNo: 'LH-003-2024', status: 'ACTIVE' as const },
  { code: 'MED-004', name: 'مستشفى الرحمة', nameEn: 'Al-Rahma Hospital', address: 'شارع الرحمة، مكة', phone: '014-5678901', email: 'info@alrahma.med', licenseNo: 'LH-004-2024', status: 'ACTIVE' as const },
  { code: 'MED-005', name: 'مستشفى الشفاء', nameEn: 'Al-Shifa Hospital', address: 'شارع الشفاء، المدينة', phone: '015-6789012', email: 'info@alshifa.med', licenseNo: 'LH-005-2024', status: 'ACTIVE' as const },
  { code: 'MED-006', name: 'مستشفى السلام', nameEn: 'Al-Salam Hospital', address: 'شارع السلام، أبها', phone: '016-7890123', email: 'info@alsalam.med', licenseNo: 'LH-006-2024', status: 'ACTIVE' as const },
  { code: 'MED-007', name: 'مستشفى الهدى', nameEn: 'Al-Huda Hospital', address: 'شارع الهدى، تبوك', phone: '017-8901234', email: 'info@alhuda.med', licenseNo: 'LH-007-2024', status: 'ACTIVE' as const },
  { code: 'MED-008', name: 'مستشفى البركة', nameEn: 'Al-Baraka Hospital', address: 'شارع البركة، بريدة', phone: '018-9012345', email: 'info@albaraka.med', licenseNo: 'LH-008-2024', status: 'ACTIVE' as const },
  { code: 'MED-009', name: 'مستشفى التقوى', nameEn: 'Al-Taqwa Hospital', address: 'شارع التقوى، حائل', phone: '019-0123456', email: 'info@altaqwa.med', licenseNo: 'LH-009-2024', status: 'INACTIVE' as const },
  { code: 'MED-010', name: 'مستشفى الإيمان', nameEn: 'Al-Iman Hospital', address: 'شارع الإيمان، نجران', phone: '017-1234567', email: 'info@aliman.med', licenseNo: 'LH-010-2024', status: 'ACTIVE' as const },
];

const departmentsTemplate = [
  { code: 'INT', name: 'الباطنة', nameEn: 'Internal Medicine' },
  { code: 'SUR', name: 'الجراحة', nameEn: 'Surgery' },
  { code: 'PED', name: 'الأطفال', nameEn: 'Pediatrics' },
  { code: 'EMR', name: 'الطوارئ', nameEn: 'Emergency' },
  { code: 'OBG', name: 'النساء والولادة', nameEn: 'Obstetrics & Gynecology' },
  { code: 'ORT', name: 'العظام', nameEn: 'Orthopedics' },
  { code: 'CAR', name: 'القلب', nameEn: 'Cardiology' },
  { code: 'NEU', name: 'المخ والأعصاب', nameEn: 'Neurology' },
  { code: 'RAD', name: 'الأشعة', nameEn: 'Radiology' },
  { code: 'LAB', name: 'المختبر', nameEn: 'Laboratory' },
  { code: 'PHA', name: 'الصيدلية', nameEn: 'Pharmacy' },
  { code: 'DEN', name: 'الأسنان', nameEn: 'Dentistry' },
  { code: 'ENT', name: 'الأنف والأذن', nameEn: 'ENT' },
  { code: 'DER', name: 'الجلدية', nameEn: 'Dermatology' },
  { code: 'PSY', name: 'النفسية', nameEn: 'Psychiatry' },
];

const arabicFirstNames = ['أحمد', 'محمد', 'خالد', 'فاطمة', 'سارة', 'نورة', 'عبدالله', 'سلطان', 'هند', 'ريم', 'ليلى', 'منى', 'يوسف', 'عمر', 'حسن', 'حسين', 'علي', 'سعيد', 'ماجد', 'فهد', 'نايف', 'تركي', 'بندر', 'خالد', 'صالح', 'إبراهيم', 'نواف', 'مشاري', 'طلال', 'بدر', 'شريف', 'أميرة', 'عبير', 'هدى', 'جميلة', 'سعاد', 'فريدة', 'رشا', 'دينا', 'إيمان'];
const arabicLastNames = ['العلي', 'الخالد', 'السعيد', 'الحسن', 'المحمد', 'العبدالله', 'السلطان', 'الفهد', 'النايف', 'التركي', 'البندر', 'الصالح', 'الإبراهيم', 'النواف', 'المشاري', 'الطلال', 'البدر', 'الشريف', 'الحمد', 'القحطاني', 'العتيبي', 'المالك', 'الشهري', 'الغامدي', 'الحربي', 'السهلي', 'ال Dowd', 'الكعبي', 'الأحمد', 'الفارس'];
const specializationNames = ['باطنة', 'جراحة عامة', 'أطفال', 'قلب', 'عظام', 'مخ وأعصاب', 'جلدية', 'أنف وأذن', 'نساء وولادة', 'أسنان', 'أشعة', 'مختبر', 'نفسية'];

export async function seedDatabase() {
  const hospitalCount = await db.hospitals.count();
  if (hospitalCount > 0) return;

  const hashedPassword = await hashPassword('MedixAdmin2026!');

  // Seed hospitals
  const hospitalIds: string[] = [];
  for (const h of hospitalsData) {
    const id = await db.hospitals.add({
      ...h,
      createdAt: now,
      updatedAt: now,
    } as any);
    hospitalIds.push(id as string);
  }

  // Seed Super Admin
  await db.users.add({
    email: 'admin@medix.com',
    password: hashedPassword,
    name: 'المدير العام',
    nameEn: 'Super Administrator',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  } as any);

  // Seed departments per hospital
  const deptIdsByHospital: Record<string, string[]> = {};
  for (let hi = 0; hi < hospitalIds.length; hi++) {
    const hid = hospitalIds[hi];
    deptIdsByHospital[hid] = [];
    for (const dt of departmentsTemplate) {
      const id = await db.departments.add({
        ...dt,
        hospitalId: hid,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      } as any);
      deptIdsByHospital[hid].push(id as string);
    }
  }

  // Seed users for each hospital
  const roles: Array<{ role: string; count: number; spec?: boolean }> = [
    { role: 'HOSPITAL_ADMIN', count: 1 },
    { role: 'DOCTOR', count: 5, spec: true },
    { role: 'NURSE', count: 4 },
    { role: 'RECEPTIONIST', count: 2 },
    { role: 'PHARMACIST', count: 1 },
    { role: 'LAB_TECHNICIAN', count: 1 },
  ];

  for (let hi = 0; hi < hospitalIds.length; hi++) {
    const hid = hospitalIds[hi];
    const _hCode = hospitalsData[hi].code;
    for (const r of roles) {
      for (let i = 0; i < r.count; i++) {
        const fn = arabicFirstNames[Math.floor(Math.random() * arabicFirstNames.length)];
        const ln = arabicLastNames[Math.floor(Math.random() * arabicLastNames.length)];
        const deptIdx = Math.floor(Math.random() * 8);
        await db.users.add({
          email: `${_hCode.toLowerCase()}-${r.role.toLowerCase()}${i + 1}@medix.com`,
          password: hashedPassword,
          name: `${fn} ${ln}`,
          nameEn: `${fn} ${ln}`,
          phone: `05${Math.floor(Math.random() * 90000000 + 10000000)}`,
          role: r.role as any,
          status: 'ACTIVE',
          hospitalId: hid,
          departmentId: deptIdsByHospital[hid][deptIdx],
          specialization: r.spec ? specializationNames[Math.floor(Math.random() * specializationNames.length)] : undefined,
          licenseNumber: r.spec ? `ML-${_hCode}-${1000 + i}` : undefined,
          createdAt: now,
          updatedAt: now,
        } as any);
      }
    }
  }

  // Seed patients
  const bloodTypes = ['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'];
  const genders = ['MALE', 'FEMALE'] as const;

  for (let hi = 0; hi < hospitalIds.length; hi++) {
    const hid = hospitalIds[hi];
    const _hCode = hospitalsData[hi].code;
    const allUsers = await db.users.where('hospitalId').equals(hid).toArray();
    const receptionists = allUsers.filter(u => u.role === 'RECEPTIONIST');

    for (let i = 0; i < 40; i++) {
      const fn = arabicFirstNames[Math.floor(Math.random() * arabicFirstNames.length)];
      const ln = arabicLastNames[Math.floor(Math.random() * arabicLastNames.length)];
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const dob = new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);

      await db.patients.add({
        patientId: `${_hCode}-2026-${String(i + 1).padStart(4, '0')}`,
        firstName: fn,
        lastName: ln,
        firstNameEn: fn,
        lastNameEn: ln,
        dateOfBirth: dob,
        gender: gender as any,
        bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)] as any,
        nationalId: `${Math.floor(Math.random() * 9 + 1)}${String(Math.floor(Math.random() * 999999999)).padStart(9, '0')}`,
        phone: `05${Math.floor(Math.random() * 90000000 + 10000000)}`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
        address: `شارع ${Math.floor(Math.random() * 100 + 1)}، ${hospitalsData[hi].name}`,
        emergencyName: `${arabicFirstNames[Math.floor(Math.random() * arabicFirstNames.length)]} ${arabicLastNames[Math.floor(Math.random() * arabicLastNames.length)]}`,
        emergencyPhone: `05${Math.floor(Math.random() * 90000000 + 10000000)}`,
        emergencyRelation: ['أب', 'أم', 'زوج', 'زوجة', 'أخ', 'أخت'][Math.floor(Math.random() * 6)],
        insuranceProvider: ['شركة تأمين ألف', 'شركة تأمين باء', 'شركة تأمين جيم'][Math.floor(Math.random() * 3)],
        insuranceNumber: `INS-${_hCode}-${String(i + 1).padStart(5, '0')}`,
        allergies: Math.random() > 0.7 ? 'حساسية من البنسلين' : undefined,
        chronicDiseases: Math.random() > 0.6 ? 'سكري، ضغط' : undefined,
        hospitalId: hid,
        registeredBy: receptionists[0]?.id || '',
        createdAt: new Date(now.getTime() - Math.floor(Math.random() * 90) * 86400000),
        updatedAt: now,
      } as any);
    }
  }

  // Seed beds
  const bedTypes = ['STANDARD', 'ICU', 'EMERGENCY', 'PRIVATE', 'ISOLATION', 'PEDIATRIC', 'MATERNITY'] as const;
  for (let hi = 0; hi < hospitalIds.length; hi++) {
    const hid = hospitalIds[hi];
    const depts = deptIdsByHospital[hid];
    let bedNum = 1;
    for (const deptId of depts.slice(0, 8)) {
      for (let i = 0; i < 8; i++) {
        const isOccupied = Math.random() > 0.4;
        const bedType = bedTypes[Math.floor(Math.random() * bedTypes.length)];
        await db.beds.add({
          number: String(bedNum),
          roomNumber: `${Math.floor((bedNum - 1) / 4) + 101}`,
          floor: String(Math.floor((bedNum - 1) / 16) + 1),
          type: bedType as any,
          status: isOccupied ? 'OCCUPIED' : (Math.random() > 0.9 ? 'MAINTENANCE' : 'AVAILABLE'),
          hospitalId: hid,
          departmentId: deptId,
          createdAt: now,
          updatedAt: now,
        } as any);
        bedNum++;
      }
    }
  }

  // Seed appointments
  const appointmentTypes = ['REGULAR', 'EMERGENCY', 'FOLLOW_UP', 'CONSULTATION', 'SURGERY', 'CHECKUP'] as const;
  const appointmentStatuses = ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

  for (let hi = 0; hi < hospitalIds.length; hi++) {
    const hid = hospitalIds[hi];
    const patients = await db.patients.where('hospitalId').equals(hid).toArray();
    const doctors = await db.users.where({ hospitalId: hid, role: 'DOCTOR' }).toArray();
    const depts = deptIdsByHospital[hid];

    for (let i = 0; i < 30; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];
      const apptDate = new Date(now.getTime() + (Math.floor(Math.random() * 14) - 7) * 86400000);
      const hours = 8 + Math.floor(Math.random() * 10);
      const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];

      await db.appointments.add({
        appointmentNo: `A-2026-${String(i + 1).padStart(5, '0')}`,
        patientId: patient.id,
        doctorId: doctor.id,
        hospitalId: hid,
        departmentId: depts[Math.floor(Math.random() * depts.length)],
        date: apptDate,
        time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
        duration: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
        type: appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)] as any,
        status: appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)] as any,
        reason: ['كشف عام', 'متابعة', 'ألم في الصدر', 'فحص دوري', 'استشارة'][Math.floor(Math.random() * 5)],
        createdAt: now,
        updatedAt: now,
      } as any);
    }
  }

  // Seed inventory items
  const invCategories = ['MEDICATION', 'MEDICAL_SUPPLY', 'EQUIPMENT', 'LAB_REAGENT', 'SURGICAL_INSTRUMENT', 'DISPOSABLE', 'VACCINE'] as const;
  const medicationNames = ['باراسيتامول', 'أموكسيسيلين', 'أيبوبروفين', 'أسبرين', 'ميتفورمين', 'أتورفاستاتين', 'أوميبرازول', 'سيتريزين', 'فنتانيل', 'ديكلوفيناك'];
  const supplyNames = ['قفازات طبية', 'كمامات جراحية', 'محاليل وريدية', 'شاش طبي', 'لاصق طبي', 'حقن', 'أنابيب مغذية'];

  for (let hi = 0; hi < hospitalIds.length; hi++) {
    const hid = hospitalIds[hi];
    for (let i = 0; i < 25; i++) {
      const isMed = Math.random() > 0.5;
      const name = isMed ? medicationNames[Math.floor(Math.random() * medicationNames.length)] : supplyNames[Math.floor(Math.random() * supplyNames.length)];
      const qty = Math.floor(Math.random() * 200) + 10;

      await db.inventoryItems.add({
        name: `${name} ${i + 1}`,
        nameEn: `${isMed ? 'Med' : 'Supply'} ${i + 1}`,
        code: `INV-${hospitalsData[hi].code}-${String(i + 1).padStart(4, '0')}`,
        category: invCategories[Math.floor(Math.random() * invCategories.length)] as any,
        hospitalId: hid,
        quantity: qty,
        minStock: 20,
        reorderPoint: 30,
        unitPrice: Math.floor(Math.random() * 100) + 5,
        unit: ['قرص', 'زجاجة', 'علبة', 'أمبولة', 'قارورة'][Math.floor(Math.random() * 5)],
        expiryDate: new Date(2026 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), 1),
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      } as any);
    }
  }

  // Seed audit logs
  await db.auditLogs.add({
    userId: 'system',
    action: 'CREATE',
    entityType: 'hospital',
    entityId: 'all',
    description: 'تم إنشاء قاعدة البيانات وإضافة 10 مستشفيات',
    createdAt: now,
  } as any);

  console.log('Database seeded successfully with', hospitalIds.length, 'hospitals');
}
