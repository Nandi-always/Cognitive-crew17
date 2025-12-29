import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/projects/[id]/export/pdf
 * Export layout as PDF with room details and scores
 * Note: Requires implementation of server-side PDF generation
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const title = req.nextUrl.searchParams.get('title') || 'Layout Export';

    const project = await prisma.project.findUnique({
      where: { id },
      select: { name: true, layout: true, scores: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // For production, use a server-side PDF library like pdfkit or puppeteer
    // This is a JSON response with export data that can be processed by the client
    const pdfData = {
      title: title || project.name,
      project: {
        name: project.name,
        layout: project.layout,
        scores: project.scores,
      },
      exportedAt: new Date().toISOString(),
    };

    // Return as downloadable JSON (client can convert to PDF using jsPDF)
    return new NextResponse(JSON.stringify(pdfData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${project.name.replace(
          /\s+/g,
          '_'
        )}_layout.pdf.json"`,
      },
    });
  } catch (error) {
    console.error('[GET /api/projects/[id]/export/pdf]', error);
    return NextResponse.json({ error: 'Failed to export layout as PDF' }, { status: 500 });
  }
}
