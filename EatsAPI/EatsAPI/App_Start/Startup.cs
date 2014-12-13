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


			var _container = UnityConfig.RegisterComponents(config);

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

			//app.UseMicrosoftAccountAuthentication(
			//    clientId: "000000004C12F7A1",
			//    clientSecret: "0fEqAF3pqQTp6PM8DUOMJ0iuNw7GBaDC");

			//app.UseTwitterAuthentication(
			//   consumerKey: "67CVHmxlVum3wH9Sh63Idvugo",
			//   consumerSecret: "Z7ykWpoakZPr0pXlGGpZQLOa3Dwh004hOB5wzyvsxQ1VNFtfrR");

			//app.UseFacebookAuthentication(
			//   appId: "399151880243548",
			//   appSecret: "29daf2c4fc5c8c822d455b71ba8dd989");

			//app.UseGoogleAuthentication(
			//	clientId: "845690146160-t1n5pde1l17tf1oriq153r7u5f2sqfgf.apps.googleusercontent.com",
			//	clientSecret: "J64tsYKiWZZ9hX-PH0DP3q_s");

		}
	}
}