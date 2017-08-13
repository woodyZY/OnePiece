package com.onePiece.entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Cascade;

@Entity
@Table(name="T_GROUP")
public class Group implements Cloneable {
	private int id;
	private String groupName;
	private String groupImgSrc;
	private int number;
	private Set<Pirate> pirates = new HashSet<Pirate>();
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getGroupName() {
		return groupName;
	}
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
	
	public String getGroupImgSrc() {
		return groupImgSrc;
	}
	public void setGroupImgSrc(String groupImgSrc) {
		this.groupImgSrc = groupImgSrc;
	}
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	@OneToMany(mappedBy="group",fetch=FetchType.LAZY)
	@Cascade({org.hibernate.annotations.CascadeType.SAVE_UPDATE,org.hibernate.annotations.CascadeType.DELETE_ORPHAN})

	public Set<Pirate> getPirates() {
		return pirates;
	}
	public void setPirates(Set<Pirate> pirates) {
		this.pirates = pirates;
	}
	@Override
	public Object clone() throws CloneNotSupportedException {
		// TODO Auto-generated method stub
		Group group = null;
		try {
			group = (Group) super.clone();
			return group;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

}
