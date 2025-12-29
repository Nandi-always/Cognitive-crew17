import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/projects/[id]
 * Get a single project by ID
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error('[GET /api/projects/[id]]', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

/**
 * PUT /api/projects/[id]
 * Update project (name, style, area, bhk, or layout)
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, style, area, bhk, layout, variants, scores } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (style) updateData.style = style;
    if (area) updateData.area = parseInt(area);
    if (bhk) updateData.bhk = parseInt(bhk);
    if (layout !== undefined) updateData.layout = layout;
    if (variants !== undefined) updateData.variants = variants;
    if (scores !== undefined) updateData.scores = scores;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error('[PUT /api/projects/[id]]', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete a project
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const project = await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error('[DELETE /api/projects/[id]]', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
