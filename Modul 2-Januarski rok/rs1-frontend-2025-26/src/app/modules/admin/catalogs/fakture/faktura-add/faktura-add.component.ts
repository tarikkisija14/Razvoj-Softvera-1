import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CreateFakturaCommand,
  CreateFakturaStavkaDto,
  FakturaTip
} from '../../../../../api-services/fakture/fakture-api.models';
import {FaktureApiService} from '../../../../../api-services/fakture/fakture-api.service';
import {
  ProductCategoriesApiService
} from '../../../../../api-services/product-categories/product-categories-api.service';
import {ToasterService} from '../../../../../core/services/toaster.service';

interface Tip {
  id: FakturaTip;
  name: string;
}

interface Kategorija {
  id: number;
  name: string;
}

@Component({
  selector: 'app-faktura-add',
  standalone: false,
  templateUrl: './faktura-add.component.html',
  styleUrl: './faktura-add.component.scss'
})
export class FakturaAddComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form: FormGroup;
  isSaving = false;
  isLoading = false;

  private fApi=inject(FaktureApiService);
  private prApi=inject(ProductCategoriesApiService);
  private ts=inject(ToasterService);

  tipovi: Tip[] = [
    { id: FakturaTip.Ulazna, name: 'Ulazna' },
    { id: FakturaTip.Izlazna, name: 'Izlazna' }
  ];

  //ispitni zadatak: zamjeniti hardkodirano sa API rezultatom
  kategorije: Kategorija[] = [

  ];

  constructor() {
    this.form = this.fb.group({
      brojRacuna: ['',[Validators.required,Validators.maxLength(20)]],
      tip: ['',[Validators.required]],
      napomena: ['',[Validators.required,Validators.maxLength(150)]],
      items: this.fb.array([],[Validators.required])
    });
  }

  ngOnInit() {
    this.loadKategorije();
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      kategorijaId: ['',[Validators.required]],
      proizvod: ['',[Validators.required,Validators.maxLength(150)]],
      kolicina: [1,[Validators.required,Validators.min(1)]],
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onCancel(): void {
    this.router.navigate(['/admin/fakture']);
  }

  onSubmit(): void {
    if(this.form.invalid){
      this.ts.error("unesite sva polja pravilno");
      return;
    }

    if(this.items.length === 0){
      this.ts.error("faktura mora imati minimalno 1 stavku");
      return;
    }

    this.isSaving = true;

    const command:CreateFakturaCommand={
      brojRacuna:this.form.value.brojRacuna,
      tip:this.form.value.tip,
      napomena:this.form.value.napomena,
      stavke:this.items.controls.map(i=>({
          productCategoryId:i.value.kategorijaId,
          imeProizvoda:i.value.proizvod,
          kolicina:i.value.kolicina,

        }as CreateFakturaStavkaDto
      ))
    };

    this.fApi.create(command).subscribe({
      next: data => {
        this.ts.success("Faktura uspjesno kreirana");
        this.router.navigate(['/admin/fakture']);
      },
      error: error => {
        if(error.status === 409 || error.status === 500) {
          this.ts.error("Faktura odbijena");
          return;
        }

        this.ts.error("Greska prilikom kreiranja fakture");
        console.log(error.message);
        }

    })


  }

  private loadKategorije() {
    this.isLoading=true;

    this.prApi.list().subscribe({
      next: data => {
        this.kategorije=data.items.map(k=>({
          id:k.id,
          name: k.name
        }));
        this.isLoading=false;
        this.addItem();
        this.addItem();
      },
      error: error => {
        console.log(error.message);
        this.ts.error("greska pri ucitavanju kategorija");
      }
    })
  }
}
