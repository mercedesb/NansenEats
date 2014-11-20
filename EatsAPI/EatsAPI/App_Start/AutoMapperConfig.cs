using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.DtoModels;

namespace EatsAPI.App_Start
{
	public class AutoMapperConfig
	{
        public static void Register()
		{
			Mapper.CreateMap<Review, RestaurantReviewDto>();
			Mapper.CreateMap<Restaurant, RestaurantDto>();
				//.ForMember(dest => dest.RestaurantReviews, src;
		}
	}
}