<?php

namespace NavFar\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Comments
 *
 * @ORM\Table(name="comments")
 * @ORM\Entity(repositoryClass="NavFar\GameBundle\Repository\CommentsRepository")
 */
class Comments
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
     * @ORM\Column(name="content", type="string", length=500)
     */
    private $content;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="date")
     */
    private $date;

    /**
     * @var float
     *
     * @ORM\Column(name="rate", type="float")
     */
    private $rate;

    /**
    * @ORM\ManyToOne(targetEntity="Game", inversedBy="comments")
    * @ORM\JoinColumn(name="game_id", referencedColumnName="id")
    */
    private $game;

    /**
    * @ORM\ManyToOne(targetEntity="NavFar\UserBundle\Entity\User", inversedBy="comments")
    * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
    */
    private $user;

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
     * Set content
     *
     * @param string $content
     *
     * @return Comments
     */
    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }

    /**
     * Get content
     *
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Set game
     *
     * @param \NavFar\GameBundle\Entity\Game $game
     *
     * @return Comments
     */
    public function setGame(\NavFar\GameBundle\Entity\Game $game = null)
    {
        $this->game = $game;

        return $this;
    }

    /**
     * Get game
     *
     * @return \NavFar\GameBundle\Entity\Game
     */
    public function getGame()
    {
        return $this->game;
    }

    /**
     * Set user
     *
     * @param \NavFar\UserBundle\Entity\User $user
     *
     * @return Comments
     */
    public function setUser(\NavFar\UserBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \NavFar\UserBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }
    public function toArray($avatarBase,$ImageBase){
      return array('text'=>$this->content,
                   'rate'=>$this->rate,
                   'date'=>$this->date->format('Y-m-d'),
                   'player'=>$this->user->toArray($avatarBase),
                   'game'=>$this->game->toArray($ImageBase));
    }

    /**
     * Set date
     *
     * @param \DateTime $date
     *
     * @return Comments
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date
     *
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set rate
     *
     * @param integer $rate
     *
     * @return Comments
     */
    public function setRate($rate)
    {
        $this->rate = $rate;

        return $this;
    }

    /**
     * Get rate
     *
     * @return integer
     */
    public function getRate()
    {
        return $this->rate;
    }
}
