using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(NansenEats.Startup))]
namespace NansenEats
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
