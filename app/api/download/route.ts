import { NextResponse } from "next/server";

// Kita set runtime ke 'edge' atau 'nodejs'
// 'edge' lebih cepat untuk streaming, tapi 'nodejs' lebih kompatibel untuk buffer besar standar.
export const dynamic = "force-dynamic";

export async function GET() {
  // Kita akan men-generate buffer kosong sebesar 5MB (5 * 1024 * 1024 bytes)
  // Ukuran ini cukup untuk tes standar.
  const sizeInBytes = 5 * 1024 * 1024;

  // Membuat buffer (array of bytes)
  const buffer = new Uint8Array(sizeInBytes);

  // Return response dengan header yang sesuai agar tidak di-cache browser secara agresif
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Content-Length": sizeInBytes.toString(),
    },
  });
}
