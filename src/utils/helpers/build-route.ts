interface QueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, unknown>;
}

export default function buildRoute(baseUrl: string, { page=0, limit=10, sortBy, sortOrder, filters }: QueryParams): string {
    const formattedFilters = filters ? encodeURIComponent(JSON.stringify(filters)) : "";
    
    const symbol = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${symbol}page=${page+1}&limit=${limit}${
      formattedFilters ? `&filters=${formattedFilters}` : ""
    }${sortBy ? `&sortBy=${sortBy}`:""}${sortOrder?`&sortOrder=${sortOrder}`:'&sortOrder=asc' }`;
  }

