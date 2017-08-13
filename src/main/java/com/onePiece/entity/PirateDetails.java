package com.onePiece.entity;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name="T_PIRATEDETAILS")
public class PirateDetails {
	private int id;
	private Pirate pirate;
	private String story;
	private String weapon;
	private String[] skillsSet;
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}	
	public void setId(int id) {
		this.id = id;
	}
	@OneToOne(cascade=CascadeType.ALL,mappedBy="details")
	public Pirate getPirate() {
		return pirate;
	}
	public void setPirate(Pirate pirate) {
		this.pirate = pirate;
	}
	public String getStory() {
		return story;
	}
	public void setStory(String story) {
		this.story = story;
	}

	public String getWeapon() {
		return weapon;
	}
	public void setWeapon(String weapon) {
		this.weapon = weapon;
	}
    
	public String[] getSkillsSet() {
		return skillsSet;
	}
	public void setSkillsSet(String[] skillsSet) {
		this.skillsSet = skillsSet;
	}
	
}
