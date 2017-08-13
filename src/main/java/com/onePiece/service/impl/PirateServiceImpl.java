package com.onePiece.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.onePiece.dao.PirateDao;
import com.onePiece.entity.Pirate;
import com.onePiece.service.PirateService;
@Service("pirateService")
@Transactional
public class PirateServiceImpl implements PirateService {

	@Resource(name="pirateDao")
	private PirateDao pirateDao;
	@Override
	public void addPirate(Pirate pirate) {
		// TODO Auto-generated method stub
		pirateDao.addPirate(pirate);
	}

	@Override
	public void deletePirate(String pirateName) {
		// TODO Auto-generated method stub
		pirateDao.deletePirate(pirateName);
	}

	@Override
	public void updatePirate(Pirate pirate) {
		// TODO Auto-generated method stub
		pirateDao.updatePirate(pirate);
	}

	@Override
	public Pirate queryPirate(String pirateName) {
		// TODO Auto-generated method stub
		return pirateDao.queryPirate(pirateName);
	}

	@Override
	public List<Pirate> queryPirates() {
		// TODO Auto-generated method stub
		return pirateDao.queryPirates();
	}

	@Override
	public List<Pirate> searchPirates(String searchString) {
		// TODO Auto-generated method stub
		return pirateDao.searchPirates(searchString);
	}

	@Override
	public void setGroupNull(String pirateName) {
		// TODO Auto-generated method stub
	     pirateDao.setGroupNull(pirateName);
	}

}
