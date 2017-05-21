package com.icesoft.msdb.web.rest.view;

public class MSDBView {
	
	public static interface SessionResultsView {}
	
	public static interface SeriesEditionsView {}
	
	public static interface SeriesEditionDetailView extends SeriesEditionsView, SessionResultsView {}

}
