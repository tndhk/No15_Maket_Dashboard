import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // パブリックルートの設定
  publicRoutes: ["/", "/components"],
  
  // ログインが必要なルート
  ignoredRoutes: ["/api/webhooks(.*)"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 