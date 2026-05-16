using Market.Application.Modules.Fakture.Commands;
using Market.Application.Modules.Fakture.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
[AllowAnonymous]
public class FaktureController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<PageResult<ListFaktureQueryDto>> List([FromQuery] ListFaktureQuery query, CancellationToken ct)
    {
        var result = await sender.Send(query, ct);
        return result;
    }
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFakturaCommand command, CancellationToken ct)
    {
        var fakturaId = await sender.Send(command, ct);
        return Ok(new { id = fakturaId, message = "Faktura uspješno kreirana." });
    }
}
