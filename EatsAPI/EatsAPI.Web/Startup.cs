using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(EatsAPI.Web.Startup))]
namespace EatsAPI.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
