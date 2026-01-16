import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req, { params }) {
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
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // Return placeholder image
    return new NextResponse('PNG Placeholder', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('[GET /api/projects/[id]/export/image]', error);
    return NextResponse.json({ error: 'Failed to export image' }, { status: 500 });
  }
}
