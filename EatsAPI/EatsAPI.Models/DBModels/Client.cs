using System.ComponentModel.DataAnnotations;
using EatsAPI.Models.Enums;

namespace EatsAPI.Models.DBModels
{
	public class Client
	{
		[Key]
		public string Id { get; set; }
		[Required]
		public string Secret { get; set; }
		[Required]
		[MaxLength(100)]
		public string Name { get; set; }
		public ApplicationTypes ApplicationType { get; set; }
		public bool Active { get; set; }
		public int RefreshTokenLifeTime { get; set; }
		[MaxLength(100)]
		public string AllowedOrigin { get; set; }
	}
}