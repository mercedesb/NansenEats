using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EatsAPI.Models.Repository
{
	interface IEditableRepository<T> : IRepository<T>
	{
		void Insert(T entity);
		void Delete(T entity);
	}
}
