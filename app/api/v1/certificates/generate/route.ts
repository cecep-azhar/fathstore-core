import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { getAuthUser } from '@/lib/auth-helpers'

// POST /api/v1/certificates/generate — Generate course completion certificate
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', data: null }, { status: 401 })
    }

    const body = await req.json()
    const { userName, courseName, date, enrollmentId } = body

    if (!userName || !courseName) {
      return NextResponse.json(
        { error: 'Missing required parameters: userName, courseName' },
        { status: 400 }
      )
    }

    const issueDate = date || new Date().toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Create PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([842, 595]) // A4 Landscape
    const { width, height } = page.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const textFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Gold border
    page.drawRectangle({
      x: 20, y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: rgb(0.83, 0.68, 0.21),
      borderWidth: 5,
    })

    // Title
    const title = 'SERTIFIKAT KELULUSAN'
    const titleWidth = font.widthOfTextAtSize(title, 40)
    page.drawText(title, {
      x: (width - titleWidth) / 2,
      y: height - 100,
      size: 40,
      font,
      color: rgb(0, 0.42, 0.24),
    })

    // Subtitle
    const subtitle = 'Diberikan kepada:'
    const subtitleWidth = textFont.widthOfTextAtSize(subtitle, 20)
    page.drawText(subtitle, {
      x: (width - subtitleWidth) / 2,
      y: height - 180,
      size: 20,
      font: textFont,
      color: rgb(0, 0, 0),
    })

    // Name
    const nameWidth = font.widthOfTextAtSize(userName, 35)
    page.drawText(userName, {
      x: (width - nameWidth) / 2,
      y: height - 230,
      size: 35,
      font,
      color: rgb(0.83, 0.68, 0.21),
    })

    // Context
    const context = 'Telah menyelesaikan materi pembelajaran:'
    const contextWidth = textFont.widthOfTextAtSize(context, 20)
    page.drawText(context, {
      x: (width - contextWidth) / 2,
      y: height - 300,
      size: 20,
      font: textFont,
      color: rgb(0, 0, 0),
    })

    // Course name
    const courseWidth = font.widthOfTextAtSize(courseName, 30)
    page.drawText(courseName, {
      x: (width - courseWidth) / 2,
      y: height - 350,
      size: 30,
      font,
      color: rgb(0, 0, 0),
    })

    // Date
    const dateText = `Pada Tanggal: ${issueDate}`
    const dateWidth = textFont.widthOfTextAtSize(dateText, 15)
    page.drawText(dateText, {
      x: (width - dateWidth) / 2,
      y: height - 420,
      size: 15,
      font: textFont,
      color: rgb(0.4, 0.4, 0.4),
    })

    // Footer
    const footerText = 'FathStore — fathstore.my.id'
    const footerWidth = textFont.widthOfTextAtSize(footerText, 12)
    page.drawText(footerText, {
      x: (width - footerWidth) / 2,
      y: 50,
      size: 12,
      font: textFont,
      color: rgb(0.6, 0.6, 0.6),
    })

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Sertifikat-${encodeURIComponent(userName)}.pdf"`,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate certificate'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}