import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SymbolDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/symbols">
            <ChevronLeft className="h-4 w-4 mr-1" />
            一覧に戻る
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        {/* シンボル情報 */}
        <div className="space-y-6 lg:w-2/3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-40" />
                <Skeleton className="h-6 w-20" />
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              
              <Skeleton className="h-4 w-full max-w-lg mt-2" />
            </div>
            
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
          
          <div className="mt-6 mb-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-64" />
            </div>
          </div>
          
          {/* 株価チャート（大） */}
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
        
        {/* 価格情報 */}
        <div className="lg:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-36" />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-20" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-y-2">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <React.Fragment key={i}>
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </React.Fragment>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 