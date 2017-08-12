<?php

namespace NavFar\GameBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use NavFar\GameBundle\Entity\Game;
use NavFar\GameBundle\Entity\Score;
use NavFar\GameBundle\Entity\Comments;
use NavFar\GameBundle\Entity\Category;
use NavFar\GameBundle\Entity\Categorize;
use Doctrine\ORM;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Session\Session;

class GameController extends Controller
{
    /**
    * @Route("/games/{gameName}/info.json",name="gameInfo")
    * @Route("/games/{gameName}/header.json",name="gameHeader")
    */
    public function infoAction(Request $request,$gameName)
    {
        $baseURL=$this->getParameter('game_image_directory');
        $em = $this->getDoctrine()->getManager();
        $repository = $em->getRepository('NavFarGameBundle:Game');
        $game = $repository->findOneBy(
              array('title'=>$gameName));
        if(!$game){
          return $this->json(array("response" =>
                    array(
                            "ok"=>true,
                            "result"=>array("game"=>null))));
        }
        return $this->json(array("response" =>
                  array(
                          "ok"=>true,
                          "result"=>array("game"=>$game->toArray($baseURL)))));
    }
    /**
    * @Route("/games/{gameName}/leaderboard.json",name="gameLeaderboard")
    */
    public function leaderboardAction(Request $request,$gameName)
    {
      $em = $this->getDoctrine()->getManager();
      $gameRepository = $em->getRepository('NavFarGameBundle:Game');
      $game = $gameRepository->findOneBy(
            array('title'=>$gameName));
      if(!$game){
        return $this->json(array("response" =>
                  array(
                          "ok"=>true,
                          "result"=>array("leaderboard"=>array()))));
      }

      // $game = new Game();
      $scoreRepository =$em->getRepository('NavFarGameBundle:Score');
      $highScores=$scoreRepository->findBy(
      array('game'=>$game),
      array('amount'=>'DESC'),
      10,
      0
      );
      $session = $request->getSession();
      $username = $session->get('username',"");
      $flag=false;
      $highScoreArray=array();
      $baseURL=$this->getParameter('avatar_directory');
      for($i=0;$i<sizeof($highScores);$i++){
        $highScoreArray[]=$highScores[$i]->toArray($baseURL);
        if($highScores[$i]->getUser()->getUsername()==$username)
        $flag=true;
      }
      if($flag){
        $userRepository=$em->getRepository('NavFarUserBundle:User');
        $user = $userRepository->findOneBy(
        array('username'=>$username));
        $userScore=$scoreRepository->findOneBy(
        array('game'=>$game,'user'=>$user));
      if(!$userScore){
        $highScoreArray[]=$userScore->toArray($baseURL);
      }
      }
      return $this->json(array("response" =>
                      array(
                          "ok"=>true,
                          "result"=>array("leaderboard"=>$highScoreArray))));

    }

    /**
    * @Route("/games/{gameName}/comments.json",name="gamecommentGET")
    * @Method({"GET"})
    */
    public function commentAction(Request $request,$gameName){
      $offset = $request->query->get("offset",0);
      $em = $this->getDoctrine()->getManager();
      $gameRepository = $em->getRepository('NavFarGameBundle:Game');
      $game = $gameRepository->findOneBy(
            array('title'=>$gameName));
      if(!$game){
        return $this->json(array("response" =>
                  array(
                          "ok"=>true,
                          "result"=>array("comments"=>array()))));
      }
      $commentsRepository=$em->getRepository('NavFarGameBundle:Comments');
      $comments=$commentsRepository->findBy(array('game'=>$game),
                                            array('id'=>'DESC'),
                                            10,
                                            $offset);
      $commentsArray=array();
      $avatarURL=$this->getParameter('avatar_directory');
      $imageURL=$this->getParameter('game_image_directory');
      for($i=0;$i<sizeof($comments);$i++){
        $commentsArray[]=$comments[$i]->toArray($avatarURL,$imageURL);
      }
      return $this->json(array("response" =>
                array(
                        "ok"=>true,
                        "result"=>array("comments"=>$commentsArray))));

    }
    /**
    * @Route("/games/{gameName}/related_games.json",name="relatedGames")
    * @Method({"GET"})
    */
    public function relatedGamesAction(Request $request,$gameName){
      $em = $this->getDoctrine()->getManager();
      $gameRepository = $em->getRepository('NavFarGameBundle:Game');
      $game = $gameRepository->findOneBy(
            array('title'=>$gameName));
      if(!$game){
        return $this->json(array("response" =>
                  array(
                          "ok"=>true,
                          "result"=>array("games"=>array()))));
      }
      $categorizes=$game->getCategorizes();
      $resultGames= array();
      for($i=0;$i<sizeof($categorizes);$i++){
        for($j=0;$j<sizeof($categorizes[$i]->getCategory()->getCategorizes());$j++){
          $tempId=$categorizes[$i]->getCategory()->getCategorizes()[$j]->getGame()->getId();
          $resultGames[$tempId]=$categorizes[$i]->getCategory()->getCategorizes()[$j]->getGame();
        }
      }
      unset($resultGames[$game->getId()]);
      $imageURL=$this->getParameter('game_image_directory');
      $resultGamesArray=array();
      foreach($resultGames as $x => $x_value) {
          $resultGamesArray[]=$x_value->toArray($imageURL);
      }
      return $this->json(array("response" =>
                array(
                        "ok"=>true,
                        "result"=>array("games"=>$resultGamesArray))));
    }
    /**
    * @Route("/game_list.json",name="searchGames")
    * @Method({"GET"})
    */
    public function searchGamesAction(Request $request){
      $search = $request->query->get("q","");
      if($search=="")
      {
        return $this->json(array("response" =>
                  array(
                          "ok"=>true,
                          "result"=>array("games"=>array()))));
      }
      $em = $this->getDoctrine()->getManager();
      $gameRepository = $em->getRepository('NavFarGameBundle:Game');
      $games=$gameRepository->getSimilarNameGame($search);
      $gamesArray = array();
      $imageURL=$this->getParameter('game_image_directory');
      for($i=0;$i<sizeof($games);$i++){
        $gamesArray[]=$games[$i]->toArray($imageURL);
      }
      return $this->json(array("response" =>
                array(
                        "ok"=>true,
                        "result"=>array("games"=>$gamesArray))));
    }
    /**
    * @Route("/home.json",name="homeJson")
    * @Method({"GET"})
    */
    public function homeGamesAction(Request $request){
      $em = $this->getDoctrine()->getManager();
      $categoryRepository = $em->getRepository('NavFarGameBundle:Category');
      $games=$categoryRepository->maxRateGameCategory();
      $gamesArray=array();
      $tempArray=array();
      $imageURL=$this->getParameter('game_image_directory');
      for($i=0;$i<sizeof($games);$i++){
        if(!$games[$i])
          continue;
        $tempArray[$games[$i]->getId()]=$games[$i]->toArray($imageURL);
      }
      foreach($tempArray as $x => $x_value) {
        $gamesArray[]=$x_value;
      }

      $gameRepository=  $em->getRepository('NavFarGameBundle:Game');
      $newGames=$gameRepository->getNewGames();
      $newGamesArray = array();
      for($i=0;$i<sizeof($newGames);$i++){
        $newGamesArray[]=$newGames[$i]->toArray($imageURL);
      }
      $avatarURL=$this->getParameter('avatar_directory');
      $commentsRepository=$em->getRepository('NavFarGameBundle:Comments');
      $newComments=$commentsRepository->getLastComments();
      $newCommentsArray = array();
      for($i=0;$i<sizeof($newComments);$i++){
        $newCommentsArray[]=$newComments[$i]->toArray($avatarURL,$imageURL);
      }

      return $this->json(array("response" =>
                array(
                        "ok"=>true,
                        "result"=>array("homepage"=>array("slider"=>$gamesArray,"new_games"=>$newGamesArray,
                        "comments"=>$newCommentsArray)))));
    }
    /**
    * @Route("/categories.json",name="catgoriesJson")
    * @Method({"GET"})
    */
    public function categoriesAction(Request $request){
      $em = $this->getDoctrine()->getManager();
      $categoryRepository = $em->getRepository('NavFarGameBundle:Category');
      $categories =  $categoryRepository->findBy(array());
      $categoriesArray=array();
      for($i=0;$i<sizeof($categories);$i++){
        $categoriesArray[]=$categories[$i]->getName();
      }
      return $this->json(array("response" =>
                        array(
                        "ok"=>true,
                        "result"=>array("categories"=>$categoriesArray))));
    }

    /**
    * @Route("/home",name="home")
    * @Method({"GET"})
    */
    public function homeAction(Request $request)
    {
      $session = $request->getSession();
      $username = $session->get('username',null);
      return $this->render('NavFarGameBundle:Game:home.html.twig',array('username'=>$username));
    }
    /**
    * @Route("/games",name="games")
    * @Method({"GET"})
    */
    public function gamesAction(Request $request)
    {
      $session = $request->getSession();
      $username = $session->get('username',null);
      return $this->render('NavFarGameBundle:Game:games.html.twig',array('username'=>$username));
    }
    /**
    * @Route("/game_list",name="gameSearch")
    * @Method({"GET"})
    */
    public function gameListAction(Request $request)
    {
      $session = $request->getSession();
      $username = $session->get('username',null);
      return $this->render('NavFarGameBundle:Game:game_list.html.twig',array('username'=>$username));
    }
    /**
    * @Route("/play/{gameName}",name="gamePlay")
    * @Method({"GET"})
    */
    public function gamePlayAction(Request $request,$gameName){
      $session = $request->getSession();
      $username = $session->get('username',null);
      if(!$username){
        return  $this->redirectToRoute('loginGET');
      }
      return $this->render('NavFarGameBundle:Game:'.$gameName.'.html.twig');
    }
    /**
    * @Route("/save/{gameName}",name="saveResult")
    * @Method({"POST"})
    */
    public function gameSaveAction(Request $request,$gameName){
      $session = $request->getSession();
      $username = $session->get('username',null);
      $score = $request->request->get('score',null);
      $flag = false;
      try{
        if(!$username||$gameName==""||!$score)
          throw new \Exception ("Bad Request1");
        $em = $this->getDoctrine()->getManager();
        $userRepository=$em->getRepository("NavFarUserBundle:User");
        $gameRepository=$em->getRepository("NavFarGameBundle:Game");
        $scoreRepository=$em->getRepository("NavFarGameBundle:Score");
        $game=$gameRepository->findOneBy(array('title'=>$gameName));
        $user=$userRepository->findOneBy(array('username'=>$username));
        if(!$user||!$game)
          throw new \Exception ("Bad Request");
        $lastRecord=$scoreRepository->findOneBy(array('user'=>$user,'game'=>$game),array('amount'=>'DESC'));
        if($lastRecord){
          if($lastRecord->getAmount()<$score)
            $flag=true;
        }

            $lastRecord = new Score();
            $lastRecord->setUser($user);
            $lastRecord->setGame($game);
            $lastRecord->setAmount($score);
            $lastRecord->setLevel(rand(10,25));
            $lastRecord->setDisplacement(rand(-10,15));
            $em->persist($lastRecord);
            $em->flush();

        }
      catch(\Exception $e){
        // dump($e);die();
        return $this->json(array("response" =>false));
      }
      return $this->json(array("response" =>true,'changed'=>$flag));
    }
    /**
    * @Route("/comment/{gameName}",name="addComment")
    * @Method({"POST"})
    */
    public function commentAddAction(Request $request,$gameName){
      $session = $request->getSession();
      $username = $session->get('username',null);
      if(!$username){
        $session->getFlashBag()->add("url","/games?game=".$gameName."#t2");
        return $this->json(array("response" =>false,"log"=>false));
      }
      $comment = $request->request->get('comment',null);
      $rate =$request->request->get('rate',null);
      $flag = false;
      try{
        // dump($username);die();
        if($gameName==""||!$rate||!$comment)
          throw new \Exception ("Bad Request1");
        $em = $this->getDoctrine()->getManager();
        $userRepository=$em->getRepository("NavFarUserBundle:User");
        $gameRepository=$em->getRepository("NavFarGameBundle:Game");
        $commentRepository=$em->getRepository("NavFarGameBundle:Comments");
        $game=$gameRepository->findOneBy(array('title'=>$gameName));
        $user=$userRepository->findOneBy(array('username'=>$username));
        if(!$user||!$game)
          throw new \Exception ("Bad Request");

        $newComment=new Comments();
        $newComment->setGame($game);
        $newComment->setUser($user);
        $newComment->setContent($comment);
        $newComment->setRate($rate);
        $newComment->setDate(new \DateTime());
        $em->persist($newComment);
        $em->flush();
        }

      catch(\Exception $e){
        // dump($e);die();
        return $this->json(array("response" =>false,"log"=>true));
      }
      return $this->json(array("response" =>true,"log"=>true));
    }

}
