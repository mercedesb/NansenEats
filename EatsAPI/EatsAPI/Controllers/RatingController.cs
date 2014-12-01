using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using EatsAPI.Models;
using EatsAPI.Models.DtoModels;
using EatsAPI.Models.Utilities;
using AutoMapper;
using EatsAPI.Models.DBModels;
using System;

namespace EatsAPI.Controllers
{
	public class RatingController : ApiController
	{
		private EatsContext db = new EatsContext();

		// GET: api/Rating
		public IHttpActionResult GetRatings()
		{
			var tempRatings = db.Ratings.ToList();
			// GET: api/Restaurants/5
			return Ok(Mapper.Map<List<Rating>, List<RatingDto>>(tempRatings));
		}

		// GET: api/Rating/5
		[ResponseType(typeof(RatingDto))]
		public IHttpActionResult GetRating(int id)
		{
			Rating rating = db.Ratings.Find(id);
			if (rating == null)
			{
				return NotFound();
			}

			return Ok(Mapper.Map<Rating, RatingDto>(rating));
		}

		// PUT: api/Rating/5
		[ResponseType(typeof(void))]
		public IHttpActionResult PutRating(int id, RatingDto ratingDto)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (id != ratingDto.Id)
			{
				return BadRequest();
			}
			Rating rating = Mapper.Map<RatingDto, Rating>(ratingDto);
			
			//TODO: a better way to do this--preferably AutoMapper
			var tempTags = new List<Category>();
			tempTags.AddRange(rating.Tags);
			tempTags.AddRange(ratingDto.TagNames.GetTags(db));

			rating.Tags = tempTags;

			//TODO: a better way to do this--preferably AutoMapper
			rating.Restaurant = db.Restaurants.SingleOrDefault(r => r.Id == ratingDto.RestaurantId);

			db.Entry(rating).State = EntityState.Modified;

			try
			{
				db.SaveChanges();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!RatingExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}
			return Ok(Mapper.Map<Rating, RatingDto>(rating));
		}

		// POST: api/Rating
		[ResponseType(typeof(RatingDto))]
		public IHttpActionResult PostRating(RatingDto ratingDto)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			Rating rating = Mapper.Map<RatingDto, Rating>(ratingDto);

			var tempTags = new List<Category>();
			tempTags.AddRange(rating.Tags);
			tempTags.AddRange(ratingDto.TagNames.GetTags(db));

			rating.Tags = tempTags;
			
			rating.Restaurant = db.Restaurants.SingleOrDefault(r => r.Id == ratingDto.RestaurantId);

			if (rating.Restaurant != null)
			{
				db.Ratings.Add(rating);
				db.SaveChanges();

				return CreatedAtRoute("DefaultApi", new { id = rating.Id }, ratingDto);
			}
			else
			{
				return NotFound();
			}
		}

		// DELETE: api/Rating/5
		[ResponseType(typeof(RatingDto))]
		public IHttpActionResult DeleteRatingDto(int id)
		{
			Rating rating = db.Ratings.Find(id);
			if (rating == null)
			{
				return NotFound();
			}

			db.Ratings.Remove(rating);
			db.SaveChanges();

			return Ok(Mapper.Map<Rating, RatingDto>(rating));
		}

		protected override void Dispose(bool disposing)
		{
			if (disposing)
			{
				db.Dispose();
			}
			base.Dispose(disposing);
		}

		private bool RatingExists(int id)
		{
			return db.Ratings.Count(e => e.Id == id) > 0;
		}
	}
}