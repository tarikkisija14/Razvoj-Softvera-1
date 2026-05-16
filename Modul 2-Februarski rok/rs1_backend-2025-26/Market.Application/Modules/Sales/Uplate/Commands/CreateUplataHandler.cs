using Market.Domain.Entities.Sales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Application.Modules.Sales.Uplate.Commands
{
    public class CreateUplataHandler(IAppDbContext db) : IRequestHandler<CreateUplataCommand, int>
    {
        public async Task<int> Handle(CreateUplataCommand command, CancellationToken ct)
        {
            var order = await db.Orders
             .Include(x => x.Items)
             .ThenInclude(x => x.Product)
             .FirstOrDefaultAsync(x => x.Id == command.OrderId, ct);

            if (order == null)
                throw new MarketNotFoundException($"Narudzba sa ID={command.OrderId} nije pronadjena.");

            var mergedLinije=new List<CreateUplataLinijaDto>();

            foreach(var linija in command.Linije)
            {
                var postojeca=mergedLinije.FirstOrDefault(x=>x.ProductId== linija.ProductId
                && x.NacinPlacanja==linija.NacinPlacanja);

                if(postojeca != null)
                {
                    postojeca.Kolicina += linija.Kolicina;
                }
                else
                {
                    mergedLinije.Add(new CreateUplataLinijaDto
                    {
                        ProductId = linija.ProductId,
                        NacinPlacanja = linija.NacinPlacanja,
                        Kolicina = linija.Kolicina,
                    });
                }

            }
            decimal ukupaniznos = 0;
            var linijeEntities = new List<UplataLinijaEntity>();

            foreach(var linija in mergedLinije)
            {
                var orderitem = order.Items.FirstOrDefault(x => x.ProductId == linija.ProductId);
                if (orderitem == null)
                {
                    throw new Exception($"Proizvod sa ID={linija.ProductId} ne postoji u navedenoj narudzbi.");
                }

                var iznos = orderitem.Product!.Price * linija.Kolicina;
                ukupaniznos += iznos;

                linijeEntities.Add(new UplataLinijaEntity
                {
                    ProductId = linija.ProductId,
                    Kolicina = linija.Kolicina,
                    NacinPlacanja = linija.NacinPlacanja,
                    Iznos = iznos,
                });

            }

            var uplata = new UplataEntity
            {
                BrojUplate = command.BrojUplate,
                OrderId = command.OrderId,
                Napomena = command.Napomena,
                UkupanIznos = ukupaniznos,
                Linije = linijeEntities
            };
            db.Uplate.Add(uplata);
            
            order.TotalAmountPaid += ukupaniznos;
            order.BalanceDue = order.TotalAmount - order.TotalAmountPaid;

            if (order.BalanceDue <= 0)
            {
                order.BalanceDue = 0;
                order.Status = OrderStatusType.Paid;
            }
            else
            {
                order.Status = OrderStatusType.PartiallyPaid;
            }
            await db.SaveChangesAsync(ct);
            return uplata.Id;
        }
    }
}
