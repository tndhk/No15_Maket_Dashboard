"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, RefreshCcw, Search, Trash } from "lucide-react";
import { UserRole } from "@/lib/auth/roles";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { getApiLogs, clearApiLogs } from "@/lib/dal/logs";

// 日付範囲フィルタースキーマ
const filterSchema = z.object({
  endpoint: z.string().optional(),
  status: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

export default function AdminLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isClearingLogs, setIsClearingLogs] = useState(false);
  
  // フォーム設定
  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      endpoint: "",
      status: "",
    },
  });

  // 初期データ取得
  useEffect(() => {
    fetchLogs();
  }, []);

  // ログデータを取得
  async function fetchLogs(values?: FilterValues) {
    setIsLoading(true);
    try {
      // フィルター値を構築
      const filter = {
        endpoint: values?.endpoint || form.getValues().endpoint || undefined,
        status: values?.status || form.getValues().status || undefined,
        startDate: values?.startDate || form.getValues().startDate,
        endDate: values?.endDate || form.getValues().endDate,
        page: 1,
        limit: 100,
      };
      
      const result = await getApiLogs(filter);
      setLogs(result.items);
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("ログデータの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  // フォーム送信処理
  const onSubmit = async (values: FilterValues) => {
    await fetchLogs(values);
  };

  // ログをクリア（30日以上前のログを削除）
  const handleClearLogs = async () => {
    setIsClearingLogs(true);
    try {
      const result = await clearApiLogs();
      toast.success(`古いログが削除されました (${result.deletedCount}件)`);
      fetchLogs(); // リストを更新
    } catch (error) {
      console.error("Error clearing logs:", error);
      toast.error("ログのクリアに失敗しました");
    } finally {
      setIsClearingLogs(false);
    }
  };

  // 日付フォーマット
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "yyyy/MM/dd HH:mm:ss");
  };

  // ステータスに基づいたクラスを取得する関数
  const getStatusClass = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300";
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
              <h1 className="text-3xl font-bold tracking-tight">API取得ログ管理</h1>
              <p className="text-muted-foreground mt-1">
                APIの取得履歴と処理結果の確認
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => fetchLogs()}
              disabled={isRefreshing}
            >
              <RefreshCcw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              更新
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="h-8">
                  <Trash className="h-4 w-4 mr-2" />
                  古いログをクリア
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ログのクリア確認</AlertDialogTitle>
                  <AlertDialogDescription>
                    30日以上前のAPIログが削除されます。この操作は元に戻せません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearLogs}
                    disabled={isClearingLogs}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isClearingLogs ? "処理中..." : "削除する"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* フィルターフォーム */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>エンドポイント</FormLabel>
                    <FormControl>
                      <Input placeholder="例: /api/symbols" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ステータス</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="すべて" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">すべて</SelectItem>
                        <SelectItem value="success">成功</SelectItem>
                        <SelectItem value="error">エラー</SelectItem>
                        <SelectItem value="pending">保留中</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>開始日</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "yyyy/MM/dd")
                            ) : (
                              "日付を選択"
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>終了日</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "yyyy/MM/dd")
                            ) : (
                              "日付を選択"
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              フィルター適用
            </Button>
          </form>
        </Form>

        {/* ログ一覧 */}
        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">エンドポイント</th>
                  <th className="px-4 py-3 text-left">ステータス</th>
                  <th className="px-4 py-3 text-left">ステータスコード</th>
                  <th className="px-4 py-3 text-left">日時</th>
                  <th className="px-4 py-3 text-center">詳細</th>
                </tr>
              </thead>
              <tbody className={isLoading ? "opacity-50" : ""}>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-t hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">
                        {log.endpoint}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            log.status
                          )}`}
                        >
                          {log.status === "success"
                            ? "成功"
                            : log.status === "error"
                            ? "エラー"
                            : log.status === "pending"
                            ? "保留中"
                            : log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{log.statusCode || "-"}</td>
                      <td className="px-4 py-3">{formatDate(log.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              onClick={() => setSelectedLog(log)}
                            >
                              詳細
                            </Button>
                          </DialogTrigger>
                          {selectedLog && (
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>APIログ詳細</DialogTitle>
                                <DialogDescription>
                                  {selectedLog.endpoint} - {formatDate(selectedLog.createdAt)}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <div className="font-medium">エンドポイント:</div>
                                  <div className="col-span-3">{selectedLog.endpoint}</div>
                                </div>
                                
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <div className="font-medium">ステータス:</div>
                                  <div className="col-span-3">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                                        selectedLog.status
                                      )}`}
                                    >
                                      {selectedLog.status === "success"
                                        ? "成功"
                                        : selectedLog.status === "error"
                                        ? "エラー"
                                        : selectedLog.status === "pending"
                                        ? "保留中"
                                        : selectedLog.status}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <div className="font-medium">ステータスコード:</div>
                                  <div className="col-span-3">{selectedLog.statusCode || "-"}</div>
                                </div>
                                
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <div className="font-medium">リクエスト:</div>
                                  <div className="col-span-3">
                                    {selectedLog.requestBody ? (
                                      <pre className="bg-muted p-2 rounded-md overflow-x-auto text-xs">
                                        {JSON.stringify(JSON.parse(selectedLog.requestBody), null, 2)}
                                      </pre>
                                    ) : (
                                      <span className="text-muted-foreground">なし</span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <div className="font-medium">レスポンス:</div>
                                  <div className="col-span-3">
                                    {selectedLog.response ? (
                                      <pre className="bg-muted p-2 rounded-md overflow-x-auto text-xs">
                                        {JSON.stringify(JSON.parse(selectedLog.response), null, 2)}
                                      </pre>
                                    ) : (
                                      <span className="text-muted-foreground">なし</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="button" variant="secondary">
                                    閉じる
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          )}
                        </Dialog>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      {isLoading
                        ? "読み込み中..."
                        : "条件に一致するログが見つかりません"}
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