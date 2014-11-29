using AutoMapper;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.DtoModels;

namespace EatsAPI
{
	public class AutoMapperConfig
	{
		public static void Register()
		{
			Mapper.CreateMap<Restaurant, RestaurantDto>()
				.ForMember(dest => dest.UserGuid, opt => opt.MapFrom(r => r.CreatedBy.Id));

			Mapper.CreateMap<Rating, RatingDto>();
				//.ForMember(dest => dest.UserId, opt => opt.MapFrom(r => r.CreatedBy.Id));

			Mapper.CreateMap<RatingDto, Rating>()
				.ForMember(dest => dest.Restaurant, opt => opt.Ignore());
				//.ForMember(dest => dest.CreatedBy, opt => opt.Ignore());

			Mapper.CreateMap<Comment, CommentDto>();
				//.ForMember(dest => dest.UserId, opt => opt.MapFrom(r => r.CreatedBy.Id));

			Mapper.CreateMap<CommentDto, Comment>()
				.ForMember(dest => dest.Restaurant, opt => opt.Ignore());
				//.ForMember(dest => dest.CreatedBy, opt => opt.Ignore());
		}
	}
}