"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { UserRole } from "@/lib/auth/roles";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: UserRole;
  fallback?: React.ReactNode;
}

export function RoleGuard({ 
  children, 
  allowedRole, 
  fallback = <p>このページへのアクセス権限がありません。</p> 
}: RoleGuardProps) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    
    // ここでは簡易的に判定（実際にはAPIでロールを取得する必要あり）
    // Admin向けページはロール確認、それ以外は認証だけで十分
    if (allowedRole === UserRole.ADMIN) {
      // 本来はAPIでロール確認が必要
      // ここではデモ用に簡易実装
      const checkRole = async () => {
        try {
          // 実際の環境では以下のようにAPIでロール確認
          // const response = await fetch("/api/auth/role");
          // const data = await response.json();
          // setHasAccess(data.role === allowedRole);
          
          // デモ用にViewer権限とする
          setHasAccess(false);
        } catch (error) {
          console.error("Failed to check role", error);
          setHasAccess(false);
        } finally {
          setIsChecking(false);
        }
      };
      
      checkRole();
    } else {
      // 一般ユーザー向けページはログインしていれば表示
      setHasAccess(true);
      setIsChecking(false);
    }
  }, [userId, isLoaded, router, allowedRole]);
  
  if (!isLoaded || isChecking) {
    return <div>ローディング中...</div>;
  }
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
} 