using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EatsAPI.Models.DBModels
{
	public class Category
	{
		[Key]
		public int Id { get; set; }

		[Required]
		[MaxLength(50)]
		public string Name { get; set; }
		
		[MaxLength(250)]
		public string Description { get; set; }

		[MaxLength(1000)]
		public string ImagePath { get; set; }

		#region Navigational properties
		//public virtual ICollection<Rating> Ratings { get; set; }
		#endregion
	}
}