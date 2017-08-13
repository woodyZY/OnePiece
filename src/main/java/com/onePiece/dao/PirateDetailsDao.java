package com.onePiece.dao;

import java.util.List;

import com.onePiece.entity.PirateDetails;

public interface PirateDetailsDao {
	public void addPirateDetails(PirateDetails pirateDetails);
	public void updatePirateDetails(PirateDetails pirateDetails);
	public void deletePirateDetails(int id);
}
