using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Application.Modules.Fakture.Commands
{
    public class CreateFakturaValidator : AbstractValidator<CreateFakturaCommand>
    {
        public CreateFakturaValidator() {
            RuleFor(x => x.BrojRacuna).NotEmpty().MaximumLength(50).WithMessage("Neispravan broj racuna");
            RuleFor(x => x.Tip).IsInEnum().WithMessage("Neispravan tip fakture");
            RuleFor(x => x.Stavke).NotEmpty().WithMessage("Mora biti bar 1 stavka u fakturi");
            RuleForEach(x => x.Stavke).ChildRules(s =>
            {
                s.RuleFor(x => x.ProductCategoryId).GreaterThan(0).WithMessage("Pogresan Id");
                s.RuleFor(x => x.Kolicina).GreaterThan(0).WithMessage("Kolicina mora biti veca od 0");
                s.RuleFor(x => x.ImeProizvoda).MaximumLength(150).WithMessage("Pogresno ime proizvoda");
            });
        }
    }
}
