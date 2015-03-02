using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Owin.Security.Twitter;

namespace EatsAPI.Providers
{
	public class TwitterAuthProvider : TwitterAuthenticationProvider
	{
		public override Task Authenticated(TwitterAuthenticatedContext context)
		{
			context.Identity.AddClaim(new Claim("ExternalAccessToken", context.AccessToken));
			return Task.FromResult<object>(null);

		}
	}
}