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
}
