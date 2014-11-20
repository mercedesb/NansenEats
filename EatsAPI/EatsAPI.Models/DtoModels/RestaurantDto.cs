using EatsAPI.Models.DBModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EatsAPI.Models.DtoModels
{
	public class RestaurantDto
	{
		public int RestaurantId { get; set; }
		public string Name { get; set; }
		public string Address { get; set; }
		public string Zip { get; set; }
		public string City { get; set; }
		public double Lat { get; set; }
		public double Lng { get; set; }
		public int PriceRangeMin { get; set; }
		public int PriceRangeMax { get; set; }
		public DateTime CreatedDate { get; set; }
		public double DistanceFromOffice { get; set; }
		public ICollection<RestaurantReviewDto> RestaurantReviews { get; set; }
	}

	public class RestaurantReviewDto
	{
		public int ReviewId { get; set; }
		public Rating Rating { get; set; }
		public Comment Comment { get; set; }
		public ICollection<Category> Tags { get; set; }
	}
}