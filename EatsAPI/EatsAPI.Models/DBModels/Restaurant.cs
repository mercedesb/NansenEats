using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EatsAPI.Models.DBModels
{
	public class Restaurant
	{
		[Key]
		public int RestaurantId { get; set; }
		public string Name { get; set; }
		public string DistanceFromOffice { get; set; }

		public virtual IEnumerable<Review> RestaurantReviews { get; set; }
	}
}