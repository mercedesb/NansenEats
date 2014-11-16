using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using StructureMap.Configuration.DSL;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.Repository;
using AutoMapper.Mappers;
using EatsAPI.Models;

namespace EatsAPI.Web.App_Start
{
	public class AutomapperRegistry : Registry
	{
		public AutomapperRegistry()
		{
			For<IRepository<Restaurant>>().Use<BaseEditableRepository<Restaurant>>().Ctor<EatsContext>();
			For<IRepository<Review>>().Use<BaseEditableRepository<Review>>().Ctor<EatsContext>();
			For<IRepository<Category>>().Use<BaseReadOnlyRepository<Category>>().Ctor<EatsContext>();
		}
	}
}