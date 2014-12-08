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

			var people = db.Users.Where(u => u.DisplayName.ToLower().Contains(query)).ToList();
			var restaurants = db.Restaurants.Where(r => r.Name.ToLower().Contains(query)).ToList();
			var comments = db.Comments.Where(c => c.Value.ToLower().Contains(query)).ToList();

			List<SearchResult> results = new List<SearchResult>();

			results.AddRange(people.Select(p => new SearchResult
			 {
				 Id = p.Id,
				 TypePath = "users",
				 Result = Mapper.Map<UserProfile, UserModel>(p),
				 Title = p.DisplayName,
				 TeaserImageUrl = p.ImageUrl
			 }));

			results.AddRange(restaurants.Select(r => new SearchResult
				{
					Id = r.Id.ToString(),
					TypePath = "restaurants",
					Result = Mapper.Map<Restaurant, RestaurantDto>(r),
					Title = r.Name,
					Description = string.Format("{0}/10<br/>{1} miles from office<br/>${2} - {3}", Mapper.Map<Restaurant, RestaurantDto>(r).AverageRating, r.DistanceFromOffice, r.PriceRangeMin, r.PriceRangeMax)
				}));

			results.AddRange(comments.Select(c => new SearchResult
			{
				Id = c.Id.ToString(),
				TypePath = "comments",
				Result = Mapper.Map<Comment, CommentDto>(c),
				Title = string.Format("Review for {0}", c.Restaurant.Name),
				Description = c.Value
			}));

			return Ok(results);
		}
    }
}
