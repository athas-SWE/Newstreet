using Microsoft.AspNetCore.Mvc;
using newstreetbackend.Model;
using newstreetbackend.Services;

namespace newstreetbackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Email and password are required");
        }

        var response = await _authService.LoginAsync(request);
        if (response == null)
        {
            return Unauthorized("Invalid email or password");
        }

        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Email and password are required");
        }

        var response = await _authService.RegisterAsync(request);
        if (response == null)
        {
            return BadRequest("Email already exists");
        }

        return Ok(response);
    }
}
