import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateLayoutScore } from '@/lib/ai-layout';

/**
 * GET /api/projects/[id]/layout
 * Get the layout for a project
 */
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      select: { layout: true, variants: true, scores: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        layout: project.layout,
        variants: project.variants,
        scores: project.scores,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/projects/[id]/layout]', error);
    return NextResponse.json({ error: 'Failed to fetch layout' }, { status: 500 });
  }
}

/**
 * PUT /api/projects/[id]/layout
 * Save/update layout and optionally compute scores
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { layout, computeScore = false } = body;

    if (!layout) {
      return NextResponse.json({ error: 'Missing layout data' }, { status: 400 });
    }

    let scores = null;

    // Optionally compute layout score using AI utilities
    if (computeScore && layout.rooms && layout.furniture) {
      const project = await prisma.project.findUnique({
        where: { id },
        select: { area: true },
      });

      if (project) {
        scores = calculateLayoutScore(layout.rooms, layout.furniture, project.area);
      }
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        layout: typeof layout === 'string' ? layout : JSON.stringify(layout),
        ...(scores && { scores: typeof scores === 'string' ? scores : JSON.stringify(scores) }),
      },
      select: { layout: true, variants: true, scores: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('[PUT /api/projects/[id]/layout]', error);
    return NextResponse.json({ error: 'Failed to save layout' }, { status: 500 });
  }
}
