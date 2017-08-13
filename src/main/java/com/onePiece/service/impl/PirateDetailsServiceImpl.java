package com.onePiece.service.impl;

import javax.annotation.Resource;

import org.springframework.dao.support.DaoSupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.onePiece.dao.PirateDetailsDao;
import com.onePiece.entity.PirateDetails;
import com.onePiece.service.PirateDetailsService;
@Service("pdService")
@Transactional
public class PirateDetailsServiceImpl implements PirateDetailsService {

	@Resource(name="pdDao")
	private PirateDetailsDao pirateDetailsDao;
	@Override
	public void addPirateDetails(PirateDetails pirateDetails) {
		// TODO Auto-generated method stub
		pirateDetailsDao.addPirateDetails(pirateDetails);
	}
	@Override
	public void updatePirateDetails(PirateDetails pirateDetails) {
		// TODO Auto-generated method stub
        pirateDetailsDao.updatePirateDetails(pirateDetails);
	}
	@Override
	public void deletePirateDetails(int id) {
		// TODO Auto-generated method stub
		pirateDetailsDao.deletePirateDetails(id);
	}

}
