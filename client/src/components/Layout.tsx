import { Link } from "@tanstack/react-router";
import { ReactNode } from "react"

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header>
        <div className="w-full flex justify-center mb-10 border-b">
          <nav className="flex justify-start gap-4 m-4 container">
            <Link to="/" activeProps={{ className: 'text-primary' }}>Hjem</Link>
            <Link to="/ranks" activeProps={{ className: 'text-primary' }} >Ranks</Link>
            <Link to="/rederi" activeProps={{ className: 'text-primary' }} >Rederi Kalkulator</Link>
          </nav>
        </div>
      </header>
      <div className="flex justify-center">
        <main className="container">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout;