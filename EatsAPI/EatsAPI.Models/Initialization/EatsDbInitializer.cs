using EatsAPI.Models.DBModels;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace EatsAPI.Models.Initialization
{
	public class EatsDbInitializer : DropCreateDatabaseAlways<EatsContext>
	{
		protected override void Seed(EatsContext context)
		{
			IList<Category> defaultCategories = new List<Category>();

			defaultCategories.Add(new Category() { CategoryId = 1, Name = "Close", Description = "Close to the office, good for quick eats" });
			defaultCategories.Add(new Category() { CategoryId = 2, Name = "Healthy", Description = "Good healthy eats options" });
			defaultCategories.Add(new Category() { CategoryId = 3, Name = "Cheap", Description = "Great inexpensive food options" });

			foreach (Category category in defaultCategories)
				context.Categories.Add(category);

			IList<Restaurant> defaultRestaurants = new List<Restaurant>();

			defaultRestaurants.Add(new Restaurant() { 
				RestaurantId = 1, 
				Name = "Bari", 
				Address= "1120 W Grand Ave", 
				City = "Chicago", 
				Zip = "60642", 
				CreatedDate = DateTime.Now, 
				PriceRangeMin = 5, 
				PriceRangeMax = 10 });

			defaultRestaurants.Add(new Restaurant()
			{
				RestaurantId = 2,
				Name = "Au Cheval",
				Address = "800 W Randolph St",
				City = "Chicago",
				Zip = "60607",
				CreatedDate = DateTime.Now,
				PriceRangeMin = 10,
				PriceRangeMax = 20
			});

			defaultRestaurants.Add(new Restaurant()
			{
				RestaurantId = 3,
				Name = "Haymarket",
				Address = "737 W Randolph St",
				City = "Chicago",
				Zip = "60661",
				CreatedDate = DateTime.Now,
				PriceRangeMin = 10,
				PriceRangeMax = 20
			});

			defaultRestaurants.Add(new Restaurant()
			{
				RestaurantId = 4,
				Name = " D’amato’s Bakery",
				Address = "1124 W Grand Ave",
				City = "Chicago",
				Zip = "60642",
				CreatedDate = DateTime.Now,
				PriceRangeMin = 5,
				PriceRangeMax = 10
			});

			defaultRestaurants.Add(new Restaurant()
			{
				RestaurantId = 5,
				Name = "Pizzeria Del Mercato",
				Address = "1154 W Fulton Market",
				City = "Chicago",
				Zip = "60607",
				CreatedDate = DateTime.Now,
				PriceRangeMin = 10,
				PriceRangeMax = 15
			});

			foreach (Restaurant restaurant in defaultRestaurants)
				context.Restaurants.Add(restaurant);

			base.Seed(context);
		}
	}
}