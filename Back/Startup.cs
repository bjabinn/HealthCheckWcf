using System;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using IHostingEnvironment = Microsoft.Extensions.Hosting.IHostingEnvironment;
using ServiceReference2;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore;

namespace Back
{
    public class Startup
    {



        string getTime()
        {
            return DateTime.Now.Millisecond.ToString();
        }


    }
}