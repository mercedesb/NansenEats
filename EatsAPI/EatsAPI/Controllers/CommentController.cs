using AutoMapper;
using EatsAPI.Models;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.DtoModels;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;

namespace EatsAPI.Controllers
{
	public class CommentController : ApiController
	{
		private EatsContext db = new EatsContext();

		// GET: api/Comment
		public IHttpActionResult GetCommentDtoes()
		{
			var tempComments = db.Comments.ToList();
			return Ok(Mapper.Map<List<Comment>, List<CommentDto>>(tempComments));
		}

		// GET: api/Comment/5
		[ResponseType(typeof(CommentDto))]
		public IHttpActionResult GetComment(int id)
		{
			Comment comment = db.Comments.Find(id);
			if (comment == null)
			{
				return NotFound();
			}

			return Ok(Mapper.Map<Comment, CommentDto>(comment));
		}

		// PUT: api/Comment/5
		[ResponseType(typeof(void))]
		public IHttpActionResult PutComment(int id, CommentDto commentDto)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (id != commentDto.Id)
			{
				return BadRequest();
			}

			Comment comment = Mapper.Map<CommentDto, Comment>(commentDto);
			comment.Restaurant = db.Restaurants.SingleOrDefault(r => r.Id == commentDto.RestaurantId);
			db.Entry(comment).State = EntityState.Modified;

			try
			{
				db.SaveChanges();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!CommentExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return Ok(Mapper.Map<Comment, CommentDto>(comment));
		}

		// POST: api/Comment
		[ResponseType(typeof(CommentDto))]
		public IHttpActionResult PostComment(CommentDto commentDto)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			Comment comment = Mapper.Map<CommentDto, Comment>(commentDto);
			comment.Restaurant = db.Restaurants.SingleOrDefault(r => r.Id == commentDto.RestaurantId);

			if (comment.Restaurant != null)
			{
				db.Comments.Add(comment);
				db.SaveChanges();
				return CreatedAtRoute("DefaultApi", new { id = commentDto.Id }, commentDto);
			}
			else
			{
				return NotFound();
			}
		}

		// DELETE: api/Comment/5
		[ResponseType(typeof(CommentDto))]
		public IHttpActionResult DeleteComment(int id)
		{
			Comment comment = db.Comments.Find(id);
			if (comment == null)
			{
				return NotFound();
			}

			CommentDto commentDto = Mapper.Map<Comment, CommentDto>(comment);

			db.Comments.Remove(comment);
			db.SaveChanges();

			return Ok(commentDto);
		}

		protected override void Dispose(bool disposing)
		{
			if (disposing)
			{
				db.Dispose();
			}
			base.Dispose(disposing);
		}

		private bool CommentExists(int id)
		{
			return db.Comments.Count(e => e.Id == id) > 0;
		}
	}
}