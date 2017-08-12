<?php

namespace NavFar\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Score
 *
 * @ORM\Table(name="score")
 * @ORM\Entity(repositoryClass="NavFar\GameBundle\Repository\ScoreRepository")
 */
class Score
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
     * @var int
     *
     * @ORM\Column(name="amount", type="integer")
     */
    private $amount;

    /**
     * @var int
     *
     * @ORM\Column(name="level", type="integer")
     */
    private $level;

    /**
     * @var int
     *
     * @ORM\Column(name="displacement", type="integer")
     */
    private $displacement;


    /**
    * @ORM\ManyToOne(targetEntity="Game", inversedBy="scores")
    * @ORM\JoinColumn(name="game_id", referencedColumnName="id")
    */
    private $game;

    /**
    * @ORM\ManyToOne(targetEntity="NavFar\UserBundle\Entity\User", inversedBy="scores")
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
     * Set amount
     *
     * @param integer $amount
     *
     * @return Score
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;

        return $this;
    }

    /**
     * Get amount
     *
     * @return int
     */
    public function getAmount()
    {
        return $this->amount;
    }

    /**
     * Set game
     *
     * @param \NavFar\GameBundle\Entity\Game $game
     *
     * @return Score
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
     * @return Score
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
    public function toArray($baseURL){
        return array(
          'score'=>$this->amount,
          'level'=>$this->level,
          'displacement'=>$this->displacement,
          'player'=>$this->user->toArray($baseURL)
        );
    }

    /**
     * Set level
     *
     * @param integer $level
     *
     * @return Score
     */
    public function setLevel($level)
    {
        $this->level = $level;

        return $this;
    }

    /**
     * Get level
     *
     * @return integer
     */
    public function getLevel()
    {
        return $this->level;
    }

    /**
     * Set displacement
     *
     * @param integer $displacement
     *
     * @return Score
     */
    public function setDisplacement($displacement)
    {
        $this->displacement = $displacement;

        return $this;
    }

    /**
     * Get displacement
     *
     * @return integer
     */
    public function getDisplacement()
    {
        return $this->displacement;
    }
}
