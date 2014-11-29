using System;
using System.Threading.Tasks;
using EatsAPI.Models.DBModels;
using EatsAPI.Models.DtoModels;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EatsAPI.Models.Repository
{
	public class AuthRepository : IDisposable
	{
		private EatsContext _ctx;

		private UserManager<UserProfile> _userManager;

		public AuthRepository()
		{
			_ctx = new EatsContext();
			_userManager = new UserManager<UserProfile>(new UserStore<UserProfile>(_ctx));
		}

		public async Task<IdentityResult> RegisterUser(UserModel userModel)
		{
			UserProfile user = new UserProfile
			{
				UserName = userModel.UserName,
				DisplayName = userModel.DisplayName
			};

			var result = await _userManager.CreateAsync(user, userModel.Password);

			return result;
		}

		public async Task<UserProfile> FindUser(string userName, string password)
		{
			UserProfile user = await _userManager.FindAsync(userName, password);

			return user;
		}

		public void Dispose()
		{
			_ctx.Dispose();
			_userManager.Dispose();

		}
	}
}