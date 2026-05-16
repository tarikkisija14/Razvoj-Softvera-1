import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UplateApiService } from '../../../api-services/uplate/uplate-api.service';
import {ListUplateQueryDto, ListUplateRequest} from '../../../api-services/uplate/uplate-api.models';
import {BaseListPagedComponent} from '../../../core/components/base-classes/base-list-paged-component';

@Component({
  selector: 'app-uplate',
  standalone: false,
  templateUrl: './uplate.component.html',
  styleUrl: './uplate.component.scss'
})
export class UplateComponent  extends BaseListPagedComponent<ListUplateQueryDto, ListUplateRequest> implements OnInit {
  private router = inject(Router);
  private uplateApiService = inject(UplateApiService);

  uplate: ListUplateQueryDto[] = [];
  displayedColumns: string[] = ['brojUplate', 'orderReferenceNumber', 'datumKreiranja', 'ukupanIznos'];

  constructor() {
    super();
    this.request = new ListUplateRequest();
  }

  // Paging
  pageSize = 10;

  ngOnInit(): void {
    this.initList();
  }

  protected override loadPagedData() {
    this.startLoading();
    this.uplateApiService.list(this.request).subscribe({
      next: data => {
        this.handlePageResult(data);
        this.stopLoading();
      },
      error: err => {
        this.stopLoading();
        console.log(err.message);
      }
    })
  }

  onNovaUplata(): void {
    this.router.navigate(['/admin/uplate/add']);
  }

}
