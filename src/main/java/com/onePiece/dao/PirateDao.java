package com.onePiece.dao;

import java.util.List;

import com.onePiece.entity.Pirate;

public interface PirateDao {
	public void addPirate(Pirate pirate);
	public void deletePirate(String pirateName);
	public void updatePirate(Pirate pirate);
	public void setGroupNull(String pirateName);
	public Pirate queryPirate(String pirateName);
	public List<Pirate> queryPirates();
	public List<Pirate>searchPirates(String searchString);
}
