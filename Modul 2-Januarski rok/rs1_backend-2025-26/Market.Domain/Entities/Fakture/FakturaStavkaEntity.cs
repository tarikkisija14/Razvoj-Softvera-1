using Market.Domain.Common;
using Market.Domain.Entities.Catalog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Domain.Entities.Fakture
{
    public class FakturaStavkaEntity:BaseEntity
    {
        public int FakturaId { get; set; }
        public FakturaEntity? Faktura { get; set; }
        public int ProductCategoryId { get; set; }
        public ProductCategoryEntity? ProductCategory { get; set; }

        public string ImeProizvoda { get; set; }
        public int Kolicina { get; set; }

        public static class Constraints
        {
            public const int ImeProizvodaMaxLenght = 150;
        }
    }
}
