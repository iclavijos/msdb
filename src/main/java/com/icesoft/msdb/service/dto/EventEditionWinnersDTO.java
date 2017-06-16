package com.icesoft.msdb.service.dto;

import java.util.ArrayList;
import java.util.List;

public class EventEditionWinnersDTO {

	private final String session;
	private final List<CategoryWinner> winners;
	
	public class CategoryWinner implements Comparable<CategoryWinner> {
		private final String category;
		private final String drivers;
		
		CategoryWinner(String category, String drivers) {
			this.category = category;
			this.drivers = drivers;
		}

		public String getCategory() {
			return category;
		}

		public String getDrivers() {
			return drivers;
		}

		@Override
		public int compareTo(CategoryWinner o) {
			if (this.category.equals("Overall")) {
				return -1;
			}
			if (o != null && o.category.equals("Overall")) {
				return 1;
			}
			return this.getCategory().compareTo(o.getCategory());
		}
	}
	
	public EventEditionWinnersDTO(String session) {
		this.session = session;
		winners = new ArrayList<>();
	}
	
	public void addWinners(String category, String drivers) {
		winners.add(new CategoryWinner(category, drivers));
	}

	public String getSession() {
		return session;
	}
	
	public List<CategoryWinner> getWinners() {
		return winners;
	}
	
}
