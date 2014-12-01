using EatsAPI.Models.DBModels;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EatsAPI.Models.Utilities
{
	public static class CategoryExtensions
	{
		public static IEnumerable<Category> GetTags(this string tagNames, EatsContext db)
		{
			foreach (var t in tagNames.Split(", ".ToArray(), StringSplitOptions.RemoveEmptyEntries))
			{
				var category = db.Categories.FirstOrDefault(c => c.Name.ToLower() == t.ToLower());
				if (category == null)
					category = new Category { Name = t };

				yield return category;
			}

		}
	}
}