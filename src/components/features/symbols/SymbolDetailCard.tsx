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
          <div>
            <Label className="text-muted-foreground">シンボル</Label>
            <p className="text-sm mt-1">{symbol}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">名前</Label>
            <p className="text-sm mt-1">{name}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">カテゴリー</Label>
            <p className="text-sm mt-1">
              <Badge variant="outline" className="mr-1">
                {getCategoryLabel(category)}
              </Badge>
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">ステータス</Label>
            <p className="text-sm mt-1">
              <Badge variant={status === "active" ? "success" : "secondary"}>
                {status === "active" ? "有効" : "無効"}
              </Badge>
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">ID</Label>
            <p className="text-sm mt-1">{id}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">作成日</Label>
            <p className="text-sm mt-1">{formatDate(createdAt)}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">更新日</Label>
            <p className="text-sm mt-1">{formatDate(updatedAt)}</p>
          </div>
        </div>
        {description && (
          <div className="mt-2">
            <Label className="text-muted-foreground">説明</Label>
            <p className="text-sm mt-1 whitespace-pre-line">{description}</p>
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