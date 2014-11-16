using AutoMapper;
using StructureMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EatsAPI.Web.App_Start
{
	public static class AutoMapperBootstrapper
	{
		private static readonly IConfiguration cfg = ObjectFactory.GetInstance<IConfiguration>();

		public static void Initialize()
		{
			cfg.AddProfile<AutoMapperProfile>();
		}

		public class AutoMapperProfile : Profile
		{
			protected override void Configure()
			{
				//CreateMap<SomeEntity, SomeViewModel>();
			}
		}
	}
}