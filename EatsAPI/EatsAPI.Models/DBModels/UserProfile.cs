using System.Collections.Generic;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EatsAPI.Models.DBModels
{
	public class UserProfile : IdentityUser
	{
		public string DisplayName { get; set; }
		public string ImageUrl { get; set; }

		public virtual ICollection<Comment> Comments { get; set; }
		public virtual ICollection<Rating> Ratings { get; set; }
		public virtual ICollection<Restaurant> Restaurants { get; set; }
	}
}