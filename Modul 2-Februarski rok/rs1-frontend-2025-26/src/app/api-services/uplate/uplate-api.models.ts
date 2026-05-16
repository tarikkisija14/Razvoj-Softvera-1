import { PageResult } from '../../core/models/paging/page-result';
import {BasePagedQuery} from '../../core/models/paging/base-paged-query';

// === ENUMS ===

/**
 * Nacin placanja enum
 * Corresponds to: NacinPlacanjaType.cs
 */
export enum NacinPlacanjaType {
  /** Placanje gotovinom (kes) */
  Kes = 1,
  /** Placanje karticom */
  Kartica = 2
}

// === QUERIES (READ) ===

/**
 * Response item for GET /Uplate
 * Corresponds to: ListUplateQueryDto.cs
 */
export interface ListUplateQueryDto {
  id: number;
  brojUplate: string;
  orderId: number;
  orderReferenceNumber: string;
  napomena: string | null;
  ukupanIznos: number;
  datumKreiranja: string; // ISO date string
}

/**
 * Paged response for GET /Uplate
 */
export type ListUplateResponse = PageResult<ListUplateQueryDto>;


export class ListUplateRequest extends BasePagedQuery{
  constructor() {
    super();
  }
}

export interface CreateUplataLinijaDto {
  productId: number;
  kolicina: number;
  nacinPlacanja: NacinPlacanjaType;
}

export interface CreateUplataCommand{
  brojUplate: string;
  orderId: number;
  napomena?: string;
  linije:CreateUplataLinijaDto[]
}

export interface CreateUplataResponse {
  id: number;
  message: string;
}



