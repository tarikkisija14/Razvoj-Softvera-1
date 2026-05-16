using Market.Domain.Entities.Fakture;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Application.Modules.Fakture.Commands
{
    public class CreateFakturaCommand : IRequest<int>
    {
        public string BrojRacuna { get; set; }
        public FakturaTip Tip { get; set; }
        public string? Napomena { get; set; }
        public List<CreateFakturaStavkaDto> Stavke { get; set; } = new();
    }
}
