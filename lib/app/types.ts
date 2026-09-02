/**
 * Named type aliases re-exported from the OpenAPI-generated file.
 *
 * Run `npm run openapi:gen` (API must be running on :3000) to refresh
 * `api-generated.d.ts`, then update aliases here if schemas changed.
 *
 * Existing imports across the app continue to work via these aliases.
 */

import type { components } from './api-generated';

type Schemas = components['schemas'];

// ── Primitives ──

export type UserRole = 'user' | 'seller' | 'admin';

export type UserSummary = {
  id: string;
  phone: string;
  role: UserRole;
  display_name: string | null;
  preferred_locale: string | null;
};

// ── /me ──

export type SellerApplicationMe = Schemas['SellerApplicationMeDto'];

export type MeResponse = Schemas['MeResponseDto'];

// ── /home ──

export type HomeSummaryResponse = Schemas['HomeSummaryResponseDto'];

/** GET /home/banners — hand-maintained until OpenAPI regen */
export type HomeBannerItem = {
  id: string;
  storage_key: string;
  title: string;
  subtitle: string | null;
  sort_order: number;
};

export type HomeBannerListResponse = { items: HomeBannerItem[] };

// ── /shops ──

export type FeaturedShopItem = Schemas['FeaturedShopItemDto'];

export type ShopReviewItem = Schemas['ShopReviewDto'];

export type ShopDetailResponse = Schemas['ShopDetailResponseDto'];

// ── Vehicles ──

export type Vehicle = Schemas['VehicleDto'];

// ── Photos (shared sub-shape) ──

export type RequestPhoto = Schemas['PhotoDto'];

// ── Requests ──

export type RequestListItem = Schemas['RequestListItemDto'];

export type Paginated<T> = {
  items: T[];
  next_cursor: string | null;
};

// ── Offers ──

export type Offer = Schemas['OfferDto'];

export type SellerOfferHistoryItem = Schemas['SellerOfferHistoryItemDto'];

export type RequestPublic = Schemas['RequestPublicDto'] & {
  /** Present on GET /requests/:id/public for the viewing seller */
  my_offers?: Array<
    Offer & {
      buyer_cancel_pending_ack?: boolean;
      deal_active?: boolean;
      buyer_marked_complete?: boolean;
      seller_marked_complete?: boolean;
      buyer_marked_cancel?: boolean;
      seller_marked_cancel?: boolean;
    }
  >;
};

export type RequestAuthorDetail = Schemas['RequestAuthorDetailDto'] & {
  /** Extend with my_offers for compatibility with RequestPublic usage */
  my_offers?: RequestPublic['my_offers'];
};

// ── Selection ──

export type SelectionResponse = Schemas['SelectionResponseDto'];

// ── Uploads ──

export type PresignResponse = Schemas['PresignResponseDto'];
