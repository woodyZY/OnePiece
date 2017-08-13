package com.onePiece.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.onePiece.dao.GroupDao;
import com.onePiece.entity.Group;
import com.onePiece.service.GroupService;
@Service("groupService")
@Transactional
public class GroupServiceImpl implements GroupService {

	@Resource(name="groupDao")
	private GroupDao groupDao;
	@Override
	public void addGroup(Group group) {
		// TODO Auto-generated method stub
		groupDao.addGroup(group);
	}

	@Transactional
	@Override
	public void deleteGroup(String groupName) {
		// TODO Auto-generated method stub
            
			groupDao.deleteGroup(groupName);

	}

	@Override
	public void updateGroup(Group group) {
		// TODO Auto-generated method stub
		groupDao.updateGroup(group);
	}

	@Override
	public Group queryGroup(String groupName) {
		// TODO Auto-generated method stub
		return groupDao.queryGroup(groupName);
	}

	@Override
	public List<Group> queryGroups(Integer min,Integer max) {
		// TODO Auto-generated method stub
		return groupDao.queryGroups(min,max);
	}

	@Override
	public List<Group> searchGroups(String searchString) {
		// TODO Auto-generated method stub
		return groupDao.searchGroups(searchString);
	}
	
}
