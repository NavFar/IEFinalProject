<?php

namespace NavFar\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Categorize
 *
 * @ORM\Table(name="categorize")
 * @ORM\Entity(repositoryClass="NavFar\GameBundle\Repository\CategorizeRepository")
 */
class Categorize
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
    * @ORM\ManyToOne(targetEntity="Game", inversedBy="categorizes")
    * @ORM\JoinColumn(name="game_id", referencedColumnName="id")
    */
    private $game;

    /**
    * @ORM\ManyToOne(targetEntity="Category", inversedBy="categorizes")
    * @ORM\JoinColumn(name="category_id", referencedColumnName="id")
    */
    private $category;

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
     * Set game
     *
     * @param \NavFar\GameBundle\Entity\Game $game
     *
     * @return Categorize
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
     * Set category
     *
     * @param \NavFar\GameBundle\Entity\Category $category
     *
     * @return Categorize
     */
    public function setCategory(\NavFar\GameBundle\Entity\Category $category = null)
    {
        $this->category = $category;

        return $this;
    }

    /**
     * Get category
     *
     * @return \NavFar\GameBundle\Entity\Category
     */
    public function getCategory()
    {
        return $this->category;
    }
}
