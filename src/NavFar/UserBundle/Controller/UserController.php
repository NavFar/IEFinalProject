<?php

namespace NavFar\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use NavFar\UserBundle\Entity\User;
use Doctrine\ORM;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class UserController extends Controller
{

  /**
   * @Route("/active/{username}",name="activation")
   * @Method({"GET"})
   */
  public function activationAction($username)
  {
    try{

      $em = $this->getDoctrine()->getManager();
      $repository = $em->getRepository('NavFarUserBundle:User');
      $user=$repository->findOneByUsername($username);
      if(!$user)
      throw new \Exception('user not found');
      $user->setActive(1);
      $em->flush();
    }catch(\Exception $e){
      return $this->render('NavFarUserBundle:User:activation.html.twig',array("error"=>1));
    }
      return $this->render('NavFarUserBundle:User:activation.html.twig');
  }
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
      $newUser->setEmail(strtolower($email));
      $newUser->setPassword($password);
      $newUser->setActive("false");
      $em = $this->getDoctrine()->getManager();
      $em->persist($newUser);
      $em->flush();
    }catch(\Exception $e){
      $flagError=1;
      array_push($ErrorMessage,"نام کاربری یا ایمیل تکراری است."."\n");
    }
      if(!$flagError){

        $address = $this->generateUrl('activation',
                                      array('username' => $username),
                                      UrlGeneratorInterface::ABSOLUTE_URL);

        $message = \Swift_Message::newInstance()
                ->setSubject('Activation')
                ->setFrom('navidfarahmand75@gmail.com')
                ->setTo($email)
                ->setBody(
                    $this->renderView(
                        'NavFarUserBundle:Email:activate.html.twig',
                        array("username"=>$username,
                              "address"=>$address)
                    )
                )
            ;
            $this->get('mailer')->send($message);
      return $this->render('NavFarUserBundle:User:register.html.twig',array("In"=>1));
    }
      else
      return $this->render('NavFarUserBundle:User:register.html.twig',array("Error"=>1,
                                                                            "ErrorMessages"=>$ErrorMessage));
    }

}
