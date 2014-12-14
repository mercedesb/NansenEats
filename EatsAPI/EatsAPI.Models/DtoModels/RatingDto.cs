using EatsAPI.Models.DBModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EatsAPI.Models.DtoModels
{
	public class RatingDto
	{
		public int Id { get; set; }
		public int Value { get; set; }
		public DateTime CreatedDate { get; set; }
		public int RestaurantId { get; set; }
		public List<Category> Tags { get; set; }

		//public int UserId { get; set; }

		public RatingDto()
		{
			CreatedDate = DateTime.Now;
		}
	}

}