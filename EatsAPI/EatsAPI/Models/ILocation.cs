namespace EatsAPI.Models
{
	public interface ILocation
	{
		int Id { get; set; }
		double Lat { get; set; }
		double Lng { get; set; }
	}
}
