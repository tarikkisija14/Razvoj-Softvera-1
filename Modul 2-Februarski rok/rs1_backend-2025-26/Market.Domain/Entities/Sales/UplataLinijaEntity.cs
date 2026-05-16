using Market.Domain.Common;
using Market.Domain.Entities.Catalog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Domain.Entities.Sales
{
    public class UplataLinijaEntity : BaseEntity
    {
        public int UplataId { get; set; }
        public UplataEntity? Uplata { get; set; }
        public int ProductId { get; set; }
        public ProductEntity? Product { get; set; }

        public int Kolicina { get; set; }
        public NacinPlacanjaType NacinPlacanja { get; set; }
        public decimal Iznos { get; set; }
    }
}
