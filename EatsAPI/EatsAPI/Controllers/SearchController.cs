using AutoMapper;
using EatsAPI.Models;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.DtoModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace EatsAPI.Controllers
{
    public class SearchController : ApiController
    {
		private EatsContext db = new EatsContext();
		
		public IHttpActionResult GetSearch(string searchTerm)
		{
			string query = searchTerm.Trim().ToLower();

			var people = db.Users.Where(u => u.DisplayName.ToLower().Contains(query));
			var restaurants = db.Restaurants.Where(r => r.Name.ToLower().Contains(query));
			var comments = db.Comments.Where(c => c.Value.ToLower().Contains(query));

			List<SearchResult> results = new List<SearchResult>();
			
			//results.AddRange(people.Select(p => new SearchResult
			// {
			//	 Id = p.Id,
			//	 TypePath = "users",
			//	 Result = Mapper.Map<UserProfile, UserModel>(p)
			// }));

			results.AddRange(restaurants.Select(r => new SearchResult
				{
					Id = r.Id.ToString(),
					TypePath = "restaurants",
					Result = Mapper.Map<Restaurant, RestaurantDto>(r)
				}));

			results.AddRange(comments.Select(c => new SearchResult
			{
				Id = c.Id.ToString(),
				TypePath = "comments",
				Result = Mapper.Map<Comment, CommentDto>(c)
			}));

			return Ok(results);
		}
    }
}
