import { prisma } from '@/lib/db';

export async function createProject(userId, name, area, bhk, style) {
  return prisma.project.create({
    data: {
      userId,
      name,
      area,
      bhk,
      style,
      layout: JSON.stringify({
        rooms: [],
        walls: [],
        furniture: [],
      }),
    },
  });
}

export async function getUserProjects(userId) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateProjectLayout(projectId, layout) {
  return prisma.project.update({
    where: { id: projectId },
    data: { layout },
  });
}

export async function deleteProject(projectId) {
  return prisma.project.delete({
    where: { id: projectId },
  });
}

export async function getProject(projectId) {
  return prisma.project.findUnique({
    where: { id: projectId },
  });
}
