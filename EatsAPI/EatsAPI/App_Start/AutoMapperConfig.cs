using AutoMapper;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.DtoModels;

namespace EatsAPI.App_Start
{
	public class AutoMapperConfig
	{
		public static void Register()
		{
			Mapper.CreateMap<Restaurant, RestaurantDto>();
			Mapper.CreateMap<Rating, RatingDto>();
			//Mapper.CreateMap<RatingDto, Rating>();
			Mapper.CreateMap<Comment, CommentDto>();
		}
	}
}