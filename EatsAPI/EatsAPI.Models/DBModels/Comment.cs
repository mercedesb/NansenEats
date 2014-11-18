using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace EatsAPI.Models.DBModels
{
	public class Comment
	{
		[Key]
		public int CommentId { get; set; }
		[Required]
		[MaxLength(250)]
		public string Value { get; set; }
		public DateTime CreatedDate { get; set; }
	}
}