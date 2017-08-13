package com.onePiece.dao.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.onePiece.dao.GroupDao;
import com.onePiece.entity.Group;

@Repository("groupDao")
@Transactional
public class GroupDaoImpl implements GroupDao {

	@Resource
	private SessionFactory sessionFactory;
	
	public Session getSession() {
		return sessionFactory.getCurrentSession();
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	public void addGroup(Group group) {
		// TODO Auto-generated method stub
		getSession().save(group);
		return;
	}

	@Override
	public void deleteGroup(String groupName) {
		// TODO Auto-generated method stub
		String hql = "delete from Group where groupName=?";
		getSession().createQuery(hql).setParameter(0, groupName).executeUpdate();
		return;
	}

	@Override
	public void updateGroup(Group group) {
		// TODO Auto-generated method stub
		String hql = "update Group t_group set t_group.number=?" +
				                                               "where t_group.groupName=?";
		getSession().createQuery(hql).setParameter(0, group.getNumber())
		                                           .setParameter(1, group.getGroupName())
		                                           .executeUpdate();
	}

	@Override
	public Group queryGroup(String groupName) {
		// TODO Auto-generated method stub
		String hql = "from Group group where group.groupName=?";
		return (Group) getSession().createQuery(hql).setParameter(0, groupName).uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Group> queryGroups(Integer min,Integer max) {
		// TODO Auto-generated method stub
		String hql = "from Group";
		if(min==null||max==null){
			return getSession().createQuery(hql).list();
		}
		else{
			return getSession().createQuery(hql).setFirstResult(min)
					                                              .setMaxResults(max)
					                                              .list();
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Group> searchGroups(String searchString) {
		// TODO Auto-generated method stub
		String hql = "from Group group where group.groupName like '%"+searchString+"%'";
		List<Group>groups = getSession().createQuery(hql).list();
		return groups;
	}

}
