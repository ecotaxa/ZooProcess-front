import axiosInstance from '@/app/api/network/axiosInstance';

// Relay calls to backend endpoints, for serving images and avoiding CORS countermeasures
export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Get the path parameter
    const pathSegments = params.path || [];
    const pathString = pathSegments.join('/');

    // Get query parameters if needed
    const searchParams = req.nextUrl.searchParams;
    const queryString = searchParams.toString();

    // Create axios instance
    const api = await axiosInstance({});

    // Make request to backend
    const url = `/${pathString}${queryString ? `?${queryString}` : ''}`;

    // Request image as binary data
    const response = await api.get(url, { responseType: 'arraybuffer' });

    // Get content type from response headers
    const contentType = response.headers['content-type'] || 'text/plain';
    const cacheControl = response.headers['Cache-Control']?.toString() || '';

    // Return the image data with the appropriate content type
    return new NextResponse(response.data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
      },
    });
  } catch (error: any) {
    console.error(`Error in /api/vignette/[...path]:`, error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch vignette data' },
      { status: error.response?.status || 500 }
    );
  }
}
