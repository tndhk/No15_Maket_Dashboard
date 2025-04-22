import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SymbolDetailCardProps {
  symbol: string;
  name: string;
  category: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string | null;
  id?: number;
}

export default function SymbolDetailCard({
  symbol,
  name,
  category,
  status,
  createdAt,
  updatedAt,
  description,
  id
}: SymbolDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>シンボル詳細</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-muted-foreground dark:text-gray-300">シンボル</Label>
            <div>{symbol}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground dark:text-gray-300">名前</Label>
            <div>{name}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground dark:text-gray-300">カテゴリー</Label>
            <div>
              <Badge variant="outline" className="mr-1">
                {getCategoryLabel(category)}
              </Badge>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground dark:text-gray-300">ステータス</Label>
            <div>
              <Badge
                variant={status === "active" ? "success" : "secondary"}
              >
                {status === "active" ? "有効" : "無効"}
              </Badge>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground dark:text-gray-300">ID</Label>
            <div className="text-sm">{id}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground dark:text-gray-300">作成日</Label>
            <div className="text-sm">{formatDate(createdAt)}</div>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground dark:text-gray-300">更新日</Label>
            <div className="text-sm">{formatDate(updatedAt)}</div>
          </div>
        </div>
        {description && (
          <div className="space-y-1 col-span-2">
            <Label className="text-muted-foreground dark:text-gray-300">説明</Label>
            <div className="text-sm whitespace-pre-line">{description}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// カテゴリに基づいたラベルを取得する関数
function getCategoryLabel(category: string): string {
  switch (category) {
    case "stock":
      return "株式";
    case "crypto":
      return "仮想通貨";
    case "forex":
      return "為替";
    case "index":
      return "指数";
    case "other":
      return "その他";
    default:
      return category;
  }
} 