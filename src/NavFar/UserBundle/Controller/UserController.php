<?php

namespace NavFar\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class UserController extends Controller
{
    /**
     * @Route("/register",name="register")
     * 
     */
    public function registerAction()
    {
        return $this->render('NavFarUserBundle:User:register.html.twig');
    }
}
