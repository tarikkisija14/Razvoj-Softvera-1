using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Application.Modules.Sales.Uplate.Commands
{
    public class CreateUplataValidator : AbstractValidator<CreateUplataCommand>
    {
        public CreateUplataValidator()
        {
            RuleFor(x => x.BrojUplate).NotEmpty().MaximumLength(20).WithMessage("Nepravilan broj uplate");
            RuleFor(x => x.OrderId).GreaterThan(0).WithMessage("nepravilna narudzba") ;

            RuleFor(x => x.Linije).NotEmpty().WithMessage("Uplata mora imati bar 1 liniju");
            RuleForEach(x => x.Linije).ChildRules(s =>
            {
                s.RuleFor(x => x.ProductId).GreaterThan(0).WithMessage("Nepravilan id");
                s.RuleFor(x => x.Kolicina).GreaterThan(0).WithMessage("Kolicina mora biti veca od 0");
                s.RuleFor(x => x.NacinPlacanja).IsInEnum().WithMessage("Izaberite pravilan nacin plcanja");
            });
        }
    }
}
