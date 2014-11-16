using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace EatsAPI.Models.Repository
{
	public interface IRepository<T>
	{
		IQueryable<T> Find(Expression<Func<T, bool>> predicate);
		IQueryable<T> Get();
		T Get(int id);
	}
}
