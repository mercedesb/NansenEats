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
		public int Id { get; set; }

		[Required]
		public int Value { get; set; }
		public DateTime CreatedDate { get; set; }

		#region Navigational properties 
		public virtual Restaurant Restaurant { get; set; }
		public virtual ICollection<Category> Tags { get; set; }
		#endregion
	}
}