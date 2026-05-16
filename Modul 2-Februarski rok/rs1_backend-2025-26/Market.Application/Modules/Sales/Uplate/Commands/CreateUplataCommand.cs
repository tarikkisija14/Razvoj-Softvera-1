using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Application.Modules.Sales.Uplate.Commands
{
    public class CreateUplataCommand : IRequest<int>
    {
        public string BrojUplate { get; set; }
        public int OrderId { get; set; }
        public string? Napomena { get; set; }
        public List<CreateUplataLinijaDto> Linije { get; set; } = new();
    }
}
