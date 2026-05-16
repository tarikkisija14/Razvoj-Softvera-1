import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FaktureApiService } from '../../../../api-services/fakture/fakture-api.service';
import {ListFaktureQueryDto, FakturaTip, ListFaktureRequest} from '../../../../api-services/fakture/fakture-api.models';
import {BaseListPagedComponent} from '../../../../core/components/base-classes/base-list-paged-component';

@Component({
  selector: 'app-fakture',
  standalone: false,
  templateUrl: './fakture.component.html',
  styleUrl: './fakture.component.scss'
})
export class FaktureComponent extends BaseListPagedComponent<ListFaktureQueryDto, ListFaktureRequest> implements OnInit {
  private router = inject(Router);
  private faktureApiService = inject(FaktureApiService);

  fakture: ListFaktureQueryDto[] = [];
  displayedColumns: string[] = ['brojRacuna', 'tip', 'datumKreiranja', 'brojStavki'];

  constructor() {
    super();
    this.request = new ListFaktureRequest();
  }

  ngOnInit(): void {
    this.initList();
  }

  protected override loadPagedData() {
    this.startLoading();
    this.faktureApiService.list(this.request).subscribe({
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


  onNovaFaktura(): void {
    this.router.navigate(['/admin/fakture/add']);
  }

  /**
   * Helper metoda za prikaz tipa fakture kao string
   */
  getTipString(tip: FakturaTip): string {
    return tip === FakturaTip.Ulazna ? 'ULAZNA' : 'IZLAZNA';
  }

  /**
   * Helper metoda za CSS klasu badge-a
   */
  getTipClass(tip: FakturaTip): string {
    return tip === FakturaTip.Ulazna ? 'ulazna' : 'izlazna';
  }
}
