import { currentUser, auth } from "@clerk/nextjs/server";

export enum UserRole {
  ADMIN = "admin",
  VIEWER = "viewer",
}

// PublicMetadataがある場合の型
type UserPublicMetadata = {
  role?: UserRole;
};

// ユーザーのロールを取得
export const getUserRole = async (): Promise<UserRole> => {
  const user = await currentUser();
  
  if (!user) {
    return UserRole.VIEWER; // デフォルトはViewer
  }

  const metadata = user.publicMetadata as UserPublicMetadata;
  return metadata.role || UserRole.VIEWER;
};

// 現在のユーザーが管理者かどうかをチェック
export const isAdmin = async (): Promise<boolean> => {
  const role = await getUserRole();
  return role === UserRole.ADMIN;
};

// クライアントサイドでのロール確認（非同期処理なし）
export const hasRole = (allowedRole: UserRole): boolean => {
  // クライアントサイドではロール判定不可
  // 必要ならpropsやcontext経由で渡す
  return false;
}; 