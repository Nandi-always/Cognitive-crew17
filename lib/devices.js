import { prisma } from '@/lib/db';

export async function createDevice(projectId, name, type, category, position, roomId, settings) {
  return prisma.device.create({
    data: {
      projectId,
      name,
      type,
      category,
      position: typeof position === 'string' ? position : JSON.stringify(position),
      roomId,
      settings:
        typeof settings === 'string' || settings === undefined
          ? settings
          : JSON.stringify(settings),
    },
  });
}

export async function getProjectDevices(projectId) {
  return prisma.device.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateDevice(deviceId, updates) {
  return prisma.device.update({
    where: { id: deviceId },
    data: {
      ...updates,
      ...(updates.position && {
        position:
          typeof updates.position === 'string'
            ? updates.position
            : JSON.stringify(updates.position),
      }),
      ...(updates.settings && {
        settings:
          typeof updates.settings === 'string'
            ? updates.settings
            : JSON.stringify(updates.settings),
      }),
    },
  });
}

export async function deleteDevice(deviceId) {
  return prisma.device.delete({
    where: { id: deviceId },
  });
}

export async function getOrCreateSettings(userId) {
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

export async function updateSettings(userId, updates) {
  return prisma.settings.update({
    where: { userId },
    data: updates,
  });
}

export async function getOrCreateLanguagePreference(userId) {
  let pref = await prisma.languagePreference.findUnique({
    where: { userId },
  });

  if (!pref) {
    pref = await prisma.languagePreference.create({
      data: { userId, language: 'en' },
    });
  }

  return pref;
}

export async function updateLanguagePreference(userId, language) {
  return prisma.languagePreference.update({
    where: { userId },
    data: { language },
  });
}
