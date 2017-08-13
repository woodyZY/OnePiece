package com.onePiece.entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name="T_PIRATE")
public class Pirate {
	private int id;
	private String pirateName;
	private String pirateImgSrc;
	private Group group;
	private String position;
	private int bounty;
	private PirateDetails details;
	
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getPirateName() {
		return pirateName;
	}
	public void setPirateName(String pirateName) {
		this.pirateName = pirateName;
	}
	public String getPirateImgSrc() {
		return pirateImgSrc;
	}
	public void setPirateImgSrc(String pirateImgSrc) {
		this.pirateImgSrc = pirateImgSrc;
	}
	@ManyToOne(cascade=CascadeType.ALL,fetch=FetchType.EAGER)
	@JoinColumn(name="p_id")
	public Group getGroup() {
		return group;
	}
	public void setGroup(Group group) {
		this.group = group;
	}
	public String getPosition() {
		return position;
	}
	public void setPosition(String position) {
		this.position = position;
	}
	public int getBounty() {
		return bounty;
	}
	public void setBounty(int bounty) {
		this.bounty = bounty;
	}
	@OneToOne(cascade=CascadeType.ALL,fetch=FetchType.LAZY)
	@JoinColumn(name="pd_id")
	public PirateDetails getDetails() {
		return details;
	}
	public void setDetails(PirateDetails details) {
		this.details = details;
	}
	public Pirate(){
		
	}
}
