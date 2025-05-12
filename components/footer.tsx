import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-8 py-4 border-t text-center text-sm text-muted-foreground animate-fade-in">
      <div className="max-w-6xl mx-auto px-4">
        <p>
          המערכת נבנתה ע"י{" "}
          <Link
            href="https://tektek.co.il/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            טק טק
          </Link>
        </p>
      </div>
    </footer>
  )
}
