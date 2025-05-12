import Image from "next/image"

export function Header() {
  return (
    <header className="flex flex-col items-center justify-center py-3 sm:py-4 animate-fade-in">
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 relative mb-2 sm:mb-4 animate-float">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D7%94%D7%95%D7%A8%D7%93%D7%94-ISagQqBniHe0TvLCMHtFaCIE8Mmqwz.png"
          alt="לוגו איחוד הצלה"
          fill
          className="object-contain"
        />
      </div>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center gradient-text">מערכת הזמנת ציוד</h1>
      <p className="text-sm sm:text-base md:text-lg text-center text-muted-foreground mt-1 sm:mt-2">
        הזמנת ציוד למתנדבי איחוד הצלה
      </p>
    </header>
  )
}
