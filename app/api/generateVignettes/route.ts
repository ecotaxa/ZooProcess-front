// import path from 'path';
// import fs from 'fs/promises';
// import sharp from 'sharp';
// console.log(sharp.name);

// export async function GET(req: NextRequest) {
//   const scan = req.nextUrl.searchParams.get('scan');
//   const folder = req.nextUrl.searchParams.get('folder');

//   console.log('🧪 Params received:', { scan, folder });

//   if (!scan?.trim() || !folder?.trim()) {
//     return NextResponse.json({ error: 'Missing or invalid scan or folder' }, { status: 400 });
//   }

//   try {
//     const publicRoot = path.resolve(process.cwd(), 'public');
//     const cleanFolder = folder.replace(/^\/+/g, '');
//     const folderPath = path.resolve(publicRoot, cleanFolder);
//     const scanPath = path.join(folderPath, scan);

//     console.log('📂 Generating vignettes from:', scanPath);

//     const image = sharp(scanPath);
//     const metadata = await image.metadata();

//     const width = metadata.width || 0;
//     const height = metadata.height || 0;
//     const vignetteSize = 100;

//     const vignettes: string[] = [];

//     for (let y = 0; y < height; y += vignetteSize) {
//       for (let x = 0; x < width; x += vignetteSize) {
//         const filename = `${path.parse(scan).name}_vignette_${x}_${y}.jpg`;
//         const outputPath = path.join(folderPath, filename);

//         await image
//           .extract({ left: x, top: y, width: Math.min(vignetteSize, width - x), height: Math.min(vignetteSize, height - y) })
//           .toFile(outputPath);

//         vignettes.push(filename);
//       }
//     }

//     return NextResponse.json(vignettes);
//   } catch (err) {
//     console.error('❌ Error in /api/generateVignettes:', err);
//     return NextResponse.json({ error: 'Failed to generate vignettes' }, { status: 500 });
//   }
// }
