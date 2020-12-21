package com.icesoft.msdb.service.dto;

import com.icesoft.msdb.domain.EventEditionEntry;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class SessionWinnersDTO {

	private final String session;
	private final List<CategoryWinner> winners;

	public class DriverInfo {
	    private String driverName;
	    private String portraitUrl;

	    public DriverInfo(String driverName, String portraitUrl) {
	        this.driverName = driverName;
	        this.portraitUrl = portraitUrl;
        }

        public String getDriverName() {
            return driverName;
        }

        public String getPortraitUrl() {
            return portraitUrl;
        }
    }

	public class CategoryWinner implements Comparable<CategoryWinner> {
		private final String category;
		private final List<DriverInfo> drivers;

		CategoryWinner(String category, List<DriverInfo> drivers) {
			this.category = category;
			this.drivers = drivers;
		}

		public String getCategory() {
			return category;
		}

		public List<DriverInfo> getDrivers() {
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

	public SessionWinnersDTO(String session) {
		this.session = session;
		winners = new ArrayList<>();
	}

	public void addWinners(String category, EventEditionEntry entry) {
		winners.add(
		    new CategoryWinner(
		        category,
                entry.getDrivers().stream()
                    .map(d -> new DriverInfo(d.getDriver().getFullName(), d.getDriver().getPortraitUrl())).collect(Collectors.toList())));
	}

	public String getSession() {
		return session;
	}

	public List<CategoryWinner> getWinners() {
		return winners;
	}

	public int getNumberOfCategories() {
		if (winners == null) return 0;
		return winners.size();
	}

}
