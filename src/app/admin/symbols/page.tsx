"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/lib/auth/roles";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { symbolCategoryEnum } from "@/lib/validations/symbol";
import { getSymbols, deleteSymbol } from "@/lib/dal/symbols";
import { toast } from "sonner";
import { ArrowLeft, PlusCircle, RefreshCcw, Search, Trash, Edit } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

export default function AdminSymbolsPage() {
  const router = useRouter();
  const [symbols, setSymbols] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // フィルター状態
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  
  // 削除確認用の状態
  const [symbolToDelete, setSymbolToDelete] = useState<any>(null);

  // 初期データの取得
  useEffect(() => {
    fetchSymbols();
  }, []);

  // シンボルデータを取得
  async function fetchSymbols() {
    setIsLoading(true);
    try {
      const result = await getSymbols({
        search: search || undefined,
        category: category as any || undefined,
        isActive: showInactive ? undefined : true,
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

  // 検索実行
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchSymbols();
  }

  // シンボル削除
  async function handleDeleteSymbol() {
    if (!symbolToDelete) return;
    
    try {
      await deleteSymbol(symbolToDelete.id);
      toast.success(`シンボル ${symbolToDelete.symbol} を削除しました`);
      fetchSymbols(); // リストを更新
      setSymbolToDelete(null); // 削除ダイアログを閉じる
    } catch (error) {
      console.error("Error deleting symbol:", error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "シンボルの削除に失敗しました"
      );
    }
  }

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
              <h1 className="text-3xl font-bold tracking-tight">シンボル管理</h1>
              <p className="text-muted-foreground mt-1">
                登録されているシンボル（銘柄）の管理
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => fetchSymbols()}
              disabled={isRefreshing}
            >
              <RefreshCcw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              更新
            </Button>

            <Button asChild size="sm" className="h-8">
              <Link href="/symbols/create">
                <PlusCircle className="h-4 w-4 mr-2" />
                新規作成
              </Link>
            </Button>
          </div>
        </div>

        {/* フィルター */}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="銘柄コードまたは名前で検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
              <Button type="submit" variant="secondary" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">カテゴリ:</Label>
            <Select 
              value={category || ""} 
              onValueChange={(value) => setCategory(value === "" ? null : value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="すべて" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">すべて</SelectItem>
                {Object.values(symbolCategoryEnum.enum).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox 
              id="showInactive" 
              checked={showInactive}
              onCheckedChange={(checked) => setShowInactive(!!checked)}
            />
            <Label htmlFor="showInactive" className="text-sm">
              無効なシンボルも表示
            </Label>
          </div>
        </div>

        {/* シンボル一覧 */}
        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">銘柄コード</th>
                  <th className="px-4 py-3 text-left">銘柄名</th>
                  <th className="px-4 py-3 text-left">カテゴリ</th>
                  <th className="px-4 py-3 text-left">データ数</th>
                  <th className="px-4 py-3 text-left">ステータス</th>
                  <th className="px-4 py-3 text-center">アクション</th>
                </tr>
              </thead>
              <tbody className={isLoading ? "opacity-50" : ""}>
                {symbols.length > 0 ? (
                  symbols.map((symbol) => (
                    <tr
                      key={symbol.id}
                      className="border-t hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/symbols/${symbol.id}`} className="text-primary hover:underline">
                          {symbol.symbol}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{symbol.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryClass(symbol.category)}`}>
                          {getCategoryLabel(symbol.category)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{symbol._count?.prices || 0}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          symbol.isActive 
                            ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300" 
                            : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300"
                        }`}>
                          {symbol.isActive ? "有効" : "無効"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-1">
                          <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Link href={`/symbols/${symbol.id}/edit`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">編集</span>
                            </Link>
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-destructive"
                                onClick={() => setSymbolToDelete(symbol)}
                                disabled={symbol._count?.prices > 0}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">削除</span>
                              </Button>
                            </AlertDialogTrigger>
                            {symbolToDelete && (
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>シンボルの削除</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {`${symbolToDelete.symbol} (${symbolToDelete.name}) を削除してもよろしいですか？`}
                                    <br />
                                    {symbolToDelete._count?.prices > 0 && (
                                      <span className="text-destructive font-medium block mt-2">
                                        このシンボルには価格データが関連付けられているため削除できません。
                                      </span>
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setSymbolToDelete(null)}>
                                    キャンセル
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteSymbol}
                                    disabled={symbolToDelete._count?.prices > 0}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    削除
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            )}
                          </AlertDialog>
                        </div>
                      </td>
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

        {/* ページネーションは簡略化のため省略 */}
      </div>
    </RoleGuard>
  );
} 