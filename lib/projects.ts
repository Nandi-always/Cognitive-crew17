import { prisma } from '@/lib/db';
import type { Session } from 'next-auth';
import type { User } from '@prisma/client';

export async function createProject(
  userId: string,
  name: string,
  area: number,
  bhk: number,
  style: string
) {
  return prisma.project.create({
    data: {
      userId,
      name,
      area,
      bhk,
      style,
      layout: {
        rooms: [],
        walls: [],
        furniture: [],
      },
    },
  });
}

export async function getUserProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateProjectLayout(projectId: string, layout: any) {
  return prisma.project.update({
    where: { id: projectId },
    data: { layout },
  });
}

export async function deleteProject(projectId: string) {
  return prisma.project.delete({
    where: { id: projectId },
  });
}
