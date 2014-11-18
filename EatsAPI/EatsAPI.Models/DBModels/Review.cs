using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EatsAPI.Models.DBModels
{
	public class Review
	{
		[Key]
		public int ReviewId { get; set; }

		public int RatingId { get; set; }
		public virtual Rating Rating { get; set; }
		public int CommentId { get; set; }
		public virtual Comment Comment { get; set; }

		public int RestaurantId { get; set; }
		public virtual Restaurant Restaurant { get; set; }

		public IEnumerable<Category> Tags { get; set; }
	}
}