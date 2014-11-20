using System;
using System.ComponentModel.DataAnnotations;

namespace EatsAPI.Models.DBModels
{
	public class Comment
	{
		[Key]
		public int Id { get; set; }

		[Required]
		[MaxLength(250)]
		public string Value { get; set; }
		public DateTime CreatedDate { get; set; }

		#region Navigational properties
		public virtual Restaurant Restaurant { get; set; }
		#endregion
	}
}