using System.Configuration;
using Geocoding;
using Geocoding.Google;
using Geocoding.Microsoft;
using Microsoft.Practices.Unity;
using System.Web.Http;
using Unity.WebApi;
using EatsAPI.Properties;

namespace EatsAPI.App_Start
{
	public static class UnityConfig
	{
		public static UnityContainer RegisterComponents()
		{
			var container = new UnityContainer();

			// register all your components with the container here
			// it is NOT necessary to register your controllers

			// e.g. container.RegisterType<ITestService, TestService>();


			container.RegisterType<IGeocoder, GoogleGeocoder>();

			GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);

			return container;
		}
	}
}
