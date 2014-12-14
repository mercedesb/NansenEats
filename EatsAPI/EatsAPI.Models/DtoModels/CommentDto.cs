using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EatsAPI.Models.DtoModels
{
	public class CommentDto
	{
		public int Id { get; set; }
		public string Value { get; set; }
		public DateTime CreatedDate { get; set; }
		public int RestaurantId { get; set; }
		//public int UserId { get; set; }

		public CommentDto()
		{
			CreatedDate = DateTime.Now;
		}
	}
}