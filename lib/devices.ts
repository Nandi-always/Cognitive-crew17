import { prisma } from '@/lib/db';

/**
 * Device management helpers
 */

export async function createDevice(
  projectId: string,
  name: string,
  type: string,
  category: string,
  position: { x: number; y: number },
  roomId?: string,
  settings?: any
) {
  return prisma.device.create({
    data: {
      projectId,
      name,
      type,
      category,
      position,
      roomId,
      settings,
    },
  });
}

export async function getProjectDevices(projectId: string) {
  return prisma.device.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateDevice(deviceId: string, updates: any) {
  return prisma.device.update({
    where: { id: deviceId },
    data: updates,
  });
}

export async function deleteDevice(deviceId: string) {
  return prisma.device.delete({
    where: { id: deviceId },
  });
}

/**
 * Settings management helpers
 */

export async function getOrCreateSettings(userId: string) {
  let settings = await prisma.settings.findUnique({
    where: { userId },
  });

  if (!settings) {
    settings = await prisma.settings.create({
      data: { userId },
    });
  }

  return settings;
}

export async function updateSettings(userId: string, updates: any) {
  return prisma.settings.update({
    where: { userId },
    data: updates,
  });
}

/**
 * Language preference helpers
 */

export async function getOrCreateLanguagePreference(userId: string) {
  let pref = await prisma.languagePreference.findUnique({
    where: { userId },
  });

  if (!pref) {
    pref = await prisma.languagePreference.create({
      data: { userId },
    });
  }

  return pref;
}

export async function updateLanguagePreference(userId: string, language: string, locale?: string) {
  return prisma.languagePreference.update({
    where: { userId },
    data: { language, ...(locale && { locale }) },
  });
}
