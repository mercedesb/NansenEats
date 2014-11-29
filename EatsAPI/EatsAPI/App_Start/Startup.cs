using System;
using System.Web.Http;
using EatsAPI.Providers;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;

[assembly: OwinStartup(typeof(EatsAPI.Startup))]
namespace EatsAPI
{
	public class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			ConfigureOAuth(app);
	
			HttpConfiguration config = new HttpConfiguration();
			WebApiConfig.Register(config);

			app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
			app.UseWebApi(config);

			AutoMapperConfig.Register();
			AutoMapper.Mapper.AssertConfigurationIsValid();
		}

		public void ConfigureOAuth(IAppBuilder app)
		{
			OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
			{
				AllowInsecureHttp = true,
				TokenEndpointPath = new PathString("/token"),
				AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
				Provider = new SimpleAuthorizationServerProvider()
			};

			// Token Generation
			app.UseOAuthAuthorizationServer(OAuthServerOptions);
			app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

		}
	}
}