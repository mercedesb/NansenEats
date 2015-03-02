using EatsAPI.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EatsAPI.Utility
{
	/// <summary>
	/// Static helper class for getting distances and converting rad/degrees.
	/// </summary>
	public static class DistanceHelper
	{
		/// <summary>
		/// Convert from Degrees to Radians
		/// </summary>
		/// <param name="num">(double) degrees</param>
		/// <returns></returns>
		private static double ToRad(this double num)
		{
			return num * Math.PI / 180;
		}

		/// <summary>
		/// Convert from Radians to Degrees
		/// </summary>
		/// <param name="num">(double) radian</param>
		/// <returns></returns>
		private static double ToDeg(this double num)
		{
			return num * 180 / Math.PI;
		}

		/// <summary>
		/// Gets the distance between lat1/lon1 and lat2/lat2.
		/// </summary>
		/// <param name="lat1">The lat1.</param>
		/// <param name="lon1">The lon1.</param>
		/// <param name="lat2">The lat2.</param>
		/// <param name="lon2">The lon2.</param>
		/// <returns></returns>
		public static double GetDistance(double lat1, double lon1, double lat2, double lon2)
		{
			const int r = 3963; // radius of earth in miles

			// Convert to Radians
			lat1 = lat1.ToRad();
			lon1 = lon1.ToRad();
			lat2 = lat2.ToRad();
			lon2 = lon2.ToRad();

			// Spherical Law of Cosines
			var resultCos =
				 Math.Acos(
					  Math.Sin(lat1) * Math.Sin(lat2) +
					  Math.Cos(lat1) * Math.Cos(lat2) * Math.Cos(lon2 - lon1)
					  ) * r;

			return resultCos;
		}

		/// <summary>
		/// Gets the closest point.
		/// </summary>
		/// <param name="originLat">The origin lat.</param>
		/// <param name="originLong">The origin long.</param>
		/// <param name="points">The points.</param>
		/// <returns>An ILocation of the closest point (or null)</returns>
		public static ILocation GetClosestPoint(double originLat, double originLong, IEnumerable<ILocation> points)
		{
			// Build a List<Distance> that contains the calculated distance for each point
			var list = points.Select(p => new Distance(p, GetDistance(originLat, originLong, p.Lat, p.Lng))).ToList();

			if (!list.Any())
				return null;

			// Sort the List using the custom IComparable implementation to sort by Distance.Miles
			list.Sort();

			return list.First();
		}

		/// <summary>
		/// Gets the closest points.
		/// </summary>
		/// <param name="originLat">The origin lat.</param>
		/// <param name="originLong">The origin long.</param>
		/// <param name="locations">The locations.</param>
		/// <returns>A list of Distances sorted by the closest first (or null)</returns>
		public static List<Distance> GetClosestPoints(double originLat, double originLong, IEnumerable<ILocation> locations)
		{
			// Build a List<Distance> that contains the calculated distance for each point
			var list = locations
					.Select(p => new Distance(p, GetDistance(originLat, originLong, p.Lat, p.Lng)))
					.ToList();
				//.Where(d => d.Miles >= 0).ToList();

			if (!list.Any())
				return null;

			// Sort the List using the custom IComparable implementation to sort by Distance.Miles
			list.Sort();

			return list;
		}
	}

	/// <summary>
	/// 
	/// </summary>
	public class Distance : IComparable, ILocation
	{
		/// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>
		/// The identifier.
		/// </value>
		public int Id { get; set; }
		/// <summary>
		/// Gets or sets the miles.
		/// </summary>
		/// <value>
		/// The miles.
		/// </value>
		public double Miles { get; set; }
		/// <summary>
		/// Gets or sets the latitude.
		/// </summary>
		/// <value>
		/// The lat.
		/// </value>
		public double Lat { get; set; }
		/// <summary>
		/// Gets or sets the longitude.
		/// </summary>
		/// <value>
		/// The LNG.
		/// </value>
		public double Lng { get; set; }

		/// <summary>
		/// Initializes a new instance of the <see cref="Distance"/> class.
		/// </summary>
		/// <param name="iLocation">The ILocation.</param>
		/// <param name="miles">The miles.</param>
		public Distance(ILocation iLocation, double miles)
		{
			Id = iLocation.Id;
			Lat = iLocation.Lat;
			Lng = iLocation.Lng;
			Miles = miles;
		}

		// Compare Miles for sorting
		/// <summary>
		/// Compares the current instance with another object of the same type and returns an integer that indicates whether the current instance precedes, follows, or occurs in the same position in the sort order as the other object.
		/// </summary>
		/// <param name="obj">An object to compare with this instance.</param>
		/// <returns>
		/// A value that indicates the relative order of the objects being compared. The return value has these meanings: Value Meaning Less than zero This instance precedes <paramref name="obj" /> in the sort order. Zero This instance occurs in the same position in the sort order as <paramref name="obj" />. Greater than zero This instance follows <paramref name="obj" /> in the sort order.
		/// </returns>
		public int CompareTo(object obj)
		{
			var d = (Distance)obj;
			return Miles.CompareTo(d.Miles);
		}
	}
}