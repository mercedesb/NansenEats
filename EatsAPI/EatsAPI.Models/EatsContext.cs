using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.Initialization;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EatsAPI.Models
{
	public class EatsContext : IdentityDbContext<UserProfile>
	{
		public EatsContext() : base("NansenEats")
		{
			if (Properties.Settings.Default.SeedDatabase)
				Database.SetInitializer<EatsContext>(new EatsDbInitializer());
			else
				Database.SetInitializer<EatsContext>(null);
		}

		public DbSet<Restaurant> Restaurants { get; set; }
		public DbSet<Rating> Ratings { get; set; }
		public DbSet<Comment> Comments { get; set; }
		public DbSet<Category> Categories { get; set; }
		//public DbSet<UserProfile> Users { get; set; }

		//public System.Data.Entity.DbSet<EatsAPI.Models.DtoModels.CommentDto> CommentDtoes { get; set; }
	}
}