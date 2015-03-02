using System.Data.Entity;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.Initialization;
using EatsAPI.Models.Properties;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EatsAPI.Models
{
	public class EatsContext : IdentityDbContext<UserProfile>
	{
		public EatsContext() : base("NansenEats")
		{
			if (Settings.Default.SeedDatabase)
				Database.SetInitializer<EatsContext>(new EatsDbInitializer());
			else
				Database.SetInitializer<EatsContext>(null);
		}

		public DbSet<Restaurant> Restaurants { get; set; }
		public DbSet<Rating> Ratings { get; set; }
		public DbSet<Comment> Comments { get; set; }
		public DbSet<Category> Categories { get; set; }
		public DbSet<Client> Clients { get; set; }
		public DbSet<RefreshToken> RefreshTokens { get; set; }
	}
}