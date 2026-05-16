import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {CreateUplataCommand, CreateUplataResponse, ListUplateRequest, ListUplateResponse} from './uplate-api.models';
import {buildHttpParams} from '../../core/models/build-http-params';

@Injectable({
  providedIn: 'root'
})
export class UplateApiService {
  private readonly baseUrl = `${environment.apiUrl}/Uplate`;
  private http = inject(HttpClient);

  /**
   * GET /Uplate
   * List uplate with pagination.
   */
  list(request:ListUplateRequest): Observable<ListUplateResponse> {
    const params = buildHttpParams(request);


    return this.http.get<ListUplateResponse>(this.baseUrl, { params });
  }
  create(command:CreateUplataCommand):Observable<CreateUplataResponse>{
    return this.http.post<CreateUplataResponse>(this.baseUrl, command);
  }


}
