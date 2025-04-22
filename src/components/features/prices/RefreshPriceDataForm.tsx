"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { refreshPriceData } from "@/app/actions/price-data";

interface RefreshPriceDataFormProps {
  symbolId: number;
  symbolName: string;
  symbol: string;
  category: string;
}

export function RefreshPriceDataForm({
  symbolId,
  symbolName,
  symbol,
  category,
}: RefreshPriceDataFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataSource, setDataSource] = useState<string>("alphavantage");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // 適切なデータソースを提案
  const suggestDataSource = (category: string): string => {
    switch (category) {
      case "crypto":
        return "coingecko";
      case "stock":
        return "alphavantage";
      case "forex":
        return "yahoo";
      case "index":
        return "yahoo";
      default:
        return "alphavantage";
    }
  };

  // コンポーネントマウント時にデータソースを設定
  useState(() => {
    setDataSource(suggestDataSource(category));
  });

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Server Actionを呼び出し
      const formData = new FormData(e.currentTarget);
      const result = await refreshPriceData(formData);
      
      if (result.status === "success") {
        toast.success(result.message);
        // ページを更新
        router.refresh();
        setFormSuccess(result.message);
      } else {
        toast.error("データ取得に失敗しました");
        setFormError("データ取得に失敗しました");
      }
    } catch (error) {
      console.error("Error refreshing price data:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "価格データの更新中にエラーが発生しました"
      );
      setFormError(
        error instanceof Error
          ? error.message
          : "価格データの更新中にエラーが発生しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>価格データ更新</CardTitle>
        <CardDescription>
          {symbolName}（{symbol}）の価格データを取得します
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dataSource">データソース</Label>
              <RadioGroup
                value={dataSource}
                onValueChange={setDataSource}
                className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alphavantage" id="alphavantage" />
                  <Label htmlFor="alphavantage" className="cursor-pointer">
                    Alpha Vantage
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yahoo" id="yahoo" />
                  <Label htmlFor="yahoo" className="cursor-pointer">
                    Yahoo Finance
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="coingecko" id="coingecko" />
                  <Label htmlFor="coingecko" className="cursor-pointer">
                    CoinGecko
                  </Label>
                </div>
              </RadioGroup>
              
              <input
                type="hidden"
                name="symbolId"
                value={symbolId}
              />
              
              <input
                type="hidden"
                name="dataSource"
                value={dataSource}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <p>推奨データソース: {dataSourceDescription(dataSource)}</p>
              <ul className="mt-2 list-disc pl-5">
                <li>Alpha Vantage: 株式、為替、仮想通貨に対応</li>
                <li>Yahoo Finance: 株式、為替、指数に対応</li>
                <li>CoinGecko: 仮想通貨に特化</li>
              </ul>
            </div>

            {formError && (
              <div className="text-sm text-red-500 mb-4">{formError}</div>
            )}
            {formSuccess && (
              <div className="text-sm text-muted-foreground dark:text-gray-300">{formSuccess}</div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                データ取得中...
              </>
            ) : (
              "価格データを取得"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// データソースの説明
function dataSourceDescription(source: string): string {
  switch (source) {
    case "alphavantage":
      return "Alpha Vantage";
    case "yahoo":
      return "Yahoo Finance";
    case "coingecko":
      return "CoinGecko";
    default:
      return "Alpha Vantage";
  }
} 