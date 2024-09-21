using System.Net;

namespace MysteryShopper.API.Utilities.Responses;

public record ExceptionResponse(HttpStatusCode StatusCode, string Message);
