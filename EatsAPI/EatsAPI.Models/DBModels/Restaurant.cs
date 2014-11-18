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

		[Required]
		[MaxLength(40)]
		public string Name { get; set; }

		[MaxLength(40)]
		public string Address { get; set; }

		[MaxLength(10)]
		public string Zip { get; set; }

		[MaxLength(40)]
		public string City { get; set; }
		public double Lat { get; set; }
		public double Lng { get; set; }
		public int PriceRangeMin { get; set; }
		public int PriceRangeMax { get; set; }
		public DateTime CreatedDate { get; set; }

		public double DistanceFromOffice { get; set; }

		public virtual IEnumerable<Review> RestaurantReviews { get; set; }
	}
}