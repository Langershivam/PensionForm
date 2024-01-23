using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using pensionForm.Models;

namespace pensionForm.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }
    public IActionResult form()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [HttpPost]
    public IActionResult FormData(string data){
        TempData["FormData"]=data;
        return Json(new{success=true});
    }
    public IActionResult Display(){
        var FormData=TempData["FormData"] as Dictionary<string,string>;
        return View();
    }

    

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
