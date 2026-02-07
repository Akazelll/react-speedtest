import { NextResponse } from "next/server";

// Wajib dynamic agar tidak dicache
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Kita kirim chunk data 1MB-an per request
  // Client akan melakukan loop request ini berkali-kali sampai waktu habis
  const sizeInBytes = 1 * 1024 * 1024; // 1 MB

  const buffer = new Uint8Array(sizeInBytes);
  // Isi sedikit data random agar tidak dikompresi browser
  buffer[0] = Math.floor(Math.random() * 255);
  buffer[sizeInBytes - 1] = Math.floor(Math.random() * 255);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

export async function POST(request: Request) {
  // Logic Upload: Baca stream body sampai habis
  try {
    const reader = request.body?.getReader();
    if (reader) {
      while (true) {
        const { done } = await reader.read();
        if (done) break;
      }
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
