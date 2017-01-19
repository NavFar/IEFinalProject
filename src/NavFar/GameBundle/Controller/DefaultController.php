<?php

namespace NavFar\GameBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('NavFarGameBundle:Default:index.html.twig');
    }
}
