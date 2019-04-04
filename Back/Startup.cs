using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using System.IO;
using Owin;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using IHostingEnvironment = Microsoft.Extensions.Hosting.IHostingEnvironment;
using ServiceReference2;
using Microsoft.Extensions.Hosting;



namespace Back
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.Use((context, next) =>
            {
                TextWriter output = context.Get<TextWriter>("host.TraceOutput");
                return next().ContinueWith(result =>
                {
                    output.WriteLine("Scheme {0} : Method {1} : Path {2} : MS {3}",
                    context.Request.Scheme, context.Request.Method, context.Request.Path, getTime());
                });
            });

            app.Run(async (context) =>
            {
                var client = new ConexionWCFClient();
                var response = await client.MostrarMensajeAsync();
                await context.Response.WriteAsync(response);
            });
        }

        string getTime()
        {
            return DateTime.Now.Millisecond.ToString();
        }

    }
}