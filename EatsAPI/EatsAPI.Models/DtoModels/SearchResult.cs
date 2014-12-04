using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EatsAPI.Models.DtoModels
{
	public class SearchResult
	{
		public string Id { get; set; }
		public string TypePath { get; set; }
		public object Result { get; set; }

		public string Title { get; set; }
		public string Description { get; set; }
		public string TeaserImageUrl { get; set; }
	}
}