﻿using EatsAPI.Models.DBModels;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EatsAPI.Models.DtoModels
{
	public class RestaurantDto
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string Address { get; set; }
		public string Zip { get; set; }
		public string City { get; set; }
		public double Lat { get; set; }
		public double Lng { get; set; }
		public int PriceRangeMin { get; set; }
		public int PriceRangeMax { get; set; }
		public DateTime CreatedDate { get; set; }
		public double DistanceFromOffice { get; set; }
		public string UserGuid { get; set; }

		public double AverageRating
		{
			get
			{
				if (Ratings != null && Ratings.Any())
				{
					return Ratings.Average(r => r.Value);
				}
				return 0.0;
			}
		}
		public List<RatingDto> Ratings { get; set; }
		public List<CommentDto> Comments { get; set; }
	}
}