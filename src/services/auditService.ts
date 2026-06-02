import { db } from '@/db/database';
import type { AuditAction } from '@/types';

export async function auditLog(
  userId: string,
  action: AuditAction,
  entityType: string,
  entityId: string,
  description: string,
  options?: {
    oldValue?: string;
    newValue?: string;
    hospitalId?: string;
  }
): Promise<void> {
  try {
    await db.auditLogs.add({
      userId,
      action,
      entityType,
      entityId,
      description,
      oldValue: options?.oldValue,
      newValue: options?.newValue,
      hospitalId: options?.hospitalId,
      createdAt: new Date(),
    } as any);
  } catch (err) {
    console.error('Audit log failed:', err);
  }
}

export async function getRecentAuditLogs(limit = 50, hospitalId?: string) {
  let collection = db.auditLogs.orderBy('createdAt').reverse();
  if (hospitalId) {
    collection = db.auditLogs.where('hospitalId').equals(hospitalId).reverse();
  }
  return collection.limit(limit).toArray();
}
