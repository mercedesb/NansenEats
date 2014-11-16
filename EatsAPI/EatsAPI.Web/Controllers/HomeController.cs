using EatsAPI.Models.DBModels;
using EatsAPI.Models.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EatsAPI.Web.Controllers
{
	public class HomeController : Controller
	{
		IRepository<Restaurant> _repo;

		public HomeController(IRepository<Restaurant> repo)
		{
			_repo = repo;
		}

		public ActionResult Index()
		{
			var model = _repo.Get();
			return View(model);
		}

		public ActionResult About()
		{
			ViewBag.Message = "Your application description page.";

			return View();
		}

		public ActionResult Contact()
		{
			ViewBag.Message = "Your contact page.";

			return View();
		}
	}
}