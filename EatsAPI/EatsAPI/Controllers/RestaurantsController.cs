using AutoMapper;
using EatsAPI.Models;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.DtoModels;
using EatsAPI.Properties;
using EatsAPI.Utility;
using Geocoding;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;

namespace EatsAPI.Controllers
{
	public class RestaurantsController : ApiController
	{
		private EatsContext db = new EatsContext();
		private IGeocoder _geocoder;

		public RestaurantsController(IGeocoder geocoder)
		{
			_geocoder = geocoder;
		}

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

			var addressToGeocode = string.Format("{0}, {1}, {2}", restaurant.Address, restaurant.City, "IL");
			var code = _geocoder.Geocode(addressToGeocode).FirstOrDefault();
			if (code == null)
			{
				//TODO: handle exception
			}
			else
			{
				restaurant.DistanceFromOffice = DistanceHelper.GetDistance(Settings.Default.OfficeLat, Settings.Default.OfficeLng, code.Coordinates.Latitude, code.Coordinates.Longitude);
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

			// Geocode address so we can set the two closest stores
			var addressToGeocode = string.Format("{0}, {1}, {2}", restaurant.Address, restaurant.City, "IL");
			var code = _geocoder.Geocode(addressToGeocode).FirstOrDefault();
			if (code == null)
			{
				//TODO: handle exception
			}
			else
			{
				restaurant.DistanceFromOffice = DistanceHelper.GetDistance(Settings.Default.OfficeLat, Settings.Default.OfficeLng, code.Coordinates.Latitude, code.Coordinates.Longitude);
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