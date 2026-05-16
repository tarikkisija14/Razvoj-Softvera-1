using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Application.Modules.Fakture.Commands
{
    public class CreateFakturaStavkaDto
    {
        public int ProductCategoryId { get; set; }
        public string ImeProizvoda { get; set; }
        public int Kolicina { get; set; }
    }
}
