export function getUserUploadPath(route: string): string | null {
    const parts = route.split("user-uploads/");
    return parts.length > 1 ? parts[1] : null;
  }
  