import { Download, Github } from "lucide-react";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            Fast<span className="text-primary">Load</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
