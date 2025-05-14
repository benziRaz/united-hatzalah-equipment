import { ImageResponse } from "next/og"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt = "איחוד הצלה - הזמנת ציוד"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  // לוגו איחוד הצלה - URL מהבלוב
  const logoUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D7%94%D7%95%D7%A8%D7%93%D7%94-ISagQqBniHe0TvLCMHtFaCIE8Mmqwz.png"

  try {
    // פונקציה לטעינת התמונה
    const imageData = await fetch(logoUrl).then((res) => res.arrayBuffer())

    return new ImageResponse(
      <div
        style={{
          fontSize: 48,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <img
            src={logoUrl || "/placeholder.svg"}
            width={250}
            height={250}
            alt="לוגו איחוד הצלה"
            style={{ objectFit: "contain" }}
          />
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: "bold",
            color: "#ff6600",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          איחוד הצלה
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#333",
            textAlign: "center",
          }}
        >
          מערכת הזמנת ציוד למתנדבים
        </div>
      </div>,
      {
        ...size,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    // תמונה חלופית במקרה של שגיאה
    return new ImageResponse(
      <div
        style={{
          fontSize: 48,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ff6600",
        }}
      >
        איחוד הצלה - הזמנת ציוד
      </div>,
      {
        ...size,
      },
    )
  }
}
