import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">金融データダッシュボード</h1>
          <p className="mt-2 text-muted-foreground dark:text-gray-300">アカウントにログイン</p>
        </div>
        <SignIn appearance={{
          elements: {
            formButtonPrimary: 
              "bg-primary text-primary-foreground hover:bg-primary/90",
            footerActionLink: 
              "text-primary hover:text-primary/90",
          }
        }} />
      </div>
    </div>
  );
} 