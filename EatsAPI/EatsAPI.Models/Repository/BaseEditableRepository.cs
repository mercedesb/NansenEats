using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EatsAPI.Models.Repository
{
	public class BaseEditableRepository<T> : BaseReadOnlyRepository<T>, IEditableRepository<T> where T : class
	{
		public void Insert(T entity)
		{
			_dbContext.Set<T>().Add(entity);
			_dbContext.SaveChanges();
		}

		public void Delete(T entity)
		{
			_dbContext.Set<T>().Remove(entity);
			_dbContext.SaveChanges();
		}
	}
}