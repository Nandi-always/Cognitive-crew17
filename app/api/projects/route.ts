import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * POST /api/projects
 * Create a new project for the user
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, area, bhk, style } = body;

    if (!userId || !name || !area || !bhk || !style) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, name, area, bhk, style' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        userId,
        name,
        area: parseInt(area),
        bhk: parseInt(bhk),
        style,
        layout: {
          rooms: [],
          walls: [],
          furniture: [],
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('[POST /api/projects]', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

/**
 * GET /api/projects?userId=<id>
 * Get all projects for a user
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId query parameter' }, { status: 400 });
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('[GET /api/projects]', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
