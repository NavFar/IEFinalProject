<?php

namespace NavFar\UtilityBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

class UtilityController extends Controller
{
    /**
     * @Route("/emailchecker",name="emailChecker")
     * @method({"POST"})
     */
    public function emailCheckerAction(Request $request)
    {
      $email=$request->request->get('email', ' ');
      if(filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return $this->json(array('ok' => 'true'));
      }
      else{
      return $this->json(array('ok' => 'false'));
      }
    }

    /**
     * @Route("/passwordchecker",name="passwordChecker")
     * @method({"POST"})
     */
    public function passwordCheckerAction(Request $request)
    {
      $password=$request->request->get('passwd', ' ');
      $uppercase = preg_match('@[A-Z]@', $password);
      $lowercase = preg_match('@[a-z]@', $password);
      $number    = preg_match('@[0-9]@', $password);
      if(!$uppercase || !$lowercase || !$number || strlen($password) < 6) {
        return $this->json(array('ok' => 'false','passwd'=>$number));
      }
      else
        return $this->json(array('ok' => 'true'));

    }
}
