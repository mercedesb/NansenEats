using System;
using System.Web.Http;
using EatsAPI.Providers;
using Microsoft.Owin;
using Microsoft.Owin.Security.Facebook;
using Microsoft.Owin.Security.Google;
using Microsoft.Owin.Security.MicrosoftAccount;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Owin.Security.Twitter;
using Owin;
using EatsAPI.App_Start;

[assembly: OwinStartup(typeof(EatsAPI.Startup))]
namespace EatsAPI
{
	public class Startup
	{
		public static OAuthBearerAuthenticationOptions OAuthBearerOptions { get; private set; }
		public static GoogleOAuth2AuthenticationOptions googleAuthOptions { get; private set; }
		public static FacebookAuthenticationOptions facebookAuthOptions { get; private set; }
		public static MicrosoftAccountAuthenticationOptions microsoftAuthOptions { get; private set; }
		public static TwitterAuthenticationOptions twitterAuthOptions { get; private set; }


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
			OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions
			{
				AllowInsecureHttp = true,
				TokenEndpointPath = new PathString("/token"),
				AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(30),
				Provider = new SimpleAuthorizationServerProvider(),
				RefreshTokenProvider = new SimpleRefreshTokenProvider()
			};

			// Token Generation
			app.UseOAuthAuthorizationServer(OAuthServerOptions);
			app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

			//use a cookie to temporarily store information about a user logging in with a third party login provider
			app.UseExternalSignInCookie(Microsoft.AspNet.Identity.DefaultAuthenticationTypes.ExternalCookie);

			//Configure Google External Login
			googleAuthOptions = new GoogleOAuth2AuthenticationOptions
			{
				ClientId = "845690146160-t1n5pde1l17tf1oriq153r7u5f2sqfgf.apps.googleusercontent.com",
				ClientSecret = "J64tsYKiWZZ9hX-PH0DP3q_s",
				Provider = new GoogleAuthProvider()
			};
			app.UseGoogleAuthentication(googleAuthOptions);

			microsoftAuthOptions = new MicrosoftAccountAuthenticationOptions
			{
				 ClientId = "000000004C12F7A1",
				 ClientSecret = "0fEqAF3pqQTp6PM8DUOMJ0iuNw7GBaDC",
				 Provider = new MicrosoftAuthProvider()
			};
			app.UseMicrosoftAccountAuthentication(microsoftAuthOptions);

			twitterAuthOptions = new TwitterAuthenticationOptions
			{
				ConsumerKey = "67CVHmxlVum3wH9Sh63Idvugo",
				ConsumerSecret = "Z7ykWpoakZPr0pXlGGpZQLOa3Dwh004hOB5wzyvsxQ1VNFtfrR",
				Provider = new TwitterAuthProvider()
			};
			app.UseTwitterAuthentication(twitterAuthOptions);

			facebookAuthOptions = new FacebookAuthenticationOptions
			{
				AppId = "399151880243548",
				AppSecret = "29daf2c4fc5c8c822d455b71ba8dd989",
				Provider = new FacebookAuthProvider()
			};
			app.UseFacebookAuthentication(facebookAuthOptions);
		}
	}
}