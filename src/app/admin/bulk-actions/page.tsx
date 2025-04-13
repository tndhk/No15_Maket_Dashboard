"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, RefreshCcw, Check, X } from "lucide-react";
import { UserRole } from "@/lib/auth/roles";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getSymbols } from "@/lib/dal/symbols";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function BulkActionsPage() {
  const router = useRouter();
  const [symbols, setSymbols] = useState<any[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [action, setAction] = useState<string>("status");
  const [statusValue, setStatusValue] = useState<string>("true");
  const [categoryValue, setCategoryValue] = useState<string>("stock");
  
  // 初期データ取得
  useEffect(() => {
    fetchSymbols();
  }, []);

  // シンボルデータを取得
  async function fetchSymbols() {
    setIsLoading(true);
    try {
      const result = await getSymbols({
        page: 1,
        limit: 100 // 管理画面では多めに表示
      });
      setSymbols(result.items);
    } catch (error) {
      console.error("Error fetching symbols:", error);
      toast.error("シンボルデータの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  // 全選択/全解除
  const toggleSelectAll = () => {
    if (selectedSymbols.length === symbols.length) {
      setSelectedSymbols([]);
    } else {
      setSelectedSymbols(symbols.map(s => s.id));
    }
  };

  // 個別選択/解除
  const toggleSymbol = (id: number) => {
    if (selectedSymbols.includes(id)) {
      setSelectedSymbols(selectedSymbols.filter(sid => sid !== id));
    } else {
      setSelectedSymbols([...selectedSymbols, id]);
    }
  };

  // カテゴリに基づいたラベルを取得する関数
  function getCategoryLabel(category: string): string {
    switch (category) {
      case "stock": return "株式";
      case "crypto": return "仮想通貨";
      case "forex": return "為替";
      case "index": return "指数";
      case "other": return "その他";
      default: return category;
    }
  }

  // カテゴリに基づいたクラスを取得する関数
  function getCategoryClass(category: string): string {
    switch (category) {
      case "stock": return "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300";
      case "crypto": return "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300";
      case "forex": return "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300";
      case "index": return "bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-300";
      case "other": return "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300";
    }
  }

  // 一括操作を実行
  const executeAction = async () => {
    if (selectedSymbols.length === 0) {
      toast.error("シンボルが選択されていません");
      return;
    }

    setIsProcessing(true);
    
    try {
      // 選択した操作に基づく処理
      switch (action) {
        case "status":
          await updateSymbolsStatus();
          break;
        case "category":
          await updateSymbolsCategory();
          break;
        default:
          toast.error("無効な操作です");
      }
      
      // 操作成功後、シンボルリストを更新
      fetchSymbols();
      // 選択をクリア
      setSelectedSymbols([]);
      
    } catch (error) {
      console.error("Error executing bulk action:", error);
      toast.error("一括操作の実行に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  // ステータス一括更新
  const updateSymbolsStatus = async () => {
    try {
      // APIエンドポイントが存在すると仮定
      const response = await fetch("/api/admin/symbols/bulk-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedSymbols,
          action: "status",
          value: statusValue === "true",
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      toast.success(`${selectedSymbols.length}件のシンボルのステータスを更新しました`);
    } catch (error) {
      console.error("Error updating symbols status:", error);
      throw error;
    }
  };

  // カテゴリ一括更新
  const updateSymbolsCategory = async () => {
    try {
      // APIエンドポイントが存在すると仮定
      const response = await fetch("/api/admin/symbols/bulk-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedSymbols,
          action: "category",
          value: categoryValue,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      toast.success(`${selectedSymbols.length}件のシンボルのカテゴリを更新しました`);
    } catch (error) {
      console.error("Error updating symbols category:", error);
      throw error;
    }
  };

  return (
    <RoleGuard allowedRole={UserRole.ADMIN} fallback={
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-4">アクセス権限がありません</h1>
        <p className="text-muted-foreground">
          このページは管理者専用です。アクセス権限をリクエストするには管理者に連絡してください。
        </p>
      </div>
    }>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">一括操作</h1>
              <p className="text-muted-foreground mt-1">
                複数のシンボルを一度に操作
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => fetchSymbols()}
              disabled={isLoading}
            >
              <RefreshCcw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              更新
            </Button>
          </div>
        </div>

        {/* 操作設定 */}
        <Card>
          <CardHeader>
            <CardTitle>操作設定</CardTitle>
            <CardDescription>実行する操作とパラメータを設定</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="action">実行する操作</Label>
                <Select 
                  value={action} 
                  onValueChange={setAction}
                >
                  <SelectTrigger id="action" className="w-full">
                    <SelectValue placeholder="操作を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">有効/無効の一括更新</SelectItem>
                    <SelectItem value="category">カテゴリの一括更新</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {action === "status" && (
                <div>
                  <Label htmlFor="status">設定値</Label>
                  <Select 
                    value={statusValue} 
                    onValueChange={setStatusValue}
                  >
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="ステータスを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">有効</SelectItem>
                      <SelectItem value="false">無効</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {action === "category" && (
                <div>
                  <Label htmlFor="category">カテゴリ</Label>
                  <Select 
                    value={categoryValue} 
                    onValueChange={setCategoryValue}
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">株式</SelectItem>
                      <SelectItem value="crypto">仮想通貨</SelectItem>
                      <SelectItem value="forex">為替</SelectItem>
                      <SelectItem value="index">指数</SelectItem>
                      <SelectItem value="other">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label>選択中: {selectedSymbols.length} 件</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={toggleSelectAll}
              disabled={symbols.length === 0 || isProcessing}
            >
              {selectedSymbols.length === symbols.length ? "全選択解除" : "全選択"}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  disabled={selectedSymbols.length === 0 || isProcessing}
                >
                  {isProcessing ? "処理中..." : "選択した操作を実行"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>操作の確認</AlertDialogTitle>
                  <AlertDialogDescription>
                    {action === "status" ? (
                      `選択した${selectedSymbols.length}件のシンボルのステータスを「${statusValue === "true" ? "有効" : "無効"}」に変更します。`
                    ) : action === "category" ? (
                      `選択した${selectedSymbols.length}件のシンボルのカテゴリを「${getCategoryLabel(categoryValue)}」に変更します。`
                    ) : (
                      "選択した操作を実行しますか？"
                    )}
                    この操作は一括で行われます。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={executeAction}
                    disabled={isProcessing}
                  >
                    実行する
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
        
        {/* シンボル一覧 */}
        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left w-12">
                    <Checkbox 
                      checked={selectedSymbols.length === symbols.length && symbols.length > 0}
                      onCheckedChange={toggleSelectAll}
                      disabled={symbols.length === 0}
                    />
                  </th>
                  <th className="px-4 py-3 text-left">銘柄コード</th>
                  <th className="px-4 py-3 text-left">銘柄名</th>
                  <th className="px-4 py-3 text-left">カテゴリ</th>
                  <th className="px-4 py-3 text-left">ステータス</th>
                  <th className="px-4 py-3 text-left">データ数</th>
                </tr>
              </thead>
              <tbody className={isLoading ? "opacity-50" : ""}>
                {symbols.length > 0 ? (
                  symbols.map((symbol) => (
                    <tr
                      key={symbol.id}
                      className="border-t hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Checkbox 
                          checked={selectedSymbols.includes(symbol.id)}
                          onCheckedChange={() => toggleSymbol(symbol.id)}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {symbol.symbol}
                      </td>
                      <td className="px-4 py-3">{symbol.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryClass(symbol.category)}`}>
                          {getCategoryLabel(symbol.category)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          symbol.isActive 
                            ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300" 
                            : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300"
                        }`}>
                          {symbol.isActive ? (
                            <span className="flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              有効
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <X className="h-3 w-3" />
                              無効
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">{symbol._count?.prices || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      {isLoading 
                        ? "読み込み中..." 
                        : "条件に一致するシンボルがありません"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
} 