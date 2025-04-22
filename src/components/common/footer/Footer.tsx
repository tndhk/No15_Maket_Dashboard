import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("w-full bg-muted py-6 px-6", className)}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex flex-col items-start gap-2">
              <p className="text-sm text-muted-foreground dark:text-gray-300">
                © 2023 金融データトラッキングダッシュボード
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2">
            <a href="#" className="text-sm text-muted-foreground dark:text-gray-300 hover:text-foreground transition-colors">
              プライバシーポリシー
            </a>
            <a href="#" className="text-sm text-muted-foreground dark:text-gray-300 hover:text-foreground transition-colors">
              利用規約
            </a>
            <a href="#" className="text-sm text-muted-foreground dark:text-gray-300 hover:text-foreground transition-colors">
              お問い合わせ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 