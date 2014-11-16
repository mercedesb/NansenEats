using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Web;

namespace EatsAPI.Models.Repository
{
	public class BaseReadOnlyRepository<T> : IRepository<T> where T : class
	{
		protected readonly DbContext _dbContext;

		public BaseReadOnlyRepository()
		{
			_dbContext = new EatsContext();
		}

		public IQueryable<T> Find(Expression<Func<T, bool>> predicate)
		{
			return _dbContext.Set<T>().Where(predicate);
		}

		public IQueryable<T> Get()
		{
			return _dbContext.Set<T>();
		}

		public T Get(int id)
		{
			return _dbContext.Set<T>().Find(id);
		}
	}
}
