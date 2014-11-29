using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using EatsAPI.Models;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.DtoModels;
using AutoMapper;
using Microsoft.AspNet.Identity;

namespace EatsAPI.Controllers
{
	public class RestaurantsController : ApiController
	{
		private EatsContext db = new EatsContext();

		// GET: api/Restaurants
		public IQueryable<RestaurantDto> GetRestaurants()
		{
			var tempRestaurants = db.Restaurants.ToList();
			// GET: api/Restaurants/5
			return Mapper.Map<List<Restaurant>, List<RestaurantDto>>(tempRestaurants).AsQueryable();
		}

		[ResponseType(typeof(RestaurantDto))]
		public IHttpActionResult GetRestaurant(int id)
		{
			Restaurant restaurant = db.Restaurants.Find(id);
			if (restaurant == null)
			{
				return NotFound();
			}

			return Ok(Mapper.Map<Restaurant, RestaurantDto>(restaurant));
		}

		// PUT: api/Restaurants/5
		[Authorize]
		[ResponseType(typeof(void))]
		public IHttpActionResult PutRestaurant(int id, Restaurant restaurant)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (id != restaurant.Id)
			{
				return BadRequest();
			}

			db.Entry(restaurant).State = EntityState.Modified;

			try
			{
				db.SaveChanges();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!RestaurantExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return Ok(restaurant);
		}

		// POST: api/Restaurants
		[Authorize]
		[ResponseType(typeof(Restaurant))]
		public IHttpActionResult PostRestaurant(Restaurant restaurant)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			//var currentUserId = User.Identity.GetUserId();
			//var user = db.Users.FirstOrDefault(u => u.Id == currentUserId);

			//if (user != null) restaurant.CreatedBy = user;

			db.Restaurants.Add(restaurant);
			db.SaveChanges();

			return CreatedAtRoute("DefaultApi", new { id = restaurant.Id }, restaurant);
		}

		// DELETE: api/Restaurants/5
		[Authorize]
		[ResponseType(typeof(Restaurant))]
		public IHttpActionResult DeleteRestaurant(int id)
		{
			Restaurant restaurant = db.Restaurants.Find(id);
			if (restaurant == null)
			{
				return NotFound();
			}

			db.Restaurants.Remove(restaurant);
			db.SaveChanges();

			return Ok(restaurant);
		}

		protected override void Dispose(bool disposing)
		{
			if (disposing)
			{
				db.Dispose();
			}
			base.Dispose(disposing);
		}

		private bool RestaurantExists(int id)
		{
			return db.Restaurants.Count(e => e.Id == id) > 0;
		}
	}
}