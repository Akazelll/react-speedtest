import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Konfigurasi Server Dummy (Info Server)
const SERVER_INFO = {
  id: 101,
  name: "NextJS Speed Node",
  sponsor: "Vercel ID SG1",
  location: "Singapore",
  country: "Singapore",
  host: "speedtest.yourdomain.com:8080",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  // 1. Endpoint untuk Info Server
  if (type === "server") {
    return NextResponse.json(SERVER_INFO);
  }

  // 2. Endpoint untuk Download Test
  // User meminta 40MB data dummy
  if (type === "download") {
    const sizeInMB = 40;
    const sizeInBytes = sizeInMB * 1024 * 1024;

    // Kita buat buffer kosong (cepat)
    const buffer = new Uint8Array(sizeInBytes);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.json({ error: "Invalid type" });
}

export async function POST(request: Request) {
  // 3. Endpoint untuk Upload Test
  // Menerima data dari client untuk menghitung durasi upload
  // Kita baca body-nya tapi tidak disimpan agar hemat memori
  const blob = await request.blob();

  return NextResponse.json({
    received: blob.size,
    timestamp: Date.now(),
  });
}
