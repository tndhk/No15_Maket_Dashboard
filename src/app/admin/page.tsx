"use client";

import { UserRole } from "@/lib/auth/roles";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPage() {
  return (
    <RoleGuard allowedRole={UserRole.ADMIN} fallback={
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-4">アクセス権限がありません</h1>
        <p className="text-muted-foreground dark:text-gray-300">
          このページは管理者専用です。アクセス権限をリクエストするには管理者に連絡してください。
        </p>
      </div>
    }>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-2">管理者ダッシュボード</h1>
        <p className="text-muted-foreground dark:text-gray-300">
          システム管理、ユーザー管理、データ管理を行うことができます。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>シンボル管理</CardTitle>
              <CardDescription>銘柄の追加・編集・削除</CardDescription>
            </CardHeader>
            <CardContent>
              <p>システムに登録されている銘柄の管理を行います。</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/admin/symbols">管理画面を開く</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>ユーザー管理</CardTitle>
              <CardDescription>ユーザーの権限設定と管理</CardDescription>
            </CardHeader>
            <CardContent>
              <p>システム利用者の権限設定やアカウント管理を行います。</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">管理画面を開く</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>ログ確認</CardTitle>
              <CardDescription>システムログとAPI履歴</CardDescription>
            </CardHeader>
            <CardContent>
              <p>システムのアクティビティログやAPI呼び出し履歴を確認できます。</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/admin/logs">管理画面を開く</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>一括操作</CardTitle>
              <CardDescription>一括操作の管理</CardDescription>
            </CardHeader>
            <CardContent>
              <p>システムの一括操作を管理します。</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/admin/bulk-actions">管理画面を開く</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </RoleGuard>
  );
} 