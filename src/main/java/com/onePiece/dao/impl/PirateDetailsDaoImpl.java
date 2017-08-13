package com.onePiece.dao.impl;

import java.util.List;

import javax.annotation.Resource;

import oracle.net.aso.p;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.onePiece.dao.PirateDetailsDao;
import com.onePiece.entity.PirateDetails;
@Repository("pdDao")
@Transactional
public class PirateDetailsDaoImpl implements PirateDetailsDao {

	@Resource
	private SessionFactory sessionFactory;
	
	public Session getSession() {
		return sessionFactory.getCurrentSession();
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	public void addPirateDetails(PirateDetails pirateDetails) {
		// TODO Auto-generated method stub
		getSession().save(pirateDetails);
	}

	@Override
	public void updatePirateDetails(PirateDetails pirateDetails) {
		// TODO Auto-generated method stub
		String hql = "update PirateDetails pd set pd.story=?," +
				                                                    "pd.skillsSet=? where pd.id=?";
		getSession().createQuery(hql).setParameter(0, pirateDetails.getStory())
		                                           .setParameter(1, pirateDetails.getSkillsSet())
		                                           .setParameter(2, pirateDetails.getId())
		                                           .executeUpdate();
	}

	@Override
	public void deletePirateDetails(int id) {
		// TODO Auto-generated method stub
		String hql = "delete from PirateDetails pd where pd.id=?";
		getSession().createQuery(hql).setParameter(0, id).executeUpdate();
	}

}
