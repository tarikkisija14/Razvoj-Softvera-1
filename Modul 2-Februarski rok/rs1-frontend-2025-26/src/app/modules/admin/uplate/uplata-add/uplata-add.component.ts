import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  CreateUplataCommand,
  CreateUplataLinijaDto,
  NacinPlacanjaType
} from '../../../../api-services/uplate/uplate-api.models';
import {
  ListOrdersWithItemsQueryDto,
  ListOrdersWithItemsQueryDtoItem
} from '../../../../api-services/orders/orders-api.models';
import { ToasterService } from '../../../../core/services/toaster.service';
import {UplateApiService} from '../../../../api-services/uplate/uplate-api.service';
import {OrdersApiService} from '../../../../api-services/orders/orders-api.service';

interface NacinPlacanja {
  id: NacinPlacanjaType;
  name: string;
}

@Component({
  selector: 'app-uplata-add',
  standalone: false,
  templateUrl: './uplata-add.component.html',
  styleUrl: './uplata-add.component.scss'
})
export class UplataAddComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form: FormGroup;
  isSaving = false;
  isLoading = false;

  private uApi=inject(UplateApiService);
  private oApi=inject(OrdersApiService);
  private ts=inject(ToasterService);


  narudzbe: ListOrdersWithItemsQueryDto[] = [];
  selectedOrderItems: ListOrdersWithItemsQueryDtoItem[] = [];

  nacinPlacanjaOpcije: NacinPlacanja[] = [
    { id: NacinPlacanjaType.Kes, name: 'Kes' },
    { id: NacinPlacanjaType.Kartica, name: 'Kartica' }
  ];


  constructor() {
    this.form = this.fb.group({
      brojUplate: ['',[Validators.required,Validators.maxLength(20)]],
      orderId: ['',[Validators.required]],
      napomena: ['',[Validators.maxLength(500)]],
      items: this.fb.array([],[Validators.required])
    });


  }

  ngOnInit(): void {
    this.loadNarudzbe();
  }

  onOrderChange(orderId: number): void {
    const order = this.narudzbe.find(o => o.id === orderId);
    this.selectedOrderItems = order ? order.items : [];
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      productId: ['',[Validators.required]],
      kolicina: [1,[Validators.required,Validators.min(1)]],
      nacinPlacanja: ['',[Validators.required]],
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onCancel(): void {
    this.router.navigate(['/admin/uplate']);
  }

  onSubmit(): void {
    if(this.form.invalid){
      this.ts.error("popunite sva polja");
      return;
    }
    if(this.items.length === 0){
      this.ts.error("uplata mora imati 1 liniju");
      return;
    }
    this.isSaving = true;

    const command:CreateUplataCommand={
      brojUplate:this.form.value.brojUplate,
      orderId:this.form.value.orderId,
      napomena:this.form.value.napomena,
      linije:this.items.controls.map(i=>({
          productId:i.value.productId,
          kolicina:i.value.kolicina,
          nacinPlacanja:i.value.nacinPlacanja,

        }as CreateUplataLinijaDto
      ))
    };

    this.uApi.create(command).subscribe({
      next: data=> {
        this.ts.success("Uplata uspjesno kreirana");
        this.router.navigate(['/admin/uplate']);
      },
      error: error => {
        this.ts.error("Greska prilikom uplate");
        console.log(error.message);
        if(error.status === 409){
          this.ts.error("kreiranje uplate odbijeno");
        }
      }
    })


  }

  private loadNarudzbe() {
    this.isLoading = true;
    this.oApi.listWithItems().subscribe({
      next: data => {
        this.narudzbe=data.items;
        this.isLoading = false;
        this.addItem();
        this.addItem();
      },
      error: err => {
        console.log(err.message);
        this.ts.error("greska pri ucitavanju naruzdbi");
      }
    })
  }
}
