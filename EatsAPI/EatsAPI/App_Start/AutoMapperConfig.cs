using AutoMapper;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.DtoModels;
using System.Linq;

namespace EatsAPI
{
	public class AutoMapperConfig
	{
		public static void Register()
		{
			Mapper.CreateMap<Restaurant, RestaurantDto>()
				.ForMember(dest => dest.UserGuid, opt => opt.MapFrom(r => r.CreatedBy.Id));

			Mapper.CreateMap<Rating, RatingDto>()
				.ForMember(dest => dest.RestaurantId, opt => opt.MapFrom(r => r.Restaurant.Id))
				.ForMember(dest => dest.Tags, opt => opt.MapFrom(r => r.Tags));
			
				//.ForMember(dest => dest.UserId, opt => opt.MapFrom(r => r.CreatedBy.Id));

			Mapper.CreateMap<RatingDto, Rating>()
				.ForMember(dest => dest.Restaurant, opt => opt.Ignore())
				.ForMember(dest => dest.Tags, opt => opt.MapFrom(r => r.Tags));
				//.ForMember(dest => dest.CreatedBy, opt => opt.Ignore());

			Mapper.CreateMap<Comment, CommentDto>()
				.ForMember(dest => dest.RestaurantId, opt => opt.MapFrom(c => c.Restaurant.Id));
				//.ForMember(dest => dest.UserId, opt => opt.MapFrom(r => r.CreatedBy.Id));

			Mapper.CreateMap<CommentDto, Comment>()
				.ForMember(dest => dest.Restaurant, opt => opt.Ignore());
				//.ForMember(dest => dest.CreatedBy, opt => opt.Ignore());

			Mapper.CreateMap<UserProfile, UserModel>()
				.ForMember(dest => dest.Password, opt => opt.Ignore())
				.ForMember(dest => dest.ConfirmPassword, opt => opt.Ignore());
		}
	}
}