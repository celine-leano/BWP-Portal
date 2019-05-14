<?php
/**
 * Routing for BWP Portal
 *
 * Created By: Jordan Smith, Brooks Eshe, Sam Gabriel, Celine Leano
 */

//Turn on error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'vendor/autoload.php';

session_start();

//Create an instance of the Base class
$f3 = Base::instance();

//Turn on Fat-Free error reporting
$f3->set('DEBUG', 3);

//Define a default route
$f3->route('GET|POST /', function ($f3)
{
    if (isset($_POST['email-input']) && isset($_POST['password-input']))
    {

        $email = $_POST['email-input'];
        $password = $_POST['password-input'];

        /*************************
         Temporary login validation
         **************************/
        if ($email == 'admin' && $password == 'admin')
        {
            $_SESSION['user'] = 'admin';
            $f3->reroute("/dashboard");
        }

    }

    echo Template::instance()->render('views/login.html');
});

//dashboard route
$f3->route('GET|POST /dashboard', function ($f3)
{
    //reroute to login page if not yet logged in
    if (!isset($_SESSION['user']))
    {
        $f3->reroute('/');
    }

    echo Template::instance()->render('views/dashboard.html');
});

// test symptoms
$f3->route('GET|POST /symptoms', function ($f3)
{
    echo Template::instance()->render('views/symptoms-test.html');
});


//Run fat free
$f3->run();