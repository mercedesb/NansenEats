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
		protected IList<Category> _defaultCategories;
		protected IList<Restaurant> _defaultRestaurants;
		protected IList<Review> _defaultReviews;

		protected override void Seed(EatsContext context)
		{
			SeedCategories();
			SeedRestaurants();
			SeedReviews();

			foreach (Category category in _defaultCategories)
				context.Categories.Add(category);

			foreach (Review review in _defaultReviews)
				context.Reviews.Add(review);

			foreach (Restaurant restaurant in _defaultRestaurants)
				context.Restaurants.Add(restaurant);

			context.SaveChanges();

			for (int i = 0; i < _defaultReviews.Count; i++)
			{
				var restaurantIndex = i % 5;
				_defaultRestaurants.ElementAt(restaurantIndex).RestaurantReviews.Add(_defaultReviews.ElementAt(i));
			}

			context.SaveChanges();

			base.Seed(context);
		}

		private void SeedCategories()
		{
			_defaultCategories = new List<Category>();

			_defaultCategories.Add(new Category() { CategoryId = 1, Name = "Close", Description = "Close to the office, good for quick eats" });
			_defaultCategories.Add(new Category() { CategoryId = 2, Name = "Healthy", Description = "Good healthy eats options" });
			_defaultCategories.Add(new Category() { CategoryId = 3, Name = "Cheap", Description = "Great inexpensive food options" });
		}

		private void SeedRestaurants()
		{
			_defaultRestaurants = new List<Restaurant>();

			_defaultRestaurants.Add(new Restaurant()
			{
				RestaurantId = 1,
				Name = "Bari",
				Address = "1120 W Grand Ave",
				City = "Chicago",
				Zip = "60642",
				CreatedDate = DateTime.Now,
				PriceRangeMin = 5,
				PriceRangeMax = 10
			});

			_defaultRestaurants.Add(new Restaurant()
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

			_defaultRestaurants.Add(new Restaurant()
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

			_defaultRestaurants.Add(new Restaurant()
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

			_defaultRestaurants.Add(new Restaurant()
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
		}
	
		private void SeedReviews()
		{
			_defaultReviews = new List<Review>();

			_defaultReviews.Add(new Review
			{
				Comment = new Comment { Value = "So good! And cheap!", CreatedDate = DateTime.Now },
				Rating = new Rating { Value = 10, CreatedDate = DateTime.Now }
			});
			_defaultReviews.Add(new Review
			{
				Comment = new Comment { Value = "Blech, don't waste your time", CreatedDate = DateTime.Now },
				Rating = new Rating { Value = 2, CreatedDate = DateTime.Now }
			});
			_defaultReviews.Add(new Review
			{
				Comment = new Comment { Value = "Better than Jimmy John's and they deliver", CreatedDate = DateTime.Now },
				Rating = new Rating { Value = 7, CreatedDate = DateTime.Now }
			});
			_defaultReviews.Add(new Review
			{
				Comment = new Comment { Value = "Super fast, great when you need a quick bite", CreatedDate = DateTime.Now },
				Rating = new Rating { Value = 7, CreatedDate = DateTime.Now }
			});
			_defaultReviews.Add(new Review
			{
				Comment = new Comment { Value = "So so", CreatedDate = DateTime.Now },
				Rating = new Rating { Value = 5, CreatedDate = DateTime.Now }
			});
			_defaultReviews.Add(new Review
			{
				Comment = new Comment { Value = "I've had worse", CreatedDate = DateTime.Now },
				Rating = new Rating { Value = 6, CreatedDate = DateTime.Now }
			});
			_defaultReviews.Add(new Review
			{
				Comment = new Comment { Value = "This place is Amazeballs!!!", CreatedDate = DateTime.Now },
				Rating = new Rating { Value = 10, CreatedDate = DateTime.Now }
			});
		}
	}
}