package com.icesoft.msdb.domain;

public class Imports {
	private String csvContents;
	private ImportType importType;
	
	public String getCsvContents() {
		return csvContents;
	}
	public void setCsvContents(String csvContents) {
		this.csvContents = csvContents;
	}
	public ImportType getImportType() {
		return importType;
	}
	public void setImportType(ImportType importType) {
		this.importType = importType;
	}
}
