export const qk = {
  me: ['me'] as const,
  homeSummary: ['home', 'summary'] as const,
  vehicles: ['vehicles'] as const,
  requestsMine: (cursor?: string) => ['requests', 'mine', cursor ?? ''] as const,
  requestsOpen: (cursor?: string) => ['requests', 'open', cursor ?? ''] as const,
  requestAuthor: (id: string, includeHidden: boolean) =>
    ['requests', 'author', id, includeHidden] as const,
  requestPublic: (id: string) => ['requests', 'public', id] as const,
  offers: (requestId: string, includeHidden: boolean) =>
    ['offers', requestId, includeHidden] as const,
  selection: (requestId: string) => ['selection', requestId] as const,
};
