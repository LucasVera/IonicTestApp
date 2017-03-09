using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ionicTestAppServer.Controllers
{
    public class AuthController : ApiController
    {

        public IHttpActionResult Get()
        {
            try
            {

            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, new { customMsg = ex.Message });
            }

            return Content(HttpStatusCode.BadRequest, new { });
        }

    }
}
