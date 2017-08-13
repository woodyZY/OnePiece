package com.onePiece.dao;

import java.util.List;

import com.onePiece.entity.Group;


public interface GroupDao {
	public void addGroup(Group group);
	public void deleteGroup(String groupName);
	public void updateGroup(Group group);
	public Group queryGroup(String groupName);
	public List<Group> queryGroups(Integer min,Integer max);
	public List<Group> searchGroups(String searchString);
}
