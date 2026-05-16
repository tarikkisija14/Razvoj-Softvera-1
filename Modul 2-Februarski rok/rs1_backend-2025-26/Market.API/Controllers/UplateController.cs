using Market.Application.Modules.Sales.Uplate.Commands;
using Market.Application.Modules.Sales.Uplate.Queries.List;
namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
[AllowAnonymous]
public class UplateController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<PageResult<ListUplateQueryDto>> List([FromQuery] ListUplateQuery query, CancellationToken ct)
    {
        var result = await sender.Send(query, ct);
        return result;
    }
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUplataCommand command, CancellationToken ct)
    {
        var uplataId = await sender.Send(command, ct);
        return Ok(new { id = uplataId, message = "Uplata uspjesno kreirana." });
    }

}
