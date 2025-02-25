
import { NextResponse } from 'next/server';
import { updateCalibration } from '@/app/api/data/instrument';

export async function PUT(
  request: Request,
  { params }: { params: { instrumentId: string; calibrationId: string } }
) {
  const { instrumentId, calibrationId } = params;
  const data = await request.json();
  
  const calibration = await updateCalibration(data);
  return NextResponse.json(calibration);
}
