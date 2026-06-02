import { db } from './database';

export async function seedZones() {
  const allUsers = await db.users.toArray();
  const needsZone = allUsers.filter(u => !u.zoneId && u.role !== 'SUPER_ADMIN');
  if (needsZone.length === 0) return;

  for (let i = 0; i < needsZone.length; i++) {
    const zoneNum = (i % 3) + 1;
    await db.users.update(needsZone[i].id, { zoneId: String(zoneNum) });
  }

  console.log('Assigned zones to', needsZone.length, 'users');
}
