import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/projects/[id]/export/image
 * Export layout as PNG image (server-side rendering stub)
 * Note: For production, use a headless browser library like Puppeteer or Playwright
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    req.nextUrl.searchParams.get('width') || '1200';
    req.nextUrl.searchParams.get('height') || '900';

    const project = await prisma.project.findUnique({
      where: { id },
      select: { name: true, layout: true, thumbnail: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // If thumbnail exists, return it
    if (project.thumbnail) {
      const thumbnailBuffer = Buffer.from(project.thumbnail, 'base64');
      return new NextResponse(thumbnailBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${project.name.replace(
            /\s+/g,
            '_'
          )}_layout.png"`,
        },
      });
    }

    // For now, return a placeholder image
    // In production, use Puppeteer to render the 3D canvas to PNG
    const placeholderResponse = {
      message: 'Image export requires headless browser setup (Puppeteer/Playwright)',
      instructions: 'Install puppeteer and implement server-side canvas rendering',
      status: 'pending_implementation',
    };

    return NextResponse.json(placeholderResponse, { status: 202 });
  } catch (error) {
    console.error('[GET /api/projects/[id]/export/image]', error);
    return NextResponse.json({ error: 'Failed to export layout as image' }, { status: 500 });
  }
}
