import { PageResult } from '../../core/models/paging/page-result';
import {BasePagedQuery} from '../../core/models/paging/base-paged-query';

// === ENUMS ===

/**
 * Tip fakture enum
 * Corresponds to: FakturaTip.cs
 */
export enum FakturaTip {
  /** Ulazna faktura - unos robe / povećanje zaliha */
  Ulazna = 1,
  /** Izlazna faktura - iznos robe / smanjenje zaliha */
  Izlazna = 2
}

// === QUERIES (READ) ===

/**
 * Response item for GET /Fakture
 * Corresponds to: ListFaktureQueryDto.cs
 */
export interface ListFaktureQueryDto {
  id: number;
  brojRacuna: string;
  tip: FakturaTip;
  datumKreiranja: string; // ISO date string
  brojStavki: number;
}

/**
 * Paged response for GET /Fakture
 */
export type ListFaktureResponse = PageResult<ListFaktureQueryDto>;


export class ListFaktureRequest extends BasePagedQuery{
  constructor() {
    super();
  }
}

export interface CreateFakturaStavkaDto {
  productCategoryId: number;
  imeProizvoda: string;
  kolicina: number;
}

export interface CreateFakturaCommand{
  brojRacuna: string;
  tip: FakturaTip;
  napomena?: string;
  stavke:CreateFakturaStavkaDto[]
}

export interface CreateFakturaResponse {
  id: number;
  message: string;
}


