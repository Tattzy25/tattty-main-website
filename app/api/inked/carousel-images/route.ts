import { list } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

/**
 * GET /api/inked/carousel-images?row=1
 * Fetches images from Vercel Blob for a specific carousel row
 * Row 1: Style, Row 2: Color, Row 3: Size, Row 4: Placement
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const row = searchParams.get('row')

    if (!row || !['1', '2', '3', '4'].includes(row)) {
      return NextResponse.json(
        { error: 'Invalid row parameter. Must be 1, 2, 3, or 4' },
        { status: 400 }
      )
    }

    // Map row numbers to folder names
    const folderMap: Record<string, string> = {
      '1': 'row_1_style_inkd',
      '2': 'row_2_color_inkd',
      '3': 'row_3_size_inkd',
      '4': 'row_4_placement_inkd'
    }

    const folderPrefix = folderMap[row]

    // Fetch blobs from Vercel Blob storage
    const { blobs } = await list({
      prefix: `${folderPrefix}/`,
      limit: 1000 // Adjust if you have more images
    })

    // Filter out only image files and format the response
    const images = blobs
      .filter(blob => {
        // Check if pathname contains common image extensions
        const pathname = blob.pathname.toLowerCase()
        return pathname.endsWith('.jpg') || 
               pathname.endsWith('.jpeg') || 
               pathname.endsWith('.png') || 
               pathname.endsWith('.webp') || 
               pathname.endsWith('.gif')
      })
      .map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt
      }))

    return NextResponse.json({
      success: true,
      row: parseInt(row),
      count: images.length,
      images
    })

  } catch (error) {
    console.error('Error fetching carousel images:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch images from storage',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
