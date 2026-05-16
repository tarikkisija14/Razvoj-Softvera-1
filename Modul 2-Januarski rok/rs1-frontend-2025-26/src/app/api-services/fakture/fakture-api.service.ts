import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateFakturaCommand,
  CreateFakturaResponse,
  ListFaktureRequest,
  ListFaktureResponse
} from './fakture-api.models';
import {buildHttpParams} from '../../core/models/build-http-params';

@Injectable({
  providedIn: 'root'
})
export class FaktureApiService {
  private readonly baseUrl = `${environment.apiUrl}/Fakture`;
  private http = inject(HttpClient);

  /**
   * GET /Fakture
   * List fakture with pagination.
   */
  list(request:ListFaktureRequest): Observable<ListFaktureResponse> {
    const params = buildHttpParams(request);


    return this.http.get<ListFaktureResponse>(this.baseUrl, { params });
  }
  create(command:CreateFakturaCommand):Observable<CreateFakturaResponse>{
    return this.http.post<CreateFakturaResponse>(this.baseUrl, command);
  }
}
