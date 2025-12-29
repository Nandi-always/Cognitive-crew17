import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/projects/[id]/devices
 * Get all devices in a project
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const devices = await prisma.device.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(devices, { status: 200 });
  } catch (error) {
    console.error('[GET /api/projects/[id]/devices]', error);
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
  }
}

/**
 * POST /api/projects/[id]/devices
 * Create a new device in project
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, type, category, position, roomId, settings } = body;

    if (!name || !type || !category || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const device = await prisma.device.create({
      data: {
        projectId: id,
        name,
        type,
        category,
        position,
        roomId,
        settings,
      },
    });

    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    console.error('[POST /api/projects/[id]/devices]', error);
    return NextResponse.json({ error: 'Failed to create device' }, { status: 500 });
  }
}
