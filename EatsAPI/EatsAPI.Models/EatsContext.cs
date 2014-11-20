using System.Data.Entity;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.Initialization;

namespace EatsAPI.Models
{
	public class EatsContext : DbContext
	{
		public EatsContext()
			: base("NansenEats")
		  {
				if (Properties.Settings.Default.SeedDatabase)
				Database.SetInitializer<EatsContext>(new EatsDbInitializer());
			else
				Database.SetInitializer<EatsContext>(null);
		  }

		public DbSet<Restaurant> Restaurants { get; set; }
		public DbSet<Review> Reviews { get; set; }
		public DbSet<Category> Categories { get; set; }
		public DbSet<Comment> Comments { get; set; }
		public DbSet<Rating> Ratings { get; set; } 
	}
}