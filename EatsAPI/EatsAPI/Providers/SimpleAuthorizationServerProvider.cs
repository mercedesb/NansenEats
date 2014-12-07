using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.Repository;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;

namespace EatsAPI.Providers
{
	public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
	{
		public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
		{
			context.Validated();
		}

		public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
		{

			context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
			AuthenticationProperties properties = null;
			using (AuthRepository _repo = new AuthRepository())
			{
				UserProfile user = await _repo.FindUser(context.UserName, context.Password);

				if (user == null)
				{
					context.SetError("invalid_grant", "The user name or password is incorrect.");
					return;
				}
				properties = CreateProperties(user.DisplayName, user.Id, user.ImageUrl);

			}

			var identity = new ClaimsIdentity(context.Options.AuthenticationType);
			identity.AddClaim(new Claim("sub", context.UserName));
			identity.AddClaim(new Claim("role", "user"));

			if (properties != null)
			{
				AuthenticationTicket ticket = new AuthenticationTicket(identity, properties);
				context.Validated(ticket);
			}
			else
			{
				context.Validated(identity);
			}
		}

		public override Task TokenEndpoint(OAuthTokenEndpointContext context)
		{
			foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
			{
				context.AdditionalResponseParameters.Add(property.Key, property.Value);
			}

			return Task.FromResult<object>(null);
		}

		public static AuthenticationProperties CreateProperties(string userName, string userId, string userImageUrl)
		{
			IDictionary<string, string> data = new Dictionary<string, string>
		  {
				{"userDisplayName", userName},
				{"userId", userId},
				{"userImageUrl", userImageUrl ?? ""}
		  };
			return new AuthenticationProperties(data);
		}
	}
}