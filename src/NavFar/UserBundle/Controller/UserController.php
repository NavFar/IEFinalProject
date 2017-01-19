<?php

namespace NavFar\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use NavFar\UserBundle\Entity\User;
use Doctrine\ORM;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Session\Session;

class UserController extends Controller
{

  /**
   * @Route("/activate/{username}",name="activation")
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
      if($this->isLoggedIn($request)){
        return  $this->redirectToRoute('home');
      }
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
        if(!$flagError){
      try{
      $newUser = new User();
      $newUser->setUsername($username);
      $newUser->setEmail(strtolower($email));
      $newUser->setPassword($password);
      $newUser->setActive("false");
      $newUser->setImage("default.png");
      $em = $this->getDoctrine()->getManager();
      $em->persist($newUser);
      $em->flush();
    }catch(\Exception $e){
      $flagError=1;
      array_push($ErrorMessage,"نام کاربری یا ایمیل تکراری است."."\n");
    }
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

    /**
    * @Route("/login",name="loginGET")
    * @Method({"GET"})
    */
    public function loginActionGet(Request $request){
        if($this->isLoggedIn($request)){
          return  $this->redirectToRoute('home');
        }
        $email=$request->cookies->get('email');
        $password=$request->cookies->get('password');
        if($email&&$password){
        return $this->render('NavFarUserBundle:User:login.html.twig',array("email"=>$email,
                                                                           "password"=>$password));
        }
        return $this->render('NavFarUserBundle:User:login.html.twig');
    }
    /**
     * @Route("/login",name="loginPOST")
     * @Method({"POST"})
     */
    public function loginActionPost(Request $request){
        $password = $request->request->get('passwd');
        $email = $request->request->get('email');
        $email = strtolower($email);
        $rememberMe= $request->request->get('rememberMe');
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('NavFarUserBundle:User');
        $user=$repository->findOneBy(array('email' => $email, 'password' => $password));
        if(!$user||!$user->getActive()){
          $ErrorMessages =array("نام کاربری یا رمز نادرست است");
          array_push($ErrorMessages,"یا حساب کاربری شما فعال نیست");
          return $this->render('NavFarUserBundle:User:login.html.twig',array('ErrorMessages'=>$ErrorMessages));
        }
        else {
          $response = $this->redirectToRoute('home');
          $session = $request->getSession();
          $session->set('username', $user->getUsername());
          if($rememberMe){
            $response->headers->setCookie(new Cookie("email",$email));
            $response->headers->setCookie(new Cookie("password",$password));
            return $response;
          }
          else{
            return $response;
          }
        }
    }
    public function isLoggedIn($request){
      $session = $request->getSession();
      $username = $session->get('username');
      if($username){
        return true;
      }
      else{
        return false;
      }
    }
    /**
     * @Route("/logout",name="logoutGET")
     * @Method({"GET"})
     */
    public function logoutActionGET(Request $request)
    {
      if($this->isLoggedIn($request)){
        $request->getSession()->remove('username');
      }
      return  $this->redirectToRoute('home');
    }
    /**
     * @Route("/profile/{username}",name="profileGET")
     * @Method({"GET"})
     */
    public function profileActionGET(Request $request,$username)
    {
      $addressGET = $this->generateUrl('profileGET',
                                    array('username' => $username),
                                    UrlGeneratorInterface::ABSOLUTE_URL);
      $addressPOST = $this->generateUrl('profilePOST',
                                    array('username' => $username),
                                    UrlGeneratorInterface::ABSOLUTE_URL);
      $session = $request->getSession();
      $usernameSession = $session->get('username');
      if(!$usernameSession||$usernameSession!=$username){
        return  $this->redirectToRoute('loginGET');
      }
      $em = $this->getDoctrine()->getManager();
      $repository = $em->getRepository('NavFarUserBundle:User');
      $user=$repository->findOneBy(array('username' => $username));
      // dump($user->getImage());
      // die();
      return $this->render('NavFarUserBundle:User:profile.html.twig',array('user'=>$user,'addressGET'=>$addressGET,'addressPOST'=>$addressPOST));
    }
    /**
     * @Route("/profile/{username}",name="profilePOST")
     * @Method({"POST"})
     */
    public function profileActionPOST(Request $request,$username)
    {
      $addressGET = $this->generateUrl('profileGET',
                                    array('username' => $username),
                                    UrlGeneratorInterface::ABSOLUTE_URL);
      $addressPOST = $this->generateUrl('profilePOST',
                                    array('username' => $username),
                                    UrlGeneratorInterface::ABSOLUTE_URL);

      $session = $request->getSession();
      $usernameSession = $session->get('username');
      if(!$usernameSession||$usernameSession!=$username){
        return  $this->redirectToRoute('loginGET');
      }
      $fileName="";
      try{
      $em = $this->getDoctrine()->getManager();
      $repository = $em->getRepository('NavFarUserBundle:User');
      $user=$repository->findOneBy(array('username' => $username));
      $Newusername=$request->request->get('username');
      $Newpassword=$request->request->get('passwd');
      // $avatar=$request->request->get('avatar');
      // $fileName = md5(uniqid()).'.'.$avatar->guessExtension();
      $user->setUsername($Newusername);
      $user->setPassWord($Newpassword);
      $uppercase = preg_match('@[A-Z]@', $Newpassword);
      $lowercase = preg_match('@[a-z]@', $Newpassword);
      $number    = preg_match('@[0-9]@', $Newpassword);
      if(!$uppercase || !$lowercase || !$number || strlen($Newpassword) < 6) {
        throw new \Exception('Bad Password');
      }
      $em->persist($user);
      $em->flush();
      }catch(\Exception $e){
        $oldUser=$repository->findOneBy(array('username' => $username));
        $ErrorMessages=array("اطلاعات وارد شده قابل تغییر نیست");

        return $this->render('NavFarUserBundle:User:profile.html.twig',array('user'=>$oldUser,'addressGET'=>$addressGET,'addressPOST'=>$addressPOST,'ErrorMessages'=>$ErrorMessages));
      }

      $session = $request->getSession();
      $session->set('username', $user->getUsername());
      return  $this->redirectToRoute('profileGET',array('username'=>$Newusername));

    }
}
