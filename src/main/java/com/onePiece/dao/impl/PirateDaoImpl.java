package com.onePiece.dao.impl;

import java.util.List;

import javax.annotation.Resource;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.onePiece.dao.PirateDao;
import com.onePiece.entity.Group;
import com.onePiece.entity.Pirate;
@Repository("pirateDao")
@Transactional
public class PirateDaoImpl implements PirateDao {

	@Resource
	private SessionFactory sessionFactory;
	
	public Session getSession() {
		return sessionFactory.getCurrentSession();
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Override
	public void addPirate(Pirate pirate) {
		// TODO Auto-generated method stub
		getSession().save(pirate);
	}

	@Override
	public void deletePirate(String pirateName) {
		// TODO Auto-generated method stub
		String hql = "delete From Pirate pirate where pirate.pirateName=?";
		getSession().createQuery(hql).setParameter(0, pirateName).executeUpdate();
	}

	@Override
	public void updatePirate(Pirate pirate) {
		// TODO Auto-generated method stub
		
		Group group = pirate.getGroup();
		if(group==null){
			String hql = "update Pirate pirate set pirate.bounty=?," +
		                                                "pirate.pirateImgSrc=?"+
									                    "pirate.details=?" +
									                    "where pirate.pirateName=?";
			getSession().createQuery(hql).setParameter(0, pirate.getBounty())
			.setParameter(1, pirate.getPirateImgSrc())
            .setParameter(2, pirate.getDetails())
            .setParameter(3, pirate.getPirateName())
            .executeUpdate();
		}
		else{
			String hql = "update Pirate pirate set pirate.group=?," +
                    "pirate.position=?," +
					"pirate.pirateImgSrc=?,"+
                    "pirate.bounty=?," +
                    "pirate.details=?" +
                    "where pirate.pirateName=?";
		getSession().createQuery(hql).setParameter(0, pirate.getGroup())
		                                           .setParameter(1, pirate.getPosition())
		                                           .setParameter(2, pirate.getPirateImgSrc())
		                                           .setParameter(3, pirate.getBounty())
		                                           .setParameter(4, pirate.getDetails())
		                                           .setParameter(5, pirate.getPirateName())
		                                           .executeUpdate();
		}
	}

	@Override
	public Pirate queryPirate(String pirateName) {
		// TODO Auto-generated method stub
		String hql = "from Pirate pirate where pirate.pirateName=?";
		return (Pirate) getSession().createQuery(hql).setParameter(0, pirateName).uniqueResult();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Pirate> queryPirates() {
		// TODO Auto-generated method stub
		String hql = "from Pirate";
		return getSession().createQuery(hql).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Pirate> searchPirates(String searchString) {
		// TODO Auto-generated method stub
		String hql = "from Pirate pirate where pirate.pirateName like '%"+searchString+"%'";
		List<Pirate>pirates = getSession().createQuery(hql).list();
		return pirates;
	}

	@Override
	public void setGroupNull(String pirateName) {
		// TODO Auto-generated method stub
		String hql = "update Pirate pirate set p_id=? where pirate.pirateName=?";
		getSession().createQuery(hql).setParameter(0, null)
		                                           .setParameter(1, pirateName).executeUpdate();
	}

}
