using Market.Domain.Entities.Fakture;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Application.Modules.Fakture.Commands
{
    public class CreateFakturaHandler(IAppDbContext db):IRequestHandler<CreateFakturaCommand,int>
    {
        public async Task<int> Handle(CreateFakturaCommand command, CancellationToken ct)
        {
            if (command.Tip == Domain.Entities.Fakture.FakturaTip.Ulazna)
            {
                await HandleUlazna(command, ct);
            }
            else if (command.Tip == Domain.Entities.Fakture.FakturaTip.Izlazna)
            {
                await HandleIzlazna(command, ct);
            }

            var exist = await db.Fakture.FirstOrDefaultAsync(x => x.BrojRacuna == command.BrojRacuna);
            if (exist != null)
            {
                throw new Exception("vec postoji ova faktura");
            }

            var nova = new FakturaEntity
            {
                BrojRacuna = command.BrojRacuna,
                Tip = command.Tip,
                Napomena = command.Napomena,
                BrojStavki = command.Stavke.Count,
                Stavke = command.Stavke.Select(x => new FakturaStavkaEntity
                {
                    ProductCategoryId = x.ProductCategoryId,
                    Kolicina = x.Kolicina,
                    ImeProizvoda = x.ImeProizvoda,
                }).ToList()
            };
            db.Fakture.Add(nova);
            await db.SaveChangesAsync(ct);
            return nova.Id;

        }

        private async Task HandleUlazna(CreateFakturaCommand command, CancellationToken ct)
        {
            foreach (var stavka in command.Stavke)
            {
                var postojeci = await db.Products.FirstOrDefaultAsync(x => x.Name.ToLower() == stavka.ImeProizvoda.ToLower() &&
                 x.CategoryId == stavka.ProductCategoryId);

                if (postojeci != null)
                {
                    postojeci.StockQuantity += stavka.Kolicina;

                }
                else
                {
                    var novi = new ProductEntity
                    {
                        CategoryId = stavka.ProductCategoryId,
                        Name = stavka.ImeProizvoda,
                        StockQuantity = stavka.Kolicina,
                        Description = "kreirano piutem fakture",
                        Price = 0,
                        IsEnabled = false
                    };
                    db.Products.Add(novi);
                }
                await db.SaveChangesAsync(ct);

            }
            
        }
        private async Task HandleIzlazna(CreateFakturaCommand command, CancellationToken ct)
        {
            var errors = new List<string>();

            foreach (var stavka in command.Stavke)
            {
                var postojeci = await db.Products.FirstOrDefaultAsync(x => x.Name.ToLower() == stavka.ImeProizvoda.ToLower() &&
               x.CategoryId == stavka.ProductCategoryId);

                if (postojeci == null)
                {
                    errors.Add("ne postoji produkt");
                    continue;
                }
                if (postojeci.StockQuantity < stavka.Kolicina)
                {
                    errors.Add("nema na stanju dovoljno");
                    continue;
                }
            }
            if (errors.Any())
            {
                throw new Exception("faktura odbijena");
            }
            foreach (var stavka in command.Stavke)
            {
                var postojeci = await db.Products.FirstOrDefaultAsync(x => x.Name.ToLower() == stavka.ImeProizvoda.ToLower() &&
                x.CategoryId == stavka.ProductCategoryId);
                postojeci!.StockQuantity -= stavka.Kolicina;

                if (postojeci.StockQuantity == 0)
                {
                    postojeci.IsEnabled = false;
                }

            }
        }


    }
}
