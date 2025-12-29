import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { exportLayoutAsJSON } from '@/lib/export';

/**
 * GET /api/projects/[id]/export/json
 * Export layout and project data as JSON
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      select: { name: true, layout: true, scores: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const jsonBlob = await exportLayoutAsJSON(project.name, project.layout, project.scores);

    return new NextResponse(jsonBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${project.name.replace(
          /\s+/g,
          '_'
        )}_layout.json"`,
      },
    });
  } catch (error) {
    console.error('[GET /api/projects/[id]/export/json]', error);
    return NextResponse.json({ error: 'Failed to export layout as JSON' }, { status: 500 });
  }
}
