<?php

namespace NavFar\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use NavFar\UserBundle\Entity\User;
use Doctrine\ORM;
class UserController extends Controller
{
    /**
     * @Route("/register",name="registerGET")
     * @Method({"GET"})
     */
    public function registerActionGET()
    {
        return $this->render('NavFarUserBundle:User:register.html.twig');
    }
    /**
     * @Route("/register",name="registerPOST")
     * @Method({"POST"})
     */
    public function registerActionPost(Request $request){
      $flagError = false;
      $ErrorMessage=array("درخواست شما با موفقیت همراه نیست.");
      $username=$request->request->get('username');
      $email=$request->request->get('email');
      $password=$request->request->get('passwd');
      $licenseAccept=$request->request->get('AcceptLicense');
      ///////////////////////////////////////////////////////
      if(!$licenseAccept)
        {
          $flagError=true;
          array_push($ErrorMessage,"شما قوانین را قبول نکردید."."\n");
        }
      if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
          $flagError=true;
          array_push($ErrorMessage,"ایمیل شما درست نیست."."\n");
        }
      $uppercase = preg_match('@[A-Z]@', $password);
      $lowercase = preg_match('@[a-z]@', $password);
      $number    = preg_match('@[0-9]@', $password);
      if(!$uppercase || !$lowercase || !$number || strlen($password) < 6) {
          $flagError=true;
          array_push($ErrorMessage,"رمز عبور شما اشکال دارد."."\n");
        }
      try{
      $newUser = new User();
      $newUser->setUsername($username);
      $newUser->setEmail($email);
      $newUser->setPassword($password);
      $em = $this->getDoctrine()->getManager();
      $em->persist($newUser);
      $em->flush();
      $flagError = 0;
    }catch(\Exception $e){
      $flagError=1;
      array_push($ErrorMessage,"نام کاربری یا ایمیل تکراری است."."\n");
    }
      if(!$flagError)//should save the information to session and redirect to homepage
      return $this->render('NavFarUserBundle:User:register.html.twig',array("Error"=>0));
      else
      return $this->render('NavFarUserBundle:User:register.html.twig',array("Error"=>1,
                                                                            "ErrorMessages"=>$ErrorMessage));
    }

}
