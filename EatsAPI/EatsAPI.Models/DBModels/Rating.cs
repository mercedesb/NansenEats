using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EatsAPI.Models.DBModels
{
	public class Rating
	{
		[Key]
		public int RatingId { get; set; }

		[Required]
		public int Value { get; set; }
		public DateTime CreatedDate { get; set; }
	}
}