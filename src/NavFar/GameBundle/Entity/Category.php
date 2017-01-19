<?php

namespace NavFar\GameBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Category
 *
 * @ORM\Table(name="category")
 * @ORM\Entity(repositoryClass="NavFar\GameBundle\Repository\CategoryRepository")
 */
class Category
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
     * @ORM\Column(name="name", type="string", length=255, unique=true)
     */
    private $name;

    /**
    * @ORM\OneToMany(targetEntity="Categorize", mappedBy="category")
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
     * Set name
     *
     * @param string $name
     *
     * @return Category
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->categorizes = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add categorize
     *
     * @param \NavFar\GameBundle\Entity\Categorize $categorize
     *
     * @return Category
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
}
