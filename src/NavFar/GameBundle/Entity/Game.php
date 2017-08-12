<?php

namespace NavFar\GameBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Game
 *
 * @ORM\Table(name="game")
 * @ORM\Entity(repositoryClass="NavFar\GameBundle\Repository\GameRepository")
 */
class Game
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255, unique=true)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="abstract", type="string", length=255)
     */
    private $abstract;

    /**
     * @var string
     *
     * @ORM\Column(name="info", type="string", length=1000)
     */
    private $info;

    /**
     * @var string
     *
     * @ORM\Column(name="smallImage", type="string", length=255)
     */
    private $smallImage;

    /**
     * @var string
     *
     * @ORM\Column(name="largeImage", type="string", length=255)
     */
    private $largeImage;

    /**
     * @var float
     *
     * @ORM\Column(name="rate", type="float")
     */
    private $rate;

    /**
    * @ORM\OneToMany(targetEntity="Comments", mappedBy="game")
    */
   private $comments;

   /**
   * @ORM\OneToMany(targetEntity="Score", mappedBy="game")
   */
  private $scores;

  /**
  * @ORM\OneToMany(targetEntity="Categorize", mappedBy="game")
  */
  private $categorizes;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Game
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set abstract
     *
     * @param string $abstract
     *
     * @return Game
     */
    public function setAbstract($abstract)
    {
        $this->abstract = $abstract;

        return $this;
    }

    /**
     * Get abstract
     *
     * @return string
     */
    public function getAbstract()
    {
        return $this->abstract;
    }

    /**
     * Set info
     *
     * @param string $info
     *
     * @return Game
     */
    public function setInfo($info)
    {
        $this->info = $info;

        return $this;
    }

    /**
     * Get info
     *
     * @return string
     */
    public function getInfo()
    {
        return $this->info;
    }

    /**
     * Set smallImage
     *
     * @param string $smallImage
     *
     * @return Game
     */
    public function setSmallImage($smallImage)
    {
        $this->smallImage = $smallImage;

        return $this;
    }

    /**
     * Get smallImage
     *
     * @return string
     */
    public function getSmallImage()
    {
        return $this->smallImage;
    }

    /**
     * Set largeImage
     *
     * @param string $largeImage
     *
     * @return Game
     */
    public function setLargeImage($largeImage)
    {
        $this->largeImage = $largeImage;

        return $this;
    }

    /**
     * Get largeImage
     *
     * @return string
     */
    public function getLargeImage()
    {
        return $this->largeImage;
    }

    /**
     * Set rate
     *
     * @param integer $rate
     *
     * @return Game
     */
    public function setRate($rate)
    {
        $this->rate = $rate;

        return $this;
    }

    /**
     * Get rate
     *
     * @return int
     */
    public function getRate()
    {
        return $this->rate;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->comments = new \Doctrine\Common\Collections\ArrayCollection();
        $this->scores = new \Doctrine\Common\Collections\ArrayCollection();
        $this->categorizes = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add comment
     *
     * @param \NavFar\GameBundle\Entity\Comments $comment
     *
     * @return Game
     */
    public function addComment(\NavFar\GameBundle\Entity\Comments $comment)
    {
        $this->comments[] = $comment;

        return $this;
    }

    /**
     * Remove comment
     *
     * @param \NavFar\GameBundle\Entity\Comments $comment
     */
    public function removeComment(\NavFar\GameBundle\Entity\Comments $comment)
    {
        $this->comments->removeElement($comment);
    }

    /**
     * Get comments
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getComments()
    {
        return $this->comments;
    }

    /**
     * Add score
     *
     * @param \NavFar\GameBundle\Entity\Score $score
     *
     * @return Game
     */
    public function addScore(\NavFar\GameBundle\Entity\Score $score)
    {
        $this->scores[] = $score;

        return $this;
    }

    /**
     * Remove score
     *
     * @param \NavFar\GameBundle\Entity\Score $score
     */
    public function removeScore(\NavFar\GameBundle\Entity\Score $score)
    {
        $this->scores->removeElement($score);
    }

    /**
     * Get scores
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getScores()
    {
        return $this->scores;
    }

    /**
     * Add categorize
     *
     * @param \NavFar\GameBundle\Entity\Categorize $categorize
     *
     * @return Game
     */
    public function addCategorize(\NavFar\GameBundle\Entity\Categorize $categorize)
    {
        $this->categorizes[] = $categorize;

        return $this;
    }

    /**
     * Remove categorize
     *
     * @param \NavFar\GameBundle\Entity\Categorize $categorize
     */
    public function removeCategorize(\NavFar\GameBundle\Entity\Categorize $categorize)
    {
        $this->categorizes->removeElement($categorize);
    }

    /**
     * Get categorizes
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getCategorizes()
    {
        return $this->categorizes;
    }
    public function __toString(){

    }
    public function toArray($baseURL){
      return      array("title"=>$this->title,
                  "abstract"=>$this->abstract,
                  "info"=>$this->info,
                  "rate"=>$this->rate,
                  "number_of_comments"=>sizeof($this->comments),
                  "large_image"=>$baseURL.$this->largeImage,
                  "small_image"=>$baseURL.$this->smallImage,
                  "categories"=>$this->allCategories());
    }
    public function allCategories(){
      $temp =  array();
      for($i=0;$i<sizeof($this->categorizes);$i++){
        $temp[]=$this->categorizes[$i]->getCategory()->getName();
      }
      return $temp;
    }
}
