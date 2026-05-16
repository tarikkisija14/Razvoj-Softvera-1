using Market.Domain.Entities.Sales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Application.Modules.Sales.Uplate.Commands
{
    public class CreateUplataLinijaDto
    {
        public int ProductId { get; set; }
        public int Kolicina { get; set; }
        public NacinPlacanjaType NacinPlacanja { get; set; }
    }
}
